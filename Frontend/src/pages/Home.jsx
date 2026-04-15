
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Learn Skills <span className="text-indigo-500">Faster</span> with Studify
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl text-sm md:text-lg">
          A modern learning platform where you can explore courses, save them,
          and learn at your own pace with structured video lectures.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/dashboard/all-courses")}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Explore Courses
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Get Started
          </button>
        </div>

      </div>

      {/* FEATURES SECTION */}
      <div className="px-6 py-16 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Studify?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold text-indigo-400">
              🎥 Video Lectures
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              Learn with structured video-based courses anytime, anywhere.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold text-indigo-400">
              💾 Save Courses
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              Bookmark your favorite courses and continue later easily.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold text-indigo-400">
              🚀 Fast Learning
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              Simple UI designed for distraction-free learning experience.
            </p>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 py-10 border-t border-gray-800">
        © {new Date().getFullYear()} Studify. Built by Aditya Raj.
      </div>

    </div>
  );
};

export default Home;
