import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import HomeDashboard from '../components/HomeDashboard';
import ReportsDashboard from '../components/ReportsDashboard';
import DataA from '../components/DataA';

function Dashboard() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Navigate to the root page
  };

  return (
    <div className="grid grid-cols-[auto,1fr] h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="bg-black text-white w-64 space-y-6 py-7 px-2">
        <h1 className="text-3xl font-semibold pl-2 mb-4">Dashboard</h1>
        <nav>
          <NavLink to="home" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
            Overview
          </NavLink>
          <NavLink to="reports" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
            Analysis
          </NavLink>
          <NavLink to="dataA" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
            Data Analysis
          </NavLink>
          {/* Add other navigation links here */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="col-start-2">
        {/* Header */}
        <div className="bg-black text-white p-4 shadow-md sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button onClick={handleBackClick} className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded inline-flex items-center">
            Go Back
          </button>
        </div>

        {/* Page Content */}
        <div className="overflow-auto p-10">
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="home" element={<HomeDashboard />} />
            <Route path="reports" element={<ReportsDashboard />} />
            <Route path="dataA" element={<DataA />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

