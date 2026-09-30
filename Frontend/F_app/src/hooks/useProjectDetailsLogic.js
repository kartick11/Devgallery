// src/hooks/useProjectDetailsLogic.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjectById } from "../api/project.api";
import { useProjectStore } from "../state/project.store";

export const useProjectDetailsLogic = (id) => {
  const navigate = useNavigate();
  const {
    currentProject: project,
    isProjectLoading: loading,
    projectError: error,
    setCurrentProject,
    setProjectLoading,
    setProjectError,
    clearCurrentProject,
  } = useProjectStore();

  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      setProjectLoading(true);
      try {
        const data = await fetchProjectById(id);
        setCurrentProject(data);
      } catch (err) {
        setProjectError(err.message || "An error occurred while fetching the project.");
      }
    };

    loadProject();

    // Cleanup: Clear the current project when the component unmounts
    // so returning to this page doesn't briefly flash old data
    return () => clearCurrentProject();
  }, [id, setCurrentProject, setProjectLoading, setProjectError, clearCurrentProject]);

  const handleVote = (projectId) => {
    navigate(`/vote/${projectId}`);
  };

  return {
    project,
    loading,
    error,
    handleVote,
  };
};