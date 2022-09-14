import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { stockCode } from "./Info";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { Header } from "./Article";
const Container = styled.div`
  margin:10px 0px;  
  padding:15px; 
  background-color:white;
  box-sizing: border-box;
  height:420px;
  width:33%;
  display:inline-block;
  border: 1px solid #E6E9ED;
`

function Trend(){
    const code = useRecoilValue(stockCode);
    const [trend,setTrend] = useState();
    useEffect(()=>{
        (async()=>{
            const response=await fetch(`/api/trend/${code}`);
            const json=await response.json();
            console.log(json)
            setTrend(json.results[0].data);
          })();
    },[])
    console.log(trend);
    return(
        <Container>
            <Header>검색어 트렌드</Header>
            <ApexChart
              height="80%"
              width="100%"  
              type="area"
              series={[
                {
                  name: "trend",
                  data: trend?.map((data) => data.ratio),
                },
              ]}
              options={{
                theme: {
                  mode:"light"
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
                  height: 500,
                },
                grid: {
                  show: true,
                  yaxis:{
                    lines: {
                      show: false
                    }
                  }
                },
                fill:{
                  colors:['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
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
                  categories: trend?.map((data) => data.period),
                  labels: {
                    style: {
                      
                    },
                  },
                },
              }}
            />
        </Container>
    )
}
export default Trend;