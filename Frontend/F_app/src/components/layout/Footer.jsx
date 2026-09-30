import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              DevGallery
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              The future of Tech Fest showcases. Discover, support,
              and celebrate innovative student projects from around
              the world through a secure and transparent platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Upload Project
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Contact Us
            </h3>
            <div className="space-y-3 text-slate-400">
              <p>📞 +91 9876543210</p>
              <p>📧 support@devgallery.com</p>
              <p>🌍 India</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-5">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
              >
                Facebook
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-pink-500/20 hover:border-pink-400 transition"
              >
                Instagram
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-red-500/20 hover:border-red-400 transition"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} DevGallery. All Rights Reserved.
            </p>
            <p className="text-sm bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-semibold">
              Powered by DevGallery 🚀
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;