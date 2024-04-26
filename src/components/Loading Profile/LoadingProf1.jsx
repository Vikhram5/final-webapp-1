import React, { useState, useEffect } from "react";
import axios from 'axios';
import LoadingChart from './LoadingChart'; // Import the LoadingChart component

function LoadingProf1() {
    const [selectedFile, setSelectedFile] = useState(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [startTime, setStartTime] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [busOptions, setBusOptions] = useState([]); // State to store bus options
  const [endTime, setEndTime] = useState('');
  const [chartData, setChartData] = useState(null); // State to store chart data
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  useEffect(() => {
    // Fetch bus numbers when selectedFile changes
    if (selectedFile) {
      axios.post('http://127.0.0.1:5000/get_bus_numbers', { filename: selectedFile.name })
        .then(response => {
          setBusOptions(response.data.busNumbers);
        })
        .catch(error => {
          console.error('Error fetching bus numbers:', error);
        });
    }
  }, [selectedFile]);

  useEffect(() => {
    // Fetch source options when both selectedFile and busNumber change
    if (selectedFile && busNumber) {
      axios.post('http://127.0.0.1:5000/get_source', { filename: selectedFile.name, busNumber })
        .then(response => {
          setSourceOptions(response.data.sources);
        })
        .catch(error => {
          console.error('Error fetching sources:', error);
        });
    }
  }, [selectedFile, busNumber]);

  useEffect(() => {
    // Fetch destination options when selectedFile, busNumber, and source change
    if (selectedFile && busNumber && source) {
      axios.post('http://127.0.0.1:5000/get_destination', { filename: selectedFile.name, busNumber, source })
        .then(response => {
          setDestinationOptions(response.data.destinations);
        })
        .catch(error => {
          console.error('Error fetching destinations:', error);
        });
    }
  }, [selectedFile, busNumber, source]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('file', selectedFile);
    data.append('busNumber', busNumber);
    data.append('source', source);
    data.append('destination', destination);
    data.append('startTime', startTime);
    data.append('endTime', endTime);

    try {
      const response = await axios.post('http://127.0.0.1:5000/visualize_loading', data);
      setChartData(response.data); // Set chart data received from the backend
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center pt-10">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <h1 className="text-4xl font-bold mb-6 text-center">Loading Profile</h1>
        
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-start">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">Choose CSV File:</label>
                <input type="file" id="file" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </div>

              <div className="w-full mb-4">
                <label htmlFor="busNumber" className="block text-gray-700 text-sm font-bold mb-2">Bus Number:</label>
                <select id="busNumber" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={busNumber} onChange={(e) => setBusNumber(e.target.value)}>
                  <option value="">Select Bus Number</option>
                  {busOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="source" className="block text-gray-700 text-sm font-bold mb-2">Source:</label>
                <select id="source" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={source} onChange={(e) => setSource(e.target.value)}>
                  <option value="">Select Source</option>
                  {sourceOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">Destination:</label>
                <select id="destination" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="">Select Destination</option>
                  {destinationOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-2">Start Time:</label>
                <input type="text" id="startTime" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>

              <div className="mb-6">
                <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">End Time:</label>
                <input type="text" id="endTime" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>

              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
            </form>
          </div>

          {/* Render the chart component */}
      
        </div>
      </div>
      {chartData && (
            <LoadingChart chartData={chartData} />
          )}
    </div>
  );
}

export default LoadingProf1;
