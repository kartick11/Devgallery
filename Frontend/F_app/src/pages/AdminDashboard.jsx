import { useState } from "react";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAdminLogic } from "../hooks/useAdminLogic";

const AdminDashboard = () => {
  // Inject Layer 2 
  const {
    pendingOrganizers,
    approvedOrganizers,
    scheduledOrganizers,
    loading,
    processingId,
    handleApprove,
    handleReject,
    handleDelete,
    handleCancelDeletion,
  } = useAdminLogic();

  // --- Reject Modal State ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [blockEmail, setBlockEmail] = useState(false);

  // --- Delete Modal State ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [hideProjects, setHideProjects] = useState(false);

  // --- Reject Handlers ---
  const openRejectModal = (organizer) => {
    setSelectedOrganizer(organizer);
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
    setBlockEmail(false);
    setSelectedOrganizer(null);
  };

  const submitRejection = () => {
    if (!selectedOrganizer) return;
    handleReject(
      selectedOrganizer._id,
      rejectReason,
      blockEmail,
      closeRejectModal
    );
  };

  // --- Delete Handlers ---
  const openDeleteModal = (organizer) => {
    setSelectedForDelete(organizer);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteReason("");
    setHideProjects(false);
    setSelectedForDelete(null);
  };

  const submitDeletion = () => {
    if (!selectedForDelete) return;
    handleDelete(
      selectedForDelete._id,
      hideProjects,
      deleteReason,
      closeDeleteModal
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900">
        <main className="max-w-7xl mx-auto p-6">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-linear-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-3">
              Manage organizer applications and approvals
            </p>
          </div>

          {/* Pending Applications Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              Pending Organizer Applications
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3 text-cyan-400">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading Applications...</span>
                </div>
              </div>
            ) : pendingOrganizers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400">No pending applications found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-cyan-300">Name</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Email</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Organization</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Status</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrganizers.map((organizer) => (
                      <tr key={organizer._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4 text-white">{organizer.organizationName}</td>
                        <td className="px-6 py-4 text-slate-300">{organizer.officialEmail}</td>
                        <td className="px-6 py-4 text-slate-300">{organizer.organizationName}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                            {organizer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {processingId === organizer._id ? (
                            <div className="flex items-center gap-2 text-cyan-400">
                              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApprove(organizer._id)}
                                className="px-4 py-2 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 text-white font-medium hover:scale-105 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(organizer)}
                                className="px-4 py-2 rounded-xl bg-linear-to-r from-red-500 to-rose-600 text-white font-medium hover:scale-105 transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Approved Organizers Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">
              Approved Organizers
            </h2>

            {approvedOrganizers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400">No approved organizers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-cyan-300">Organization</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Email</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Status</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedOrganizers.map((organizer) => (
                      <tr key={organizer._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4 text-white">{organizer.organizationName}</td>
                        <td className="px-6 py-4 text-slate-300">{organizer.officialEmail}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Approved
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {processingId === organizer._id ? (
                            <div className="flex items-center gap-2 text-rose-400">
                              <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <button
                              onClick={() => openDeleteModal(organizer)}
                              className="px-4 py-2 rounded-xl bg-linear-to-r from-slate-700 to-slate-800 border border-slate-600 text-white font-medium hover:bg-slate-700 hover:text-rose-400 hover:border-rose-500 transition"
                            >
                              Schedule Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Scheduled for Deletion Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-rose-500/20 rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-rose-400 mb-6">
              Scheduled for Deletion
            </h2>

            {scheduledOrganizers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400">
                  No accounts scheduled for deletion.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-cyan-300">Organization</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Email</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Scheduled Date</th>
                      <th className="px-6 py-4 text-left text-cyan-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledOrganizers.map((organizer) => (
                      <tr key={organizer._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4 text-white">{organizer.organizationName}</td>
                        <td className="px-6 py-4 text-slate-300">{organizer.officialEmail}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {new Date(organizer.deletionScheduledAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {processingId === organizer._id ? (
                            <div className="flex items-center gap-2 text-cyan-400">
                              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCancelDeletion(organizer._id)}
                              className="px-4 py-2 rounded-xl bg-linear-to-r from-slate-700 to-slate-800 border border-slate-600 text-white font-medium hover:bg-slate-700 hover:text-cyan-400 hover:border-cyan-500 transition"
                            >
                              Cancel Deletion
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Reject Application
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
              Rejecting{" "}
              <span className="text-cyan-400 font-semibold">
                {selectedOrganizer?.organizationName}
              </span>
            </p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
                rows="4"
                placeholder="Explain why this application is being rejected (sent to user)..."
              ></textarea>
            </div>

            <div className="mb-6 flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <input
                type="checkbox"
                id="blockEmail"
                checked={blockEmail}
                onChange={(e) => setBlockEmail(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-rose-500 rounded cursor-pointer"
              />
              <label
                htmlFor="blockEmail"
                className="text-sm text-slate-300 cursor-pointer leading-relaxed"
              >
                <strong className="block text-white mb-1">
                  Block Email Address
                </strong>
                Prevent {selectedOrganizer?.officialEmail} from submitting future applications.
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeRejectModal}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={processingId === selectedOrganizer?._id}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-rose-600 text-white font-medium hover:scale-105 transition shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                {processingId === selectedOrganizer?._id ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Schedule Deletion
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
              Schedule{" "}
              <span className="text-rose-400 font-semibold">
                {selectedForDelete?.organizationName}
              </span>{" "}
              for deletion in 7 days.
            </p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Custom Reason (Optional)
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
                rows="4"
                placeholder="Provide a reason for the deletion..."
              ></textarea>
            </div>

            <div className="mb-6 flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <input
                type="checkbox"
                id="hideProjects"
                checked={hideProjects}
                onChange={(e) => setHideProjects(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-rose-500 rounded cursor-pointer"
              />
              <label
                htmlFor="hideProjects"
                className="text-sm text-slate-300 cursor-pointer leading-relaxed"
              >
                <strong className="block text-white mb-1">
                  Hide Projects Immediately
                </strong>
                Hide all projects associated with this organizer from the public gallery immediately.
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitDeletion}
                disabled={processingId === selectedForDelete?._id}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-rose-600 text-white font-medium hover:scale-105 transition shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                {processingId === selectedForDelete?._id ? "Processing..." : "Schedule Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;