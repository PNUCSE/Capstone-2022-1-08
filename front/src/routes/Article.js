import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  border-radius: 15px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  padding: 15px;
`;

const Header = styled.header`
  margin-bottom: 10px;
  padding-bottom: 10px;
  font-size: 30px;
  border-bottom: 2px solid;
`;

const Title = styled.a`
  color: #c8c8ff;
  font-size: 25px;
  div {
    margin-bottom: 1px;
    margin-top: 5px;
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
  const location = useLocation();
  const code = location.pathname.substring(1, 7);
  const [article, setArticle] = useState([{}]);
  useEffect(() => {
    (async () => {
      const response = await fetch(`/article/${code}`);
      const json = await response.json();
      console.log(json[0]);
      setArticle(json);
    })();
  }, []);

  return (
    <Container>
      <Header>관련기사</Header>

      {article?.map((item) => (
        <>
          <Title href={item.url}>
            <div>{item.title}</div>
          </Title>
          <Off>{item.offname}</Off>
          <Date>{item.rdate}</Date>
          <p>{item.content}</p>
        </>
      ))}
    </Container>
  );
}
export default Article;
