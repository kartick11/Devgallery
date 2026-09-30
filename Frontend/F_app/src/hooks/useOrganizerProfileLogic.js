import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../state/profile.store";
import { fetchOrganizerProfile } from "../api/organizer.api"; // NEW IMPORT

export const useOrganizerProfileLogic = () => {
  const navigate = useNavigate();
  const {
    profile,
    isProfileLoading: loading,
    setProfileData,
    setProfileLoading,
    setProfileError,
  } = useProfileStore();

  useEffect(() => {
    const getProfile = async () => {
      setProfileLoading(true);
      try {
        // Now we just call the clean API function!
        const data = await fetchOrganizerProfile();
        setProfileData(data.profile);
      } catch (error) {
        console.error("Profile Error:", error);
        setProfileError(error.message);
      }
    };

    getProfile();
  }, [setProfileData, setProfileLoading, setProfileError]);

  const handleDeleteNavigation = () => {
    navigate("/profile/DeleteAccountRequest");
  };

 

  return {
    profile,
    loading,
    handleDeleteNavigation,
  };
};