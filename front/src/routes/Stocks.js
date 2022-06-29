import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { com_df } from "../com_df";
const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StockList = styled.ul``;
const Stock = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 15px;
  a {
    transition: color 0.2s ease-in;
    display: block;
  }
  :hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

function Stocks() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    // 주식 30종목만 들고오기
    setStocks(com_df.slice(0, 30));
  }, []);
  return (
    <Container>
      <Header>
        <Title>Stocks</Title>
      </Header>
      <StockList>
        {stocks?.map((item) => (
          <Stock key={item.단축코드}>
            <Link to={`/info/${item.cd.substr(1)}`} state={{ name: item.nm }}>
              {item.cd.substr(1)} {item.nm} &rarr;
            </Link>
          </Stock>
        ))}
      </StockList>
    </Container>
  );
}

export default Stocks;
