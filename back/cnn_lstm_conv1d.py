import pandas as pd
import tensorflow as tf
import numpy as np
import math
import datetime
import time
import datetime as dt
import matplotlib.pyplot as plt
from pandas.plotting import autocorrelation_plot
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import * 
from tensorflow.keras.layers import * 
from tensorflow.keras.regularizers import L1, L2
from tensorflow.keras.metrics import Accuracy


def erase_zero(data):
  data.replace(0, np.NaN, inplace=True)
  data.fillna(data.mean(), inplace=True)
  return data

def create_window_set(df, window_size, test_size=0.2):
  X = []
  Y = []
  column = 5
  for i in range(0 , len(df) - window_size, 1):
    first = df.iloc[i,column]
    temp = []
    temp2 = []
    
    for j in range(window_size):
        temp.append((df.iloc[i + j, column] - first) / first)
    
    temp2.append((df.iloc[i + window_size, column] - first) / first)
    
    X.append(np.array(temp).reshape(window_size, 1))
    Y.append(np.array(temp2).reshape(1, 1))
  
  x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, shuffle=False)

  train_X = np.array(x_train)
  test_X = np.array(x_test)
  train_Y = np.array(y_train)
  test_Y = np.array(y_test)

  train_X = train_X.reshape(train_X.shape[0],1,window_size,1)
  test_X = test_X.reshape(test_X.shape[0],1,window_size,1)

  return train_X, train_Y, test_X, test_Y


def build_model(window_size):
  model = tf.keras.Sequential()
  
  model.add(TimeDistributed(Conv1D(64, kernel_size=3, activation='relu', input_shape=(None, window_size, 1))))
  model.add(TimeDistributed(MaxPooling1D(2)))
  model.add(TimeDistributed(Conv1D(128, kernel_size=3, activation='relu')))
  model.add(TimeDistributed(MaxPooling1D(2)))
  model.add(TimeDistributed(Conv1D(64, kernel_size=3, activation='relu')))
  model.add(TimeDistributed(MaxPooling1D(2)))
  model.add(TimeDistributed(Flatten()))

  model.add(Bidirectional(LSTM(100, return_sequences=True)))
  model.add(Dropout(0.5))
  model.add(Bidirectional(LSTM(100, return_sequences=False)))
  model.add(Dropout(0.5))

  model.add(Dense(1, activation='linear'))
  model.compile(optimizer='adam', loss='mse', metrics=['mse', 'mae'])
  return model


def predict(model, data, column, scaled_X, scaled_Y):
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
