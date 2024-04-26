import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const RevenueChart = ({ data }) => {
  // Generate random and unique colors for the pie chart
  const generateRandomColors = () => {
    const colors = [];
    while (colors.length < data.length) {
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      if (!colors.includes(randomColor)) {
        colors.push(randomColor);
      }
    }
    return colors;
  };

  const COLORS = generateRandomColors();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Revenue by Depot</h2>
      <PieChart width={800} height={400}>
        <Pie
          data={data}
          dataKey="Revenue"
          nameKey="Depot"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          labelLine={false}
          label={({ percent, name }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="right" verticalAlign="middle" layout="vertical" />
      </PieChart>
    </div>
  );
};

export default RevenueChart;
