import { useState, useEffect, useCallback } from "react";
import { organizerApi } from "../api/organizer.api";
import { useProjectStore } from "../state/project.store";
import utils from "../utils";

export const useUploadLogic = () => {
  const { myProjects, setMyProjects, removeProject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    try {
      const result = await organizerApi.getMyProjects(token);
      setMyProjects(result.projects || []);
    } catch (err) {

    }
  }, [token, setMyProjects]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const uploadProject = async (projectData, onSuccess) => {
    setLoading(true);

    // Build the FormData inside the hook, keeping the UI dumb
    const formData = new FormData();
    Object.keys(projectData).forEach(key => {
      formData.append(key, projectData[key]);
    });

    try {
      const result = await organizerApi.createProject(token, formData);
      if (result.success) {
        utils.handleSuccess("Project uploaded successfully");
        fetchProjects(); // Refresh the list
        onSuccess(); // Callback to reset the form inputs in the UI
      } else {
        utils.handleError(result.message);
      }
    } catch (error) {

      utils.handleError("Failed to upload project");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      setDeletingId(projectId);
      const result = await organizerApi.deleteProject(token, projectId);

      if (result.success) {
        utils.handleSuccess("Project deleted successfully");
        removeProject(projectId); // Instantly remove from global state
      } else {
        utils.handleError(result.message);
      }
    } catch (error) {
      utils.handleError("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    myProjects,
    loading,
    deletingId,
    uploadProject,
    deleteProject
  };
};