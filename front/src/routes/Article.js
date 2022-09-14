import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { stockCode } from "./Info";
export const Container = styled.div`
  margin: 10px 0px;
  background-color:white;
  box-sizing: border-box;
  padding: 15px;
  width:33%;
  border: 1px solid #E6E9ED;
`;

export const Header = styled.header`
  margin-bottom: 10px;
  padding-bottom: 10px;
  font-size: 17px;
  font-weight:700;
  border-bottom: 2px solid #E6E9ED;
`;
const Block = styled.div`
  margin:0;
  border-left:3px solid #e8e8e8;
  padding:10px 15px;
`
const Title = styled.div`
  font-size: 16px;
  font-weight:400;
  p {
    margin-bottom: 1px;
    margin-top: 5px;
  }
  div{
    content: "";
    display: block;
    width: 14px;
    height: 14px;
    position:relative;
    left:-23px;
    top:22px;
    border: 3px solid #d2d3d2;
    border-radius: 14px;
    background: #f9f9f9;
  }
  

`;
const Off = styled.div`
  color: #aab6aa;
  font-size: 0.93em;
`;
const Date = styled.span`
  font-style: italic;
  line-height: 1.3;
  color: #aab6aa;
  font-size: 0.9375em;
`;
function Article() {
  const code = useRecoilValue(stockCode);
  const [article, setArticle] = useState([{}]);
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/article/${code}`);
      const json = await response.json();
      setArticle(json);
    })();
  }, []);

  return (
    <Container>
      <Header>관련기사</Header>

      {article?.map((item) => (
        <Block>
          <Title href={item.url}>
            <div></div>
            <p>{item.title}</p>
          </Title>
          <Off>{item.offname}</Off>
          <Date>{item.rdate}</Date>
          <p>{item.content}</p>
        </Block>
      ))}
    </Container>
  );
}
export default Article;
