import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ navigation

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data.courses);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10 font-medium">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-indigo-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Explore Courses
        </h1>
        <p className="text-gray-500 mt-2">
          Pick a course to start your learning journey.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses?.map((course) => (
          <div
            key={course._id}
            className="group flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden aspect-video">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold">
                ₹{course.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="font-bold text-lg text-gray-800">
                {course.title}
              </h2>

              <p className="text-gray-500 text-sm mt-2 flex-grow">
                {course.description}
              </p>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-green-600 font-bold">
                  ₹{course.price}
                </span>

                {/* ✅ BUTTON FIXED */}
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm px-4 py-2 rounded-lg"
                >
                  View Course
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No courses available
        </div>
      )}
    </div>
  );
};

export default AllCourses;