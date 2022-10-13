import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import {Container,Header} from "./Article"
import axios from 'axios';
import styled from "styled-components";
import { stockCode } from "./Info";
import {FaCloud,FaSun,FaCloudRain} from 'react-icons/fa'
const Box = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    margin-bottom:30px;

`
const BoxHead = styled.div`
    border-top:2px solid rgba(115, 135, 156, 0.36);
    border-bottom:2px solid rgba(115, 135, 156, 0.36);
    text-align:center;
    padding:5px 0px;
    margin:2px;
`
const Row = styled.div`
    display:flex;
    justify-content:space-between;
`
function Invest(){
    const code = useRecoilValue(stockCode);
    const fetchInvest = () => {
        return axios.get(`/api/weather/${code}`);
    }
    const {data,isLoading} = useQuery('invest',fetchInvest);
    console.log(data);
    return(
        <Container>            
            <Header>기업투자 현황</Header>
            {isLoading?<div>loading..</div>:<>
            <Row>
                <Box>
                    <BoxHead>
                         외국인매매 주식
                    </BoxHead>   
                    {data.data.foreign}
                    {data.data.foreign>0?<FaSun size={50}/>:<FaCloudRain size={50}/>}                 
                </Box>    
                <Box>
                    <BoxHead>
                        기관매매 주식
                    </BoxHead>    
                    {data.data.giguan} 
                    {data.data.giguan>0?<FaSun size={50}/>:<FaCloudRain size={50}/>}      
                </Box>                                        
            </Row>
            <Row>
                <Box>
                    <BoxHead>
                        <div>PER</div>
                    </BoxHead>
                    {data.data.weather[0]}
                    <FaCloud size={50} />
                </Box>
                <Box>
                    <BoxHead>
                        PBR                       
                    </BoxHead>
                    {data.data.weather[1]}
                    <FaCloud size={50} />
                </Box>
                <Box>
                    <BoxHead>
                        ROE                        
                    </BoxHead>
                    {data.data.weather[2]}
                    <FaSun size={50}/>
                </Box>
                <Box>
                    <BoxHead>
                        EPS                       
                    </BoxHead>
                    {data.data.weather[3]}
                    <FaSun size={50}/>
                </Box>
                <Box>
                    <BoxHead>
                        BPS                        
                    </BoxHead>
                    {data.data.weather[4]}
                    <FaCloud size={50} />
                </Box>
                
            </Row>
            </>}
            
            
        </Container>
    )
}

export default Invest;