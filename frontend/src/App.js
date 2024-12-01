import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './pages/Navbar';
import EmployeeList from './pages/EmployeeList';
import EmployeeGraph from './pages/EmployeeGraph';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/list" element={<EmployeeList />} />
          {/* <Route path="/list/search/:id" element={<EmployeeList />} /> */}
          <Route path="/graph" element={<EmployeeGraph />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;