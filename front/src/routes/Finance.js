import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { stockCode } from "./Info";
import ApexChart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import MLtest from "./MLtest";
import styled from "styled-components";
import Article from "./Article";
const Container = styled.div`
margin:10px;  
background-color:white;
  height:420px;
  width:30%;
  display:inline-block;
`
function Finance() {
  // 유사업종비교
  const code = useRecoilValue(stockCode);
  const [relate,setRelate]= useState([{}]);
  useEffect(()=>{
    (async()=>{
      const response=await fetch(`/api/relate_data/${code}`);
      const json=await response.json();
      console.log(json)
      setRelate(json);
    })();
  },[])
  return (
    <Container>
      {/* 기업명 */}
      {/* {Object.keys(data)}  */}
      {/* '배당성향','유동성','건전성','수익성','성장성' */}
      {/* {data[Object.keys(data)]} */}
      <ReactApexChart 
        height="100%"
        width="100%"     
        type="radar"  
        series={relate?.map(elem=>(
          {
            name:Object.keys(elem),
            data:elem[Object.keys(elem)]
          }

        ))}
        options={{
          theme: {
            mode: "light",
          },
          chart: {        
            type: 'radar',
            dropShadow: {
              enabled: true,
              blur: 1,
              left: 1,
              top: 1
            }
          },
          stroke: {
            width: 2
          },
          fill: {
            opacity: 0.1
          },
          grid: {
            show: false,
          },
          
          xaxis: {
            categories: ['배당성향','유동성','건전성','수익성','성장성']
          }
        }}
        
      />
    </Container>
  );
}

export default Finance;
