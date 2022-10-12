import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { com_df } from "../com_df";
import {FaSearch} from 'react-icons/fa'
const StyledButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid lightgray;
  color: gray;
  background: white;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 50px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 1000px;
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  height:100%;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom:30px;
`;
const SearchContainer = styled.div`
  width: 580px;
  height: 45px;
  position: relative;
  justify-content: center;
  align-items: center;
  border: 0;

  svg {
    position: absolute;
    right: 10px;
    top: 15px;
    font-size:14px;
  }
`;

const Search = styled.input`
  border:none;
  width:100%;
  outline: none;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  z-index: 100;
  background: #fff;
  padding: 0px 20px;
  height: 44px;
  &:hover{
    box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
    border-color: rgba(223,225,229,0);
  }
  &:focus{
    box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
    border-color: rgba(223,225,229,0);
  }
`;

const Selector = styled.div`
  background-color: var(--search-box-results-bg,#fff);
  border-radius:11px;
  z-index:99;
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
  width:580px;
  font-size:16px;
  margin-bottom: 8px;
  overflow: hidden;
  padding-bottom: 8px;
  border-top:none;
  

`;

const List = styled.ul`
  margin:5px;
  svg{
    font-size:12px;
    margin-top:15px;
    margin-right:8px;
  }
`;
function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const onChange = (e) => {
        setSearch(e.target.value)
    }
    
  useEffect(() => {
    setStocks(com_df);
  }, []);
  const filterTitle = com_df.filter((p) => {
    return p.nm.replace(" ","").toLocaleLowerCase().includes(search.toLocaleLowerCase().replace(" ",""))
  })
  
  return (
    <Container>
      <Header>
          <Title>Stocking</Title>
      </Header>
      <SearchContainer>
        <Search type="text" value={search} onChange={onChange} />
        <FaSearch/>
      </SearchContainer>
      {search && 
        <Selector>
          {filterTitle.slice(0,10).map(item => 
            <List>
              <Link to={`/${item.cd.substr(1)}`} state={{ name: item.nm }}>
                <FaSearch/> {item.cd.substr(1)} {item.nm}
              </Link>
          </List>)}
      
        </Selector>}
    </Container>
  );
}

export default Stocks;
