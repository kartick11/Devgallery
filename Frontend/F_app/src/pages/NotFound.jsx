import { Link } from "react-router-dom";
// Adjust these imports based on where you moved your static layout components
import Navbar from "../components/layout/Header"; 
import Footer from "../components/layout/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full">
          <h1 className="text-7xl font-bold text-indigo-600">404</h1>

          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Page Not Found
          </h2>

          <p className="text-gray-500 mt-3">
            The page you are looking for does not exist or may have been moved.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NotFound;