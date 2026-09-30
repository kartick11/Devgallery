// src/hooks/useSearchLogic.js
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectsBySearchTerm } from "../api/project.api";
import { useProjectStore } from "../state/project.store";

export const useSearchLogic = () => {
  const { searchTerm } = useParams();
  const {
    searchResults: projects,
    isSearchLoading: isLoading,
    searchError: error,
    setSearchResults,
    setSearchLoading,
    setSearchError,
  } = useProjectStore();

  useEffect(() => {
    if (!searchTerm) return;

    const loadSearchResults = async () => {
      setSearchLoading(true);
      try {
        const data = await fetchProjectsBySearchTerm(searchTerm);
        setSearchResults(data || []);
      } catch (err) {
        setSearchError(err.message || "An error occurred while searching.");
      }
    };

    loadSearchResults();
  }, [searchTerm, setSearchResults, setSearchLoading, setSearchError]);

  return {
    searchTerm,
    projects,
    isLoading,
    error,
  };
};