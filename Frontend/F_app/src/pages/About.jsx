import React from "react";
import { Link } from "react-router-dom";
// Adjust these imports based on where you moved your layout components
// import Navbar from "../components/layout/Header";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const About = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        {/* Hero Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to DevGallery
            </h1>

            <div className="w-24 h-1 bg-cyan-400 mx-auto rounded-full my-6"></div>

            <p className="text-xl md:text-2xl text-slate-300 font-light">
              The Future of Tech Fest Showcases
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              About DevGallery
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              DevGallery was created to elevate college technical fests and
              bring student innovation to a global audience. We provide a
              seamless, secure platform where colleges can easily list their
              brightest student projects, and supporters from anywhere in the
              world can explore, engage, and vote for their favorites.
            </p>

            <p className="text-slate-300 leading-relaxed text-lg">
              Our goal is simple: give student innovators the recognition they
              deserve while ensuring every interaction remains fair,
              transparent, and secure.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-14">
              Core Features
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-8 hover:scale-105 hover:border-cyan-400 transition-all duration-300">
                <div className="text-5xl mb-5">🌍</div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  Campus to the World
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  Colleges can upload and showcase their students' hard work in
                  a centralized, professional gallery, moving hackathon builds
                  and capstone projects from the classroom to center stage.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-8 hover:scale-105 hover:border-violet-400 transition-all duration-300">
                <div className="text-5xl mb-5">🗳️</div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  Global Voting Access
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  Anyone, anywhere can browse the project gallery and support
                  the most innovative teams. Participation is no longer limited
                  by location.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-8 hover:scale-105 hover:border-emerald-400 transition-all duration-300">
                <div className="text-5xl mb-5">🔒</div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  Face Authentication Security
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  Advanced facial recognition technology ensures a strict
                  one-person, one-vote system, eliminating bots, duplicate
                  voting, and fraudulent participation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Our Mission
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed mb-5">
                Tech fests are where the next generation of engineers build the
                future. DevGallery ensures these projects are not just seen by a
                small panel of local judges, but by a worldwide community of
                tech enthusiasts, friends, alumni, and industry professionals.
              </p>

              <p className="text-slate-300 text-lg leading-relaxed">
                By combining a clean and intuitive gallery interface with
                cutting-edge biometric security, we have built the ultimate
                competitive showcase where innovation gets the recognition it
                deserves.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-cyan-500/20 via-violet-500/20 to-pink-500/20 backdrop-blur-lg border border-white/20 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Show the World Your Innovation
            </h2>

            <p className="text-lg text-slate-300 mb-8">
              Join DevGallery and help students gain the recognition they
              deserve through a fair, secure, and global platform.
            </p>

            <Link
              to="/"
              className="inline-block bg-linear-to-r from-cyan-500 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              Explore Projects
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;