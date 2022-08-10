from flask import Flask, request, jsonify
from flask import jsonify
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from time import sleep
import time
import pandas as pd
from pykrx import stock
import json
import cnn_lstm_conv1d as cnn_lstm
import numpy as np
import FinanceDataReader as fdr
import re
import os
import sys
import urllib.request
client_id = "vXyRpnX778p3HV9msFsS"
client_secret = "MvxaxQ9bw8"
code="005930"
# 검색어 트렌드 주소
url = "https://openapi.naver.com/v1/datalab/search"; 
# body = "{\"startDate\":\"2017-01-01\",\"endDate\":\"2017-04-30\",\"timeUnit\":\"month\",\"keywordGroups\":[{\"groupName\":\"한글\",\"keywords\":[\]},{\"groupName\":\"영어\",\"keywords\":[\"영어\",\"english\"]}],\"device\":\"pc\",\"ages\":[\"1\",\"2\"],\"gender\":\"f\"}";


# body = urllib.parse.urlencode(body)
app = Flask(__name__)
today = datetime.today().strftime("%Y%m%d")
last_year = (datetime.today()-timedelta(365)).strftime("%Y%m%d")

# -------- 코드를 기업이름으로 변환
def stc_code_to_nm(stock_code):
    stock_name = stock.get_market_ticker_name(stock_code)
    return stock_name

def relate_code_crawl(co):
    # 연관 종목코드 있는 페이지 불러오기
    url = 'https://finance.naver.com/item/main.naver?code='+str(co)
    page = pd.read_html(url, encoding='CP949')
    # 연관 종목명과 종목코드 뽑아내기(code_list[0]은 '종목명'이어서 제외)
    code_list = page[4].columns.tolist()
    code_list = code_list[1:]
    # 종목코드 리스트 반환
    codes = []
    for word in (code_list):
        codes.append(word[-6:])

    return codes


def fn_craw(stock_code='005930'):
    """
       # 테이블만 크롤링
       # kind
           : 0 (전일&당일 상한가, 하한가, 거래량 등) #TODO 가공 필요
             1 (증권사 별 매도 매수 정보) #TODO 가공 필요(컬럼이름)
             2 (외국인, 기관 거래 정보) #TODO 가공 필요
             3 (기업실적분석(연도별 분기별 주요재무 정보)) #TODO 가공 필요?
             4 (동일업종비교) #TODO 가공 필요?
             5 (시가총액, 주식수, 액면가 정보) #TODO 가공 필요
             6 (외국인 주식 한도, 보유 정보)
             7 (목표주가 정보) #TODO 가공 필요
             8 (PER, PBR 배당수익률 정보) (주가 따라 변동) #TODO 가공 필요
             9 (동일업종 PER, 등락률 정보) #TODO 가공 필요
             10 (호가 10단계)
             11 (인기 검색 종목: 코스피) #TODO 가공 필요
             12 (인기 검색 종목: 코스닥) #TODO 가공 필요
       """

    gcode = str(stock_code)

    url = f"https://finance.naver.com/item/main.naver?code={gcode}"
    table_list = pd.read_html(url, encoding='euc-kr')

    # print(table_list[3]['최근 연간 실적'].iloc[:,2])

    return table_list
# 전일 대비 등락률


@app.route('/api/up_down/<co>')
def up_down(co):
    url = f"https://finance.naver.com/item/main.naver?code={co}"
    table_list = pd.read_html(url, encoding='euc-kr')
    js = table_list[4].iloc[1:3, [1]].to_json(
        orient='split', force_ascii=False)
    return js


@app.route('/api/info/<co>')
def chart(co):
    print(co)
    df = stock.get_market_ohlcv_by_date(last_year, today, co)
    js = df.to_json(orient='table', force_ascii=False, date_format='iso')
    print(df)
    print(js)
    print(datetime.today().strftime("%Y%m%d"))
    return js


@app.route('/api/article/<co>')
def article(co):
    tot_list = []

    for p in range(1):
        # 뉴스 기사 모인 페이지
        url = 'https://m.stock.naver.com/domestic/stock/' + str(
            co) + '/news/title'  # https://m.stock.naver.com/domestic/stock/003550/total
        # F12누르면 나오는 네트워크상에서 찾아온 경로
        # https://m.stock.naver.com/api/news/stock/005930?pageSize=20&page=1&searchMethod=title_entity_id.basic
        url = "https://m.stock.naver.com/api/news/stock/" + str(
            co) + "?pageSize=5&searchMethod=title_entity_id.basic&page=1"
        res = requests.get(url)

        news_list = json.loads(res.text)
        # 페이지에서 가져온 전체 뉴스기사를 for문으로 분리
        # print(news_list[0])
        for i, news in enumerate(news_list):
            # 신문사 id
            a = news['items'][0]['officeId']
            # 기사 id
            b = news['items'][0]['articleId']
            list = []
            list.append(news['items'][0]['officeName'])  # 신문사
            list.append(news['items'][0]['datetime'][:8])  # 날짜
            list.append(news['items'][0]['title'].replace(
                '&quot;', '\"'))  # 제목
            list.append(news['items'][0]['imageOriginLink'])  # 이미지
            list.append(news['items'][0]['body'].replace(
                '&quot;', '\"'))  # 기사 내용
            list.append('https://m.stock.naver.com/domestic/stock/005930/news/view/' +
                        str(a) + '/' + str(b))  # 기사 url
            tot_list.append(list)

    news_df = pd.DataFrame(data=tot_list, columns=[
                           'offname', 'rdate', 'title', 'imgsrc', 'content', 'url'])
    news_df['title'] = news_df['title'].str.replace('&amp;', '&')
    news_df['content'] = news_df['content'].str.replace('&amp;', '&')

    # news_df['title'] = [re.sub('[^A-Za-z0-9가-힣]', '' ,s) for s in news_df['title']]

    # news_df.to_csv('css.csv',index=False)
    # print(news_df)
    json_str = news_df.to_json(orient="records", force_ascii=False)
    print(json_str)
    return json_str


@app.route('/api/cnn/<co>')
def cnn(co):
    data = fdr.DataReader(str(co), last_year)
    data = cnn_lstm.erase_zero(data)
    train_X, train_Y, test_X, test_Y = cnn_lstm.create_window_set(
        data, column=3, window_size=50)
    model = cnn_lstm.build_model(window_size=50)
    history = model.fit(train_X, train_Y, validation_data=(test_X, test_Y), epochs=3, batch_size=64, verbose=1,
                        shuffle=False)
    df = cnn_lstm.predict(model, data[len(train_X):], 3, test_X, test_Y)
    df = np.array(df).ravel().tolist()
    print(df)
    return jsonify({'data': df})


