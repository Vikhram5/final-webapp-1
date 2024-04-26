import React, { useState, useEffect } from "react";
import axios from 'axios';
import PassCount1 from "./components/Passenger/PassCount1";
import PassengerCount from "./components/Passenger/PassengerCount";

function App() {
  const [displayOption, setDisplayOption] = useState('');


  const displayForm = (option) => {
    setDisplayOption(option);
  };
  const renderForm = () => {
    switch (displayOption) {
      case 'passcount1':
        return <PassCount1 />;
      case 'passcount2':
        return <PassengerCount />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto ">
      <h1 className="text-4xl font-bold mb-6">Passenger Count</h1>
      <div className="flex pt-10">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <div className="bg-white shadow-md rounded px-8 pt-8 pb-8 mb-10 flex flex-col items-start"> {/* Add margin-bottom */}
            <div className="flex justify-between mb-6">
              <button onClick={() => displayForm('passcount1')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">Passcount 1</button>
              <button onClick={() => displayForm('passcount2')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Passcount 2</button>
            </div>
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
