import React from "react";
import Layout from "./components/Navbar/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PassengerCount from "./components/Passenger/PassengerCount";
import BusCount from "./components/BusAnalysis/BusCount";
import LoadingProfile from "./components/Loading Profile/LoadingProfile";
import DashBoard from "./DashBoard";
import ODMatrix from "./components/OD Analysis/ODMatrix";
import Revenue from "./Revenue"
import PassCount1 from "./components/Passenger/PassCount1";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PassCount1/>} />
          <Route path="/dashboard" element={<PassCount1/>} />
          <Route path="/buscount" element={<BusCount />} />
          <Route path="/passcount" element={<PassengerCount/>} />
          <Route path="/revenue" element={<Revenue/>} />
          <Route path="/loadingprofile" element={<LoadingProfile/>} />
          <Route path="/odmatrix" element={<ODMatrix/>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
