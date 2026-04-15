import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/auth/my-courses");

        // ✅ FIX: match backend key safely
        setCourses(res.data.bookmarkedCourses || []);
      } catch (error) {
        console.log(error.response?.data || error.message);
        toast.error("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-300 font-medium bg-gray-950 min-h-screen">
        Loading your courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-400">No courses saved yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-lg"
            >
              {/* Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {course.title}
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  {course.description?.slice(0, 80)}...
                </p>

                <button
                  onClick={() =>
                    navigate(`/course/${course._id}/lectures`)
                  }
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg"
                >
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourse;