from re import I
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np
import FinanceDataReader as fdr
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
import datetime
import time
import os
import transformer

plt.style.use("ggplot")
print(tf.__version__)
print(fdr.__version__)
print(tf.config.list_physical_devices('GPU'))

index_list = ['NASDAQCOM', 'ICSA', 'UMCSENT', 'M2SL', 'T10YIE', 'T10Y2Y']
col_feature = ['Volume'] + index_list + ['ma5', 'ma10','ma15', 'ma20', 'ma25', 'ma30']
col_label = ['Label0', 'Label1', 'Label2']

def moving_average(data: pd.Series, day: int):
    return (data.rolling(day).sum().div(day * data) - 1) * 100

def preprocessing(df, date: str):
  df.replace(0, np.NaN, inplace=True)
  df.fillna(df.mean(), inplace=True)
  # Close
  close = df[['Close']].pct_change() * 100
  # Open, High, Low
  o_h_l = (df.loc[:, ['Open', 'High', 'Low']].div(df['Close'], axis=0) - 1) * 100
  volume = df[['Volume']].pct_change() * 100
  # MA
  ma = []
  for day in [5, 10, 15, 20, 25, 30]:
    ma.append(df[['Close']].apply(moving_average, day=day).rename(columns={'Close': f'ma{day}'}))

  indexes = fdr.DataReader(index_list, start=date, data_source='fred')
  
  # NASDAQ
  idxs = indexes[index_list].pct_change() * 100

  data = pd.concat([close, o_h_l, volume, idxs] + ma, levels=0, axis=1)
  cols_max = data.columns[data.isnull().sum() == data.isnull().sum().max()]
  data = data.loc[~data[cols_max].isnull().values, :].replace([np.inf, -np.inf], np.nan).\
    fillna(method='ffill').fillna(0.0).reset_index(level=0)
  
  data['Label0'] = 0
  data['Label1'] = 0
  data['Label2'] = 0

  data.loc[(data['Close'] >= -0.5), ['Label1']] = 1
  data.loc[(data['Close'] >= 0.5), ['Label2']] = 1
  data.loc[(data['Close'] >= 0.5), ['Label1']] = 0

  data.loc[(data['Close'] < 0.5), ['Label1']] = 1
  data.loc[(data['Close'] < -0.5), ['Label0']] = 1
  data.loc[(data['Close'] < -0.5), ['Label1']] = 0
  
  return data


def create_window_set(data, window_size, col_feature, col_label,
                      test_size=0.1, tf=False, shuffle=False):
  X = []
  Y = []
  
  for i in range(0, len(data)-window_size):
    temp = []
    temp2 = []
    
    # loc은 end가 포함임
    temp = data.loc[i:i+window_size-1, col_feature]
    temp2 = data.loc[i+window_size, col_label]
    
    X.append(np.array(temp).reshape(window_size, len(col_feature)))
    Y.append(np.array(temp2))
  
  x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, shuffle=shuffle)

  train_X = np.array(x_train)
  test_X = np.array(x_test)
  train_Y = np.array(y_train)
  test_Y = np.array(y_test)

  if tf is False:
    train_X = train_X.reshape(train_X.shape[0],1,window_size,len(col_feature))
    train_Y = train_Y.reshape(train_Y.shape[0],1,len(col_label))
    test_X = test_X.reshape(test_X.shape[0],1,window_size,len(col_feature))
    test_Y = test_Y.reshape(test_Y.shape[0],1,len(col_label))
  
  return train_X, train_Y, test_X, test_Y


def cnn_categorical(window_size, columns):
  model = tf.keras.Sequential(name="student")

  # CNN layers
  model.add(layers.Conv1D(64, kernel_size=3, activation='relu',
                          input_shape=(window_size, columns)))
  
  model.add(layers.MaxPooling1D(2))
  model.add(layers.Conv1D(128, kernel_size=3, activation='relu'))
  model.add(layers.MaxPooling1D(2))
  model.add(layers.Conv1D(64, kernel_size=3, activation='relu'))
  model.add((layers.MaxPooling1D(2)))
  model.add(layers.Flatten())
  # Dense layers
  model.add(layers.Dense(3, activation='softmax'))
  
  model.compile(
    optimizer='sgd',
    loss='categorical_crossentropy',
    metrics=['categorical_accuracy'],
  )
  
  return model

def transformer_categorical(seq_len, col_nums, d_k, d_v, n_heads, ff_dim):
  '''Initialize time and transformer layers'''
  
  time_embedding = transformer.Time2Vector(seq_len)
  attn_layer1 = transformer.TransformerEncoder(d_k, d_v, n_heads, ff_dim)
  attn_layer2 = transformer.TransformerEncoder(d_k, d_v, n_heads, ff_dim)
  attn_layer3 = transformer.TransformerEncoder(d_k, d_v, n_heads, ff_dim)

  '''Construct model'''
  in_seq = layers.Input(shape=(seq_len, col_nums))
  x = time_embedding(in_seq)
  x = layers.Concatenate(axis=-1)([in_seq, x])
  x = attn_layer1((x, x, x))
  x = attn_layer2((x, x, x))
  x = attn_layer3((x, x, x))
  x = layers.GlobalAveragePooling1D(data_format='channels_first')(x)
  x = layers.Dropout(0.1)(x)
  x = layers.Dense(64, activation='relu')(x)
  x = layers.Dropout(0.1)(x)
  out = layers.Dense(3, activation='softmax')(x)

  model = tf.keras.Model(inputs=in_seq, outputs=out)
  
  model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['categorical_accuracy'],
  )
  return model

# this func is deprecated
def predict(model, data, column, scaled_X, scaled_Y):
  return 0.0


def predict_deprecated(model, data, column, scaled_X, scaled_Y):
  train_predicted = model.predict(scaled_X)
  train_label = (scaled_Y[:, 0])

  X = []
  Y = []

  train_predicted = np.array(train_predicted[:,0]).reshape(-1,1)
  len_t = len(scaled_X)
  # plt.figure(figsize=(18, 10))
  for j in range(0, len_t):
      temp = data.iloc[j,column]
      X.append(train_predicted[j] * temp + temp)
      Y.append(train_label[j] * temp + temp)
  return X
  # plt.plot(X, color = 'black', label = 'Predicted  Stock Price')
  # plt.plot(Y, color = 'green', label = 'Real Stock Price')
  # plt.title(' Stock Price Prediction')
  # plt.xlabel('Time')
  # plt.ylabel(' Stock Price')
  # plt.legend()
  # plt.show()
