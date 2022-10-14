# Stocking


## 1. 프로젝트 소개

주식 수요 예측 알고리즘 경량화 및 서비스

## 2. 팀 소개
* 서준호(tjwnsgh1110@gmail.com)
  * 데이터 수집 및 처리, 알고리즘 구현, 경량화

* 윤정현(wjdgus980812@naver.com)
  * front-end, back-end 개발, 웹 크롤링, 데이터 수집

* 김민태(peterzzo@naver.com)
  * 웹 사이트 디자인 및 back-front 간 통신 구현

## 3. 시스템 구성도

![Transfomer](https://user-images.githubusercontent.com/38302858/195834135-65240feb-5fb5-4ddb-a4a1-26bbd5d1a8bb.png)
Teacher 모델인 Transfomer의 구성도

![Distillation](https://user-images.githubusercontent.com/38302858/195833588-9379fc6b-6d4b-4236-9831-e826e6039041.png)
Knowledge Distillation 구성도

![사진1](https://user-images.githubusercontent.com/38302470/195731659-554f07c2-d8fd-46bb-a45b-fe3dc92e721b.png)
Main Page -Search bar

![사진2](https://user-images.githubusercontent.com/38302470/195731701-55b87b84-23c3-4b9c-a12d-ce30bf58737b.png)
주요 주가 지수를 실시간으로 확인 가능

실시간 주가차트와 딥러닝모델을 통해 다음날 주가변동예측 기능 구현
![사진3](https://user-images.githubusercontent.com/38302470/195731715-c49ff883-9f8b-418f-b2f2-e91c6269ce8c.png)
재무제표를 통해 기업의 재무 지표 시각화 (배당성향, 유동성, 수익성, 성장성, 건전성)

검색트렌드 차트를 통해 기업의 성장 추이 확인 가능

네이버 금융의 전문가 투자의견 시각화
![사진4](https://user-images.githubusercontent.com/38302470/**195731725**-df1ba5cf-5c94-46b0-8e6d-70cc85157fe4.png)
기업의 연결 재무제표 확인 가능

관련 기사를 크롤링하여 기업의 이슈 확인 가능

기관, 외인 매수/매도 주식 수, PER, PBR등 투자 지표를 활용해 기업의 상황을 일기예보 형식으로 표현

## 4. 소개 및 시연 연상

## 5. 설치 및 사용법

본 프로젝트는 다음과 같은 패키지가 설치되어 있어야 합니다.
* tensorflow
* finance-datareader
* pandas
* flask
* npm
* beautifulsoup4
* pykrx

패키지 설치 후,
```
python ./back/main.py
cd ./front/ && npm start
```
를 통해 서버를 실행시킬 수 있습니다.