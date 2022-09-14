import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { stockCode } from "./Info";
import styled from "styled-components";
import ReactApexChart from "react-apexcharts";
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
const Contents = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:auto;
  height:300px;
`
const Box = styled.div`
  width:14px;
  height:14px;
  background-color: ${props=>props.color};
  display:inline-block;
  margin-left:20px;
  margin-bottom:12px;
  margin-right:5px;
  border-radius:4px;
`
const ItemList = styled.li`
  display:flex;

`

function Opinion(){
    const code = useRecoilValue(stockCode);
    const [opinion,setOpinion] = useState(10);
    useEffect(() => {
        (async () => {
          const response = await fetch(`/api/invest_opinion/${code}`);
          const json = await response.json();
          setOpinion(()=>json);
        })();
      }, []);
    var twocolor='#305ea2'
    if (opinion==0){
      twocolor='#F0F3F3'
     }else if (opinion<=20) {
      twocolor='#305ea2'
     }else if (opinion>20 && opinion<=40){
      twocolor='#5793eb'
    }else if (opinion>40 && opinion<=60){
      twocolor='#66b828'
    }else if (opinion>60 && opinion<=80){
      twocolor='#fe8917'
    }else{
     twocolor='red'
    }

      return(
        <Container>
            <Header>투자의견</Header>
            <Contents>
              <ul>
                <ItemList>
                  <Box color="red"/>
                  <a style={{fontSize:"12px"}}>강력매수</a>
                </ItemList>                
                <ItemList>
                  <Box color='#fe8917'/>
                  <a style={{fontSize:"12px"}}>매수</a>
                </ItemList>
                <ItemList>
                  <Box color='#66b828'/>
                  <a style={{fontSize:"12px"}}>중립</a>
                </ItemList>
                <ItemList>
                  <Box color='#5793eb'/>
                  <a style={{fontSize:"12px"}}>매도</a>
                </ItemList>
                <ItemList>
                  <Box color='#305ea2'/>
                  <a style={{fontSize:"12px"}}>강력매도</a>
                </ItemList>
                <ItemList>
                  <Box color='#F0F3F3'/>
                  <a style={{fontSize:"12px"}}>의견없음</a>
                </ItemList>
              </ul>
              <ReactApexChart
                  series={[opinion.data]}
                  type="radialBar"
                  width="200px"
                  options={{
                      chart: {
                          type: 'radialBar',
                          offsetY: -20,
                          sparkline: {
                            enabled: true
                          },
                          
                      },
                        
                      plotOptions: {
                          radialBar: {
                            startAngle: -90,
                            endAngle: 90,
                            track: {
                              background: "#FFFFFF",
                              strokeWidth: '97%',
                              margin: 5, // margin is in pixels
                              dropShadow: {
                                enabled: true,
                                top: 2,
                                left: 0,
                                color: '#999',
                                opacity: 1,
                                blur: 2
                              }
                            },
                            dataLabels: {
                              name: {
                                show: false
                              },
                              value: {
                                offsetY: -2,
                                fontSize: '22px'
                              }
                            }
                          }
                      },
                      grid: {
                          padding: {
                            top: -10
                          }
                      },
                      fill: {
                          type:'gradient',
                          colors:twocolor,
                          gradient:{
                            shade:'dark',
                            shadeIntensity:0.4,
                            inverseColors:false,
                            opacityFrom:1,
                            opacityTo:0.7,
                            stops:[0,100],
                            gradientToColors:[twocolor],

                          }
                      },
                      labels: ['Average Results'],
                    }}
              
              />
            </Contents>
        </Container>
      )
}
export default Opinion;