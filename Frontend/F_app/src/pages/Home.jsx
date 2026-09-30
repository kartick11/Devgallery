import React from "react";
import { Link,useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useHomeLogic } from "../hooks/useHomeLogic";

const Home = () => {
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  // Inject Layer 2
  const { projects, loading } = useHomeLogic(searchTerm);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow w-full">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold bg-linear-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            {searchTerm
              ? `Search Results for "${searchTerm}"`
              : "Project Showcase"}
          </h2>
          <div className="w-32 h-1 bg-cyan-400 mx-auto rounded-full mt-4"></div>
          <p className="text-slate-400 mt-4 text-lg">
            Explore innovative student projects from colleges around the world.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-xl font-semibold">
                  Loading Projects...
                </span>
              </div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex justify-center items-center py-20">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-10 text-center max-w-xl">
              <h3 className="text-3xl font-bold text-white mb-3">
                No Projects Found
              </h3>
              <p className="text-slate-400">
                Try searching with different keywords or browse all available
                projects.
              </p>
            </div>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:scale-105 hover:border-cyan-400 transition-all duration-300 cursor-pointer"
              >
                {/* Project Image */}
                <div className="overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.projectName}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Project Content */}
                <div className="p-6 text-slate-200">
                  <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    {project.projectName}
                  </h3>

                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold text-cyan-300">Team:</span>{" "}
                      {project.teamName}
                    </p>
                    <p>
                      <span className="font-semibold text-cyan-300">
                        Leader:
                      </span>{" "}
                      {project.teamLeaderName}
                    </p>
                    <p>
                      <span className="font-semibold text-cyan-300">
                        Event:
                      </span>{" "}
                      {project.eventName}
                    </p>
                    <p>
                      <span className="font-semibold text-cyan-300">
                        Organized By:
                      </span>{" "}
                      {project.eventOrganisedBy}
                    </p>
                    <p>
                      <span className="font-semibold text-cyan-300">
                        Description:{" "}
                      </span>

                      {/* Check if description is longer than 100 characters */}
                      {project.description?.length > 100
                        ? `${project.description.substring(0, 100)}... `
                        : project.description}

                      {/* Conditionally render the Read More link */}
                      {project.description?.length > 100 && (
                        <Link
                          to={`/project/${project._id}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline text-sm ml-1"
                        >
                          Read more...
                        </Link>
                      )}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="text-sm text-slate-400">
                      Uploaded On{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button className="mt-5 w-full bg-linear-to-r from-cyan-500 to-violet-600 text-white py-2 rounded-xl font-semibold hover:opacity-90 transition">
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
