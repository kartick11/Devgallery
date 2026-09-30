// src/pages/OrganizerProfile.jsx
import React from "react";
import {
  User,
  Mail,
  FolderKanban,
  Calendar,
  Trash2,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useOrganizerProfileLogic } from "../hooks/useOrganizerProfileLogic";
import { useDeleteAccountLogic } from "../hooks/useDeleteAccountLogic";

const OrganizerProfile = () => {
  // 1. Grab the fetchProfile function (or whatever your refetch function is named)
  const { profile, loading, handleDeleteNavigation, fetchProfile } =
    useOrganizerProfileLogic();

  // 2. Pass it to the hook so it updates the UI immediately upon success, and grab cancelLoading
  const { handleCancelDeletion, cancelLoading } =
    useDeleteAccountLogic(fetchProfile);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h2 className="text-cyan-400 text-2xl font-bold animate-pulse">
          Loading Profile...
        </h2>
      </div>
    );
  }

  // Check if the user is currently in a 7-day cooldown period
  const isCooldownActive = profile?.deletionCooldownUntil
    ? new Date(profile.deletionCooldownUntil) > new Date()
    : false;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            {/* ... (Header code remains exactly the same) ... */}
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-10">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={60} className="text-cyan-400" />
                  )}
                </div>

                <h1 className="text-white text-3xl font-bold mt-4">
                  Organizer Profile
                </h1>

                <p className="text-cyan-100 mt-2">
                  Manage your organizer account
                </p>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* ... (Email, Projects, Created Date remain exactly the same) ... */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                  <Mail className="text-cyan-400" size={28} />
                  <div>
                    <p className="text-slate-400 text-sm">Email Address</p>
                    <p className="text-white font-semibold break-all">
                      {profile?.email}
                    </p>
                  </div>
                </div>
                {/* Projects */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                  <FolderKanban className="text-green-400" size={28} />
                  <div>
                    <p className="text-slate-400 text-sm">Total Projects</p>
                    <p className="text-white font-semibold">
                      {profile?.totalProjects}
                    </p>
                  </div>
                </div>

                {/* Created Date */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                  <Calendar className="text-blue-400" size={28} />
                  <div>
                    <p className="text-slate-400 text-sm">Account Created</p>
                    <p className="text-white font-semibold">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                  <ShieldCheck
                    className={
                      profile?.isPendingDeletion
                        ? "text-red-400"
                        : "text-green-400"
                    }
                    size={28}
                  />

                  <div>
                    <p className="text-slate-400 text-sm">Account Status</p>

                    {profile?.isPendingDeletion ? (
                      <div>
                        <p className="text-red-400 font-semibold">
                          Pending Deletion
                        </p>

                        {profile?.deletionScheduledAt && (
                          <p className="text-slate-300 text-sm">
                            Scheduled:{" "}
                            {new Date(
                              profile.deletionScheduledAt,
                            ).toLocaleDateString()}
                          </p>
                        )}

                        {/* Cancel Deletion Logic */}
                        {profile?.deletionRequestedByRole !== "admin" ? (
                          <button
                            onClick={handleCancelDeletion}
                            disabled={cancelLoading} // 3. Prevent spam clicks
                            className="mt-3 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 px-4 py-2 rounded-lg text-white transition font-medium"
                          >
                            {cancelLoading
                              ? "Cancelling..."
                              : "Cancel Deletion"}
                          </button>
                        ) : (
                          <p className="text-red-500 text-xs mt-2 font-medium">
                            Your account deletion is scheduled by admin. Please
                            contact admin as soon as possible.
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-green-400 font-semibold">Active</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-8 border border-red-500/30 bg-red-500/10 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <Trash2 className="text-red-400" />
                  <h3 className="text-red-400 font-bold text-lg">
                    Danger Zone
                  </h3>
                </div>

                <p className="text-slate-300 mt-2">
                  Deleting your organizer account will permanently remove your
                  profile and associated data.
                </p>

                <button
                  onClick={handleDeleteNavigation}
                  disabled={profile?.isPendingDeletion || isCooldownActive}
                  className="mt-4 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-400 transition rounded-xl text-white font-semibold"
                >
                  {profile?.isPendingDeletion
                    ? "Deletion Pending"
                    : isCooldownActive
                      ? "On Cooldown"
                      : "Delete Account"}
                </button>

                {/* Show cooldown message if active */}
                {isCooldownActive && (
                  <p className="text-yellow-500 text-sm mt-3 font-medium">
                    You recently cancelled a deletion request. You can re-apply
                    after{" "}
                    {new Date(
                      profile.deletionCooldownUntil,
                    ).toLocaleDateString()}
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrganizerProfile;