#----2022-08-05------
"""
    # <지표 설명>
    # 1. 배당 분석                      -> 배당성향(배당 커버리지의 역수.)
    # 2. 유동성 분석(단기채무지급능력)    -> 당좌비율(당좌자산 / 유동부채)
    # 3. 재무건전성 분석(레버리지 비율)   -> 부채비율(총부채 / 자기자본)의 역수
    # 4. 수익성분석                      -> 매출수익성(당기순이익/매출액))
    # 5. 성장성분석                      -> 순이익성장률
"""
def idv_radar(co):
    nm = stc_code_to_nm(co)
    sil_df = fn_craw(co)[3]
    if (sil_df.iloc[0:8, 3].isna().sum()) > 0:  # 표 안 가르고 계산하는 건 신규 상장 기업은 정보가 아예 없기 때문
        pass
    elif (sil_df.iloc[0:8, 9].isna().sum()) > 0:  # 표 안 가르고 계산하는 건 신규 상장 기업은 정보가 아예 없기 때문
        pass
    else:
        # 0. 재무정보는 최신 분기 실공시 기준
        # 0. 단, 배당은 1년에 한 번 이루어지기 때문에 최신 년도 공시 기준임
        sil_df_y = sil_df['최근 연간 실적'].iloc[:, 2]  # 느리지만 .iloc으로 하는 이유는 공시 날짜가 다른 기업이 있기 때문
        sil_df_q = sil_df['최근 분기 실적'].iloc[:, 4]

        sil_df_y = sil_df_y.fillna(0)
        sil_df_q = sil_df_q.fillna(0)

        if sil_df_y.dtype == 'O':
            sil_df_y = sil_df_y.apply(lambda x: re.sub('^-$', '0', '{}'.format(x)))
            sil_df_y = sil_df_y.astype('float')

        if sil_df_q.dtype == 'O':
            sil_df_q = sil_df_q.apply(lambda x: re.sub('^-$', '0', '{}'.format(x)))
            sil_df_q = sil_df_q.astype('float')
        # 1. 배당성향(bd_tend)
        bd_tend = sil_df_y[15]  # 실제 배당 성향
        
        # 2. 유동성 분석 - 당좌비율(당좌자산/유동부채)
        #                       당좌자산 = (유동자산 - 재고자산)
        dj_rate = sil_df_q[7]  # 당좌비율

        # 3. 재무건전성 분석 - 부채비율(총부채/자기자본)의 역수
        bch_rate = sil_df_q[6] / 100  # 부채비율
        bch_rate = round((1 / bch_rate) * 100, 2)

        # 4. 수익성 분석 - 매출수익성(당기순이익/매출액) # TODO 매출액 0인 애들은?

        dg_bene = sil_df_q[2]
        mch = sil_df_q[0]

        suyk = round((dg_bene / mch) * 100, 2)

        # 5. 성장성 분석 - 순이익성장률(지속성장 가능률)
        # (1-배당성향)*자기자본순이익률(ROE)
        #    유보율

        roe = sil_df_y[5] / 100
        ubo = (100 - bd_tend) / 100
        grth = round(roe * ubo * 100, 2)
        data_arr=np.array([bd_tend, dj_rate, bch_rate, suyk, grth])

        return data_arr,nm

# 유사 업종 비교
#idv_radar, relate_radar



@app.route('/api/relate_data/<co>')
def relate_data(co):
    label_list=['배당성향','유동성','건전성','수익성','성장성']
    arr_list=[]
    relate_corp = relate_code_crawl(co)
    arr_list = [idv_radar(co=code)for code in relate_corp]
    nm_list = [x[1] for x in arr_list if x is not None]
    arr_list = [x[0] for x in arr_list if x is not None]
    arr_list = np.array(arr_list)
    arr_list[:, 0] = (arr_list[:, 0] / arr_list[:, 0].mean()) * 100
    arr_list[:, 1] = (arr_list[:, 1] / arr_list[:, 1].mean()) * 100
    arr_list[:, 2] = (arr_list[:, 2] / arr_list[:, 2].mean()) * 100
    arr_list[:, 3] = (arr_list[:, 3] / arr_list[:, 3].mean()) * 100
    arr_list[:, 4] = (arr_list[:, 4] / arr_list[:, 4].mean()) * 100
    dict_list = []
    for i, nm in enumerate(nm_list):
        dic = {}
        dic[nm] = arr_list[i, :].tolist()
        dict_list.append(dic)
    print(json.dumps(dict_list, ensure_ascii=False))
    return json.dumps(dict_list, ensure_ascii=False)

# 2022 08 09 
@app.route('/api/trend/<co>')
def trend(co):
    nm = stc_code_to_nm(co)
    body={
    "startDate": "2017-01-01",
    "endDate": "2017-04-30",
    "timeUnit": "month",
    "keywordGroups": [
        {
        "groupName": nm,
        "keywords": [
            nm,
        ]
        },
       
    ],
    "device": "pc",
    "ages": [
        "1",
        "2"
    ],
    "gender": "f"
    }
    body = json.dumps(body)
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    request.add_header("Content-Type","application/json")
    response = urllib.request.urlopen(request, data=body.encode("utf-8"))
    rescode = response.getcode()
    if(rescode==200):
        response_body = response.read()
        print(response_body.decode('utf-8'))
    else:
        print("Error Code:" + rescode)
    return response_body

if __name__ == '__main__':
    app.run(debug=False)
