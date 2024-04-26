import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const LoadingChart = ({ chartData }) => {
  const data = Object.entries(chartData).map(([stage, passengers]) => ({
    stage,
    passengers
  }));

  return (
    <div className="p-8">
      <h2>Loading Profile</h2>
      <div className="loading-chart">
        <LineChart
          width={900} // Increase the width to provide more space for x-axis labels
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="stage"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80} // Increase the height of the x-axis to accommodate rotated labels
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="step"
            dataKey="passengers"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ stroke: '#82ca9d', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
}

export default LoadingChart;
