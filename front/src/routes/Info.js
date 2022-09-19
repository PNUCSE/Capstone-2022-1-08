import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useParams,
  Outlet,
  Link,
  useMatch,
  Router,
} from "react-router-dom";
import styled from "styled-components";
import ApexChart from "react-apexcharts";
import Finance from "./Finance";
import Article from "./Article";
import { atom, useRecoilState } from "recoil";
import Trend from "./Trend";
import Ifrs from "./Ifrs";
import Opinion from "./Opinion";

const StyledButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid lightgray;
  color: gray;
  background: white;
`;

const Container = styled.div`
  padding: 0px 20px;
`;
const Chart = styled.div`
  background-color:white;
  height:420px;
  width:100%;
  display:flex;
  margin-bottom:10px;
`
const Test = styled.div`
  margin-left: 10px;
  margin-right:10px;
  display:flex;
  width:30%;
  align-items: center;
  flex-direction: column;
  >span{
    font-size: 30px;
    height:12%;
    margin:10px;
    font-weight: 400;
    border-bottom:2px solid #E6E9ED;
  }
`
const TestRow = styled.div`
    display:flex;
    width:100%;
    margin:20px;
    align-items:center;
    justify-content:space-between;
    span:first-child {
      font-size: 20px;
      font-weight: 400;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    span:not(:first-child){
      font-size:20px;
    }
`
// 두번째줄부터
const Row = styled.div`
  display:flex;
  justify-content:space-between;
`
const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Title = styled.h1`
  font-size: 25px;
  font-weight:500;
`;

const Header = styled.header`
  height: 5vh;
  display: flex;
  align-items: center;
  background-color:white;
  margin-bottom:7px;
  padding-left:15px;
`;

const Overview = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;



export const stockCode= atom({
  key:'stockCode',
  default:''
})
function Info() {
  const { stockId } = useParams();
  const [code,setCode]=useRecoilState(stockCode);
  setCode(stockId);
  console.log(code);
  const { state } = useLocation();
  console.log(useLocation());
  const name = state.name;
  const [loading, setLoading] = useState(true);
  const [stockData, setstockData] = useState([{}]); //날짜별 가격
  const [updown, setUpdown] = useState([[]]);
  const [relate, setRelate] = useState([]);
  const [predict,setPredict]=useState([{}]); //예측가격

  useEffect(() => {
    // 종목 가격 불러오기 1.날짜 2.시가 3.고가 4.저가 5.종가
    fetch(`/api/info/${stockId}`)
      .then((res) => res.json())
      .then((data) => {
        setstockData(data.data);
      });
    // 연관기업코드
    (async () => {
      const updownResponse = await fetch(`/api/up_down/${stockId}`);
      const updownJson = await updownResponse.json();
      const predResponse = await fetch(`/api/cnn/${stockId}`);
      const predJson = await predResponse.json();
      setPredict(predJson.data)
      setUpdown(updownJson.data);
      setLoading(false);
    })();
  }, []);
  console.log(relate);
  console.log(stockData);
  console.log(predict);
  // const isUp = updown[0][0].substr(0, 3);
  // console.log(isUp);
  return (
    <Container>
      <Link to="/">
        <StyledButton>Home</StyledButton>
      </Link>
      <Header>
        <Title>{name}</Title>
      </Header>
      {loading ? (
        <Loader>loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>{name}</span>
              {/* 최신날짜 종가 */}
              <span>{stockData[stockData?.length - 1].종가}</span>
              <span>
                {updown[0][0].substr(0, 2) === "상향" ? (
                  <p style={{ color: "red" }}> +{updown[0][0].substr(3)}</p>
                ) : (
                  <p style={{ color: "blue" }}> -{updown[0][0].substr(3)}</p>
                )}
              </span>
              <span>
                {updown[0][0].substr(0, 2) === "상향" ? (
                  <p style={{ color: "red" }}> {updown[1][0].substr(3)}</p>
                ) : (
                  <p style={{ color: "blue" }}> {updown[1][0].substr(3)}</p>
                )}
              </span>
            </OverviewItem>
          </Overview>
          <Header>
              <Title>{name} 주가 차트</Title>
          </Header>
          <Chart>
            <ApexChart 
              height="70%"
              width="300%"
              type="area"
              series={[
                {
                  name: "sales",
                  data: stockData?.map((price) => price.종가),
                },
                {
                  name: "predict",
                  data: predict?.map((price)=>price)
                }
              ]}
              options={{
                theme: {
                  mode:"light"
                },
                tooltip: {
                  y: {
                    formatter: (value) => `$${value}`,
                  },
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
            
                 
                },
                grid: {
                  show: true,
                  //y축 선 
                  yaxis: {
                    lines: {
                        show: false
                    }
                },   
                },
                 dataLabels: {
                    enabled: false
                },
                stroke: {
                  curve: "smooth",
                  width: 2,
                },
                xaxis: {
                  type: "datetime",
                  categories: stockData?.map((price) => price.날짜),
                  labels: {
                    style: {
                      
                    },
                    
                  },
                },
                yaxis:{
                  floating:false,
                  decimalsInFloat: undefined,
                  labels:{
                    formatter:(value) => `$${value.toFixed(0)}`,
                  }
                }
              }}
            />
            <Test>
              <span>다음 장날 주가 예측</span>
              <TestRow>
                <span>{name} 고가</span>
                <span>\가격</span>
              </TestRow>
              <TestRow>
                <span>{name} 저가</span>
                <span>\가격</span>
              </TestRow>
              <TestRow>
                <span>{name} 종가</span>
                <span>\가격</span>
              </TestRow>
            </Test>
          </Chart>
          <Row>
            <Finance/>
            <Trend/>
            <Opinion/>
          </Row>
          <Row>
            <Ifrs/>
            <Article/>
          </Row>
          <Outlet />
        </>
      )}
      

    </Container>
  );
}
export default Info;
