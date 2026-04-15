import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
      } catch (error) {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className='text-center p-10 text-gray-300 bg-gray-950 min-h-screen'>
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className='text-center p-10 text-gray-300 bg-gray-950 min-h-screen'>
        Course not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      <div className='max-w-5xl mx-auto'>

        {/* Thumbnail */}
        <img
          src={course.thumbnail}
          alt={course.title}
          className='w-full h-96 object-cover rounded-xl'
        />

        {/* Content */}
        <div className='mt-6'>

          <h1 className='text-4xl font-bold'>
            {course.title}
          </h1>

          <p className='text-gray-400 mt-4 text-lg'>
            {course.description}
          </p>

          {/* Price + Button */}
          <div className='mt-6 flex items-center justify-between'>

            <span className='text-2xl font-bold text-green-400'>
              ₹{course.price}
            </span>

            <button
              onClick={() => navigate(`/course/${course._id}/lectures`)}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition"
            >
              Start Learning
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CourseDetail;