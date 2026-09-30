// src/pages/DeleteAccountRequest.jsx
import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useDeleteAccountLogic } from "../hooks/useDeleteAccountLogic";

const DeleteAccountRequest = () => {
  const {
    reason,
    setReason,
    otherReason,
    setOtherReason,
    confirmed,
    setConfirmed,
    loading,
    handleSubmit,
  } = useDeleteAccountLogic();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-8">
              <div className="flex items-center gap-4">
                <Trash2 size={40} className="text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Delete Account Request
                  </h1>
                  <p className="text-red-100">
                    Submit a request to permanently delete your organizer account
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Reason */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Why are you deleting this account?
                </label>

                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  <option value="">Select Reason</option>
                  <option value="Event Completed">Event Completed</option>
                  <option value="Organization Closed">Organization Closed</option>
                  <option value="Created By Mistake">Created By Mistake</option>
                  <option value="No Longer Needed">No Longer Needed</option>
                  <option value="Privacy Concerns">Privacy Concerns</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Other Reason */}
              {reason === "Other" && (
                <div>
                  <label className="block text-slate-300 mb-2 font-medium">
                    Please specify
                  </label>

                  <textarea
                    rows="4"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Mention your reason..."
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
              )}

              {/* Warning Box */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-400" />
                  <h3 className="text-red-400 font-bold text-lg">
                    Important Warning
                  </h3>
                </div>

                <ul className="mt-4 text-slate-300 space-y-2 list-disc pl-6">
                  <li>
                    Your organizer account will be permanently deleted after 7 days from today. You can cancel account deletion in between the 7 days.
                  </li>
                  <li>All projects uploaded under this account will be deleted.</li>
                  <li>All images stored for your projects will be removed.</li>
                  <li>Voting records and project related information may be deleted.</li>
                  <li>This action cannot be reversed after deletion.</li>
                </ul>
              </div>

              {/* Confirmation */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-5 w-5"
                />
                <label className="text-slate-300">
                  I understand that all data associated with this organizer account
                  including projects, uploaded images, and related records may be
                  permanently deleted after approval.
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-semibold transition"
              >
                {loading ? "Submitting Request..." : "Submit Deletion Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DeleteAccountRequest;