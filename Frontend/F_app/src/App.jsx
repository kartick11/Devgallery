import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Pages
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Vote from "./pages/Vote";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
// import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerApplicationForm from "./pages/OrganizerApplicationForm";
import ProjectDetails from "./pages/ProjectDetails";
import SearchResults from "./pages/SearchResults";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PublicRoute from "./components/PublicRoute";
import OrganizerProfile from "./pages/OrganizerProfile";
import DeleteAccountRequest from "./pages/DeleteAccountRequest";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import AdminProtectedRoute from "./components/ProtectedRoutes/AdminProtectedRoute";
import OrganizerProtectedRoute from "./components/ProtectedRoutes/OrganizerProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Redirect Root */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/org-apply" element={<OrganizerApplicationForm />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/search/:searchTerm" element={<SearchResults />} />
        

        {/* Login Route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes (Any Logged In User) */}
        {/* <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/vote/:projectId"
          element={
            <ProtectedRoute>
              <Vote />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Organizer Routes */}
        {/* <Route
          path="/organizer/dashboard"
          element={
            <OrganizerProtectedRoute>
              <OrganizerDashboard />
            </OrganizerProtectedRoute>
          }
        /> */}

        <Route element={<OrganizerProtectedRoute />}>
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<OrganizerProfile />} />
        <Route path="/profile/DeleteAccountRequest" element={<DeleteAccountRequest />}
        />

        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
