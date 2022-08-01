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
app = Flask(__name__)
today = datetime.today().strftime("%Y%m%d")
last_year = (datetime.today()-timedelta(365)).strftime("%Y%m%d")


@app.route('/api/relate')
def relate_code_crawl(co='005930'):
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

    return {"codes": codes}


@app.route('/api/fn')
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

    print(table_list[11])

    return "hi"
# 전일 대비 등락률


@app.route('/api/up_down/<co>')
def up_down(co):
    url = f"https://finance.naver.com/item/main.naver?code={co}"
    table_list = pd.read_html(url, encoding='euc-kr')
    js = table_list[4].iloc[1:3, [1]].to_json(
        orient='split', force_ascii=False)
    return js


@app.route('/info/<co>')
def chart(co):
    print(co)
    df = stock.get_market_ohlcv_by_date(last_year, today, co)
    js = df.to_json(orient='table', force_ascii=False, date_format='iso')
    print(df)
    print(js)
    print(datetime.today().strftime("%Y%m%d"))
    return js


@app.route('/article/<co>')
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

    data = fdr.DataReader(str(co), '2010-01-01')
    data = cnn_lstm.erase_zero(data)
    train_X, train_Y, test_X, test_Y = cnn_lstm.create_window_set(
        data, column=3, window_size=50)
    model = cnn_lstm.build_model(window_size=50)
    history = model.fit(train_X, train_Y, validation_data=(test_X, test_Y), epochs=1, batch_size=64, verbose=1,
                        shuffle=False)
    df = cnn_lstm.predict(model, data[len(train_X):], 3, test_X, test_Y)
    df = np.array(df).ravel().tolist()
    print(df)
    return jsonify({'data': df})


if __name__ == '__main__':
    app.run(debug=True)
