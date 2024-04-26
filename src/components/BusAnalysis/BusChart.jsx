import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BusChart = ({ data }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bus Chart</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Hour" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Bus Count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BusChart;
