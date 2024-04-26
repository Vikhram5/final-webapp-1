import React, { useState } from "react";
import axios from "axios";
import ODMatrixTable from "./ODMatrixTable";

function ODMatrix() {
  const [file, setFile] = useState(null);
  const [journey, setJourney] = useState("");
  const [name, setName] = useState("");
  const [sourceStage, setSourceStage] = useState("");
  const [destinationStage, setDestinationStage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [storeFile, setStoreFile] = useState("");
  const [odMatrix, setOdMatrix] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("journey", journey);
    formData.append("name", name);
    formData.append("sourceStage", sourceStage);
    formData.append("destinationStage", destinationStage);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("storeFile", storeFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate_od_matrix",
        formData
      );
      setOdMatrix(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Origin-Destination Matrix</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Choose CSV File:
            </label>
            <input
              type="file"
              id="file"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="journey"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Journey:
                </label>
                <select
                  id="journey"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={journey}
                  onChange={(e) => setJourney(e.target.value)}
                >
                  <option value="">Select Journey</option>
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                </select>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="sourceStage"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Source Stage:
                </label>
                <input
                  type="text"
                  id="sourceStage"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={sourceStage}
                  onChange={(e) => setSourceStage(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="destinationStage"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Destination Stage:
                </label>
                <input
                  type="text"
                  id="destinationStage"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={destinationStage}
                  onChange={(e) => setDestinationStage(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="startTime"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Start Time:
                </label>
                <input
                  type="text"
                  id="startTime"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="endTime"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  End Time:
                </label>
                <input
                  type="text"
                  id="endTime"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="storeFile"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Store File Name:
                </label>
                <input
                  type="text"
                  id="storeFile"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={storeFile}
                  onChange={(e) => setStoreFile(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Generate OD Matrix
            </button>
          </div>
        </form>
      </div>
      {odMatrix && <ODMatrixTable odMatrix={odMatrix} />}
    </div>
  );
}

export default ODMatrix;