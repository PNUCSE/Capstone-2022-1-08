import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
const Container = styled.div`
  padding: 0px 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
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
const Description = styled.p`
  margin: 20px 0px;
`;
function Info() {
  const { stockId } = useParams();
  const { state } = useLocation();
  const name = state.name;
  console.log(name);
  const [loading, setLoading] = useState(true);
  const [stockData, setstockData] = useState([{}]); //날짜별 가격
  const [updown, setUpdown] = useState([[]]);
  const [relate, setRelate] = useState([]);
  useEffect(() => {
    // 종목 가격 불러오기 1.날짜 2.시가 3.고가 4.저가 5.종가
    fetch(`/info/${stockId}`)
      .then((res) => res.json())
      .then((data) => {
        setstockData(data.data);
        console.log(data.data[0].날짜);
      });
    // 연관기업코드
    (async () => {
      const response = await fetch("/relate");
      const json = await response.json();
      setRelate(json.codes.slice(1));
      const updownResponse = await fetch(`/up_down/${stockId}`);
      const updownJson = await updownResponse.json();
      setUpdown(updownJson.data);
      setLoading(false);
    })();
  }, []);
  console.log(relate);
  console.log(stockData);
  // const isUp = updown[0][0].substr(0, 3);
  // console.log(isUp);
  return (
    <Container>
      <Header>
        <Title>{name}</Title>
      </Header>
      {loading ? (
        <Loader>loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>종목코드:</span>
              <span>{stockId}</span>
            </OverviewItem>
            <OverviewItem>
              <span>현재가:</span>
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

          {stockData?.map((item) => (
            <h1>
              {item.날짜} {item.시가} {item.고가} {item.저가} {item.종가}{" "}
              {item.거래량}
            </h1>
          ))}
        </>
      )}
    </Container>
  );
}
export default Info;
