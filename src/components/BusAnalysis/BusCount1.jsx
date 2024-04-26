import React, { useState, useEffect } from "react";
import axios from 'axios';
import BusChart from './BusChart'; // Import BusChart component

function BusCount() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [busNumber, setBusNumber] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [tableData, setTableData] = useState(null); // State to store table data
  const [showChart, setShowChart] = useState(false); // State to control visibility of BusChart
  const [busOptions, setBusOptions] = useState([]); // State to store bus options
  const [sourceOptions, setSourceOptions] = useState([]); // State to store source options
  const [destinationOptions, setDestinationOptions] = useState([]); // State to store destination options

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

    try {
      const response = await axios.post('http://127.0.0.1:5000/process_bus', data);
      setTableData(response.data); // Set table data received from the backend
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleShowChart = () => {
    setShowChart(true); // Show BusChart component
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center pt-10">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <h1 className="text-4xl font-bold mb-6 text-center">Bus Count</h1>
        
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-start">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">Choose CSV File:</label>
                <input type="file" id="file" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleFileChange} />
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

              <div className="mb-4">
                <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">Destination:</label>
                <select id="destination" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="">Select Destination</option>
                  {destinationOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
            </form>
          </div>

          {/* Show entire table data */}
          {tableData && tableData.length > 0 && (
            <table className="table-auto bg-white shadow-md rounded mt-4">
              <thead>
                <tr>
                  {Object.keys(tableData[0]).map((colName, index) => (
                    <th key={index} className="px-4 py-2">{colName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, rowIndex) => ( 
                  <tr key={rowIndex}>
                    {Object.values(item).map((val, colIndex) => (
                      <td key={colIndex} className="border px-4 py-2">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Show Chart button */}
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleShowChart}>Show Chart</button>
        </div>
      </div>
      {showChart && <BusChart data={tableData} />} {/* Render BusChart if showChart is true */}
    </div>
  );
}

export default BusCount;
