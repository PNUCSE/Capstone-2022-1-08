from flask import Flask,request,jsonify
from flask import jsonify
import requests
from bs4 import BeautifulSoup
from datetime import datetime ,timedelta
from time import sleep
import time
import pandas as pd
from pykrx import stock
import numpy as np
app = Flask(__name__)
today=datetime.today().strftime("%Y%m%d")
last_year =(datetime.today()-timedelta(365)).strftime("%Y%m%d")
@app.route('/relate')
def relate_code_crawl(co='005930'):
    #연관 종목코드 있는 페이지 불러오기
    url='https://finance.naver.com/item/main.naver?code='+str(co)
    page=pd.read_html(url,encoding='CP949')
    #연관 종목명과 종목코드 뽑아내기(code_list[0]은 '종목명'이어서 제외)
    code_list=page[4].columns.tolist()
    code_list=code_list[1:]
    #종목코드 리스트 반환
    codes=[]
    for word in (code_list):
        codes.append(word[-6:])

    return {"codes":codes}
@app.route('/fn')
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

    print(table_list)

    return "hi"
# 전일 대비 등락률
@app.route('/up_down/<co>')
def up_down(co):
    url = f"https://finance.naver.com/item/main.naver?code={co}"
    table_list = pd.read_html(url, encoding='euc-kr')
    js = table_list[4].iloc[1:3, [1]].to_json(orient='split', force_ascii=False)
    return js
@app.route('/info/<co>')
def chart(co):
    print(co)
    df = stock.get_market_ohlcv_by_date(last_year, today, co)
    js = df.to_json(orient='table', force_ascii=False ,date_format='iso')
    print(df)
    print(js)
    print(datetime.today().strftime("%Y%m%d"))
    return js
if __name__ == '__main__':
   app.run(debug=True)