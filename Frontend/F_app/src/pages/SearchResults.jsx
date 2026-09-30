// src/pages/SearchResults.jsx
import React from "react";
import { useSearchLogic } from "../hooks/useSearchLogic";

const SearchResults = () => {
  const { searchTerm, projects, isLoading, error } = useSearchLogic();

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Search Results for "{searchTerm}"
      </h2>

      {isLoading ? (
        <p className="text-gray-600 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No projects found matching that name.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.projectName}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-indigo-600 mb-2">
                  {project.projectName}
                </h3>
                <p className="text-gray-700">
                  <strong>Team:</strong> {project.teamName}
                </p>
                <p className="text-gray-700">
                  <strong>Leader:</strong> {project.teamLeaderName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;