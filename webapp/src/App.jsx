import React from 'react';
import ReactDOM from 'react-dom';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import meterReadingsData from './data/meterReadingsSample.json';
import axios from 'axios';


function GetMR() {
  const mr = axios
    .get("http://localhost:3000/mr/monthlyusage")
    .then(
      function (response) {
        const meterReadingsRows = response.data.omr.map(reading => (
          <tr key={reading.reading_date}>
            <td>{reading.reading_date}</td>
            <td>{reading.cumulative}</td>
            <td>{reading.unit}</td>
          </tr>
        ));
        
        const energyUsageData = [];
        for(let i = 0; i < response.data.mr.length - 2; i++) {
          // const energyUsage = response.data.mr[i+1].cumulative - response.data.mr[i].cumulative;
          const energyUsage = response.data.mr[i].energy_usage;
          energyUsageData.push({
            date: response.data.mr[i+1].reading_date,
            energyUsage,
          });
        }

        const element = (
          <div>
            <h2>Energy Usage</h2>
            <BarChart width={1400} height={400} data={energyUsageData}>
              <XAxis dataKey="date" />
              <YAxis dataKey="energyUsage" />
              <CartesianGrid horizontal={false} />
              <Tooltip />
              <Bar dataKey="energyUsage" fill="#03ad54" isAnimationActive={true} />
            </BarChart>
            <h2>Meter Readings</h2>
            <table>
              <tbody>
                <tr>
                  <th>Date</th>
                  <th>Reading</th>
                  <th>Unit</th>
                </tr>
                {meterReadingsRows}
              </tbody>
            </table>
          </div>
        );
        ReactDOM.render(
          element,
          document.getElementById('defobj')
        );
    })
  .catch(error => (console.log(error)));
  return null;
}

export default () => {
  const meterReadings = meterReadingsData.electricity;

  const energyUsageData = [];
  for(let i = 0; i < meterReadings.length - 2; i++) {
    const energyUsage =
      meterReadings[i+1].cumulative - meterReadings[i].cumulative;
    energyUsageData.push({
      date: meterReadings[i+1].readingDate,
      energyUsage,
    });
  }
  
  return (
    <div>
      <GetMR />
      <div id="defobj" />
    </div>
  );
};
