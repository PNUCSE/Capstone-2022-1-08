import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { stockCode } from "./Info";
import ApexChart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
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
    <div>

      {/* 기업명 */}
      {/* {Object.keys(data)}  */}
      {/* '배당성향','유동성','건전성','수익성','성장성' */}
      {/* {data[Object.keys(data)]} */}
      <ReactApexChart
        type="radar"
        // series={[{
        //   name: 'Series 1',
        //   data: [80, 50, 30, 40, 100],
        // }, {
        //   name: 'Series 2',
        //   data: [20, 30, 40, 80, 20],
        // }, {
        //   name: 'Series 3',
        //   data: [44, 76, 78, 13, 43],
        // }]}
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
            height: 350,
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
    </div>
  );
}

export default Finance;
