import React from 'react';

const AnalyticsCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 w-64">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <p className="text-3xl font-semibold">{value}</p>
  </div>
);

const DashBoard = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <AnalyticsCard title="Total Users" value="10,000" />
      <AnalyticsCard title="Page Views" value="100,000" />
      <AnalyticsCard title="Conversion Rate" value="5%" />
    </div>
  );
};

export default DashBoard;
