import React, { useState } from "react";
import axios from 'axios';
import RevenueChart from './RevenueChart'; // Import RevenueChart component

function Revenue() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [revenueData, setRevenueData] = useState(null); // State to store revenue data
  const [showChart, setShowChart] = useState(false); // State to control visibility of RevenueChart

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/process_revenue', data);
      setRevenueData(response.data); // Set revenue data received from the backend
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleShowChart = () => {
    setShowChart(true); // Show RevenueChart component
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center pt-10">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <h1 className="text-4xl font-bold mb-6 text-center">Revenue Chart</h1>
        
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-start">
            <div className="w-full mb-4">
              <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">Choose CSV File:</label>
              <input type="file" id="file" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSubmit}>Submit</button>
          </div>

          {/* Show Chart button */}
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleShowChart}>Show Chart</button>
        </div>
      </div>
      {showChart && <RevenueChart data={revenueData} />} 
    </div>
  );
}

export default Revenue;
