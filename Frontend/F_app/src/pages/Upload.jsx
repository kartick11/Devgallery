import { useState } from "react";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useUploadLogic } from "../hooks/useUploadLogic";

const Upload = () => {
  // Inject Layer 2 Logic
  const { myProjects, loading, deletingId, uploadProject, deleteProject } =
    useUploadLogic();

  // Local state purely for form inputs
  const initialFormState = {
    projectName: "",
    teamName: "",
    teamLeaderName: "",
    eventName: "",
    eventOrganisedBy: "",
    phoneNumber: "",
    description: "",
    image: null,
  };
  const [project, setProject] = useState(initialFormState);

  const handleChange = (e) =>
    setProject({ ...project, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setProject({ ...project, image: e.target.files[0] });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass form state and a callback to clear the form on success
    uploadProject(project, () => setProject(initialFormState));
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Upload Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 mb-12">
            <h2 className="text-4xl font-bold mb-8 bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Upload Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                value={project.projectName}
                onChange={handleChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <input
                type="text"
                name="teamName"
                placeholder="Team Name"
                value={project.teamName}
                onChange={handleChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <input
                type="text"
                name="teamLeaderName"
                placeholder="Team Leader Name"
                value={project.teamLeaderName}
                onChange={handleChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={project.eventName}
                onChange={handleChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <input
                type="text"
                name="eventOrganisedBy"
                placeholder="Event Organised By"
                value={project.eventOrganisedBy}
                onChange={handleChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number for verification"
                value={project.phoneNumber}
                onChange={handleChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Write about the project..."
                value={project.description}
                onChange={handleChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-slate-800/70 border border-slate-700 text-slate-300 p-3 rounded-xl file:bg-cyan-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg"
                required
              />
              {/* The vote count will only render if the backend sent it */}

              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-linear-to-r from-cyan-500 to-violet-600 hover:scale-105 shadow-lg"}`}
              >
                {loading ? "Uploading..." : "Upload Project"}
              </button>
            </form>
          </div>

          {/* My Projects Grid */}
          <div>
            <h2 className="text-4xl font-bold mb-8 bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              My Uploaded Projects
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myProjects.length > 0 ? (
                myProjects.map((proj) => (
                  <div
                    key={proj._id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-300"
                  >
                    <img
                      src={proj.imageUrl}
                      alt={proj.projectName}
                      className="h-56 w-full object-cover"
                    />

                    <div className="p-5 text-slate-200">
                      <h3 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                        {proj.projectName}
                      </h3>
                      <p className="mt-3">
                        <strong>Team:</strong> {proj.teamName}
                      </p>
                      <p>
                        <strong>Leader:</strong> {proj.teamLeaderName}
                      </p>
                      <p>
                        <strong>Event:</strong> {proj.eventName}
                      </p>
                      <p>
                        <strong>Organised By:</strong> {proj.eventOrganisedBy}
                      </p>
                      {proj.votes !== undefined && (
                        <p>
                          <span className="font-semibold text-cyan-300">
                            Total Votes:
                          </span>{" "}
                          {proj.votes}
                        </p>
                      )}
                      <p className="text-sm text-slate-400 mt-3">
                        Uploaded on{" "}
                        {new Date(proj.createdAt).toLocaleDateString()}
                      </p>

                      <button
                        onClick={() => deleteProject(proj._id)}
                        disabled={deletingId === proj._id}
                        className={`mt-4 px-4 py-2 rounded-xl text-white flex items-center gap-2 transition-all duration-300 ${deletingId === proj._id ? "bg-gray-500 cursor-not-allowed" : "bg-linear-to-r from-red-500 to-pink-600 hover:scale-105"}`}
                      >
                        {deletingId === proj._id && (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {deletingId === proj._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl text-slate-300 text-xl">
                  No projects uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Upload;
