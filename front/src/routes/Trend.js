import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { stockCode } from "./Info";
import ApexChart from "react-apexcharts";
function Trend(){
    const code = useRecoilValue(stockCode);
    const [trend,setTrend] = useState({});
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
        <div>
            <ApexChart
              type="line"
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
                },
                stroke: {
                  curve: "smooth",
                  width: 3,
                },
                xaxis: {
                  type: "datetime",
                  categories: trend?.map((data) => data.period),
                  labels: {
                    style: {
                      colors: "#9c88ff",
                    },
                  },
                },
              }}
            />
        </div>
    )
}
export default Trend;