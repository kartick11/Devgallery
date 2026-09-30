import { useState, useEffect, useCallback } from "react";
import { projectApi } from "../api/project.api";
import { useProjectStore } from "../state/project.store";

export const useHomeLogic = (searchTerm) => {
  const { feedProjects, setFeedProjects } = useProjectStore();
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectApi.getProjects(searchTerm);

      // Handle the different backend response structures
      if (searchTerm) {
        if (data.success && Array.isArray(data.projects)) {
          setFeedProjects(data.projects);
        } else {
          setFeedProjects([]);
        }
      } else {
        if (Array.isArray(data)) {
          setFeedProjects(data);
        } else {
          setFeedProjects([]);
        }
      }
    } catch (error) {
      setFeedProjects([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, setFeedProjects]);

  // Auto-fetch whenever the searchTerm changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { 
    projects: feedProjects, 
    loading 
  };
};