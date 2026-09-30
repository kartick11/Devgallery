// src/pages/ProjectDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useProjectDetailsLogic } from "../hooks/useProjectDetailsLogic";

const ProjectDetails = () => {
  const { id } = useParams();
  const { project, loading, error, handleVote } = useProjectDetailsLogic(id);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex justify-center items-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-8">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-xl font-semibold">
                Loading Project...
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex justify-center items-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-10 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">
              Project Not Found
            </h1>
            <p className="text-slate-400">
              {error || "The requested project does not exist."}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Project Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            {/* Project Image */}
            <div className="overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.projectName}
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Project Content */}
            <div className="p-8 text-slate-200">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-linear-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                {project.projectName}
              </h1>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                  <p className="text-cyan-400 font-semibold mb-1">Team Name</p>
                  <p>{project.teamName}</p>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                  <p className="text-cyan-400 font-semibold mb-1">Team Leader</p>
                  <p>{project.teamLeaderName}</p>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                  <p className="text-cyan-400 font-semibold mb-1">Event Name</p>
                  <p>{project.eventName}</p>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                  <p className="text-cyan-400 font-semibold mb-1">Organized By</p>
                  <p>{project.eventOrganisedBy}</p>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 md:col-span-2">
                  <p className="text-cyan-400 font-semibold mb-1">Contact Number</p>
                  <p>{project.phoneNumber}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 md:col-span-2">
                  <p className="text-cyan-400 font-semibold mb-1">Contact Number</p>
                  <p>{project.description}</p>
                </div>
              </div>

              {/* Upload Date */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-slate-400">
                  Uploaded On {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Vote Button */}
              <div className="mt-8">
                <button
                  onClick={() => handleVote(project._id)}
                  className="w-full md:w-auto px-8 py-3 bg-linear-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Vote For This Project 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProjectDetails;