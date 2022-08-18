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
    color:${(props) => props.theme.accentColor};
    border-bottom:2px solid #E6E9ED;  
`
const TestRow = styled.div`
    display:flex;
    width:100%;
    margin:20px;
    align-item:center;
    justify-content:space-between;
    span:first-child {
      font-size: 20px;
      color:${(props) => props.theme.accentColor};
      font-weight: 400;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    span:not(:first-child){
      color:#73879C;
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
  color: ${(props) => props.theme.accentColor};
<<<<<<< HEAD
  font-size: 25px;
  font-weight:500;
=======
  font-size: 50px;
>>>>>>> e900a398cf0aaddcd77ab5e38033945bc775bedc
`;

const Header = styled.header`
  height: 5vh;
  display: flex;
  justify-content: ;
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
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: white;
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
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
              <span>{stockData[stockData.length - 1].종가}</span>
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
              type="line"
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
                    formatter: (value) => `$${value.toFixed(2)}`,
                  },
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
            
                 
                },
                grid: {
                  show: true,
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
                      colors: "#9c88ff",
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
          {/* <Tabs>
            <Tab isActive={financeMatch !== null}>
              <Link to="finance" state={{ name }}>
                finance
              </Link>
            </Tab>
            <Tab isActive={articleMatch !== null}>
              <Link to="article" state={{ name }}>
                Article
              </Link>
            </Tab>
          </Tabs> */}
          <Row>
            <Finance/>
            <Ifrs/>
            <Article/>
          </Row>
          
          <Outlet />
        </>
      )}
      
      {/* <Trend/> */}
    </Container>
  );
}
export default Info;
