import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const options ={
    leg
}

function LineGraph() {
  const [data, setdata] = useState({});
  const buildChartData = (data, casesType = "cases") => {
    const charData = [];
    let lastDataPoint;

   for(let date in data.cases){
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };

        charData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    };

    return charData;
  };

  useEffect(() => {
    fetch("https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=120")
      .then((reseponse) => reseponse.json())
      .then((data) => {
        const chartData = buildChartData(data);
        setdata(chartData);
      });
  }, []);

  return <div>
      <Line data={{
          datasets:[
              {
                  backgroundColor: "rgba(204,16,52,0.1)",
                  borderColor: "#CC1034",
                  data:data,
              },
          ],
      }}/>
      </div>;
}

export default LineGraph;
