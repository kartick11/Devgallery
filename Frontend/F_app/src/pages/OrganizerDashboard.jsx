// src/pages/OrganizerDashboard.jsx
import React from "react";
import { Clock, CheckCircle } from "lucide-react";
// I removed Home and LogOut from lucide-react imports as they are unused in the JSX
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useOrganizerDashboardLogic } from "../hooks/useOrganizerDashboardLogic";

const OrganizerDashboard = () => {
  const { 
    pendingProjects, 
    approvedProjects, 
    isLoading, 
    error 
  } = useOrganizerDashboardLogic();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-r from-blue-200 via-blue-400 to-blue-600">
        
        {/* State Handling for Loading/Error */}
        {isLoading && <div className="p-6 text-center text-white font-semibold">Loading dashboard...</div>}
        {error && <div className="p-6 text-center text-red-200 font-semibold">{error}</div>}

        {/* Main Content */}
        {!isLoading && !error && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pending Approvals */}
            <div className="bg-amber-100 rounded-xl shadow-md p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-yellow-500" />
                <h2 className="text-xl font-semibold">Pending Approvals</h2>
              </div>

              <div className="space-y-4">
                {pendingProjects.length === 0 ? (
                  <p className="text-gray-500">No pending projects.</p>
                ) : (
                  pendingProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition"
                    >
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-gray-600">{project.organization}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Approved Projects */}
            <div className="bg-amber-100 rounded-xl shadow-md p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-green-500" />
                <h2 className="text-xl font-semibold">Approved Projects</h2>
              </div>

              <div className="space-y-4">
                {approvedProjects.length === 0 ? (
                  <p className="text-gray-500">No approved projects yet.</p>
                ) : (
                  approvedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition"
                    >
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-gray-600">{project.organization}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrganizerDashboard;