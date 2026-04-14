import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onEdit, onDelete, onAddLecture }) => {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)} // ✅ THIS LINE
      className="border rounded-xl shadow-md p-4 w-full max-w-md bg-white cursor-pointer"
    >
      
      {/* Thumbnail */}
      <img
        src={course.thumbnail}
        alt="course"
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* Title */}
      <h2 className="text-xl font-bold mt-3">
        {course.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {course.description}
      </p>

      {/* Price */}
      <p className="text-green-600 font-semibold mt-2">
        ₹{course.price}
      </p>

      {/* Buttons */}
      <div
        className="flex gap-2 mt-4 flex-wrap"
        onClick={(e) => e.stopPropagation()} // ✅ IMPORTANT (prevents redirect when clicking buttons)
      >

        <button
          onClick={() => onEdit(course)}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(course._id)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
        >
          Delete
        </button>

        <button
          onClick={() => onAddLecture(course)}
          className="bg-black text-white px-3 py-1 rounded-lg"
        >
          Add Lecture
        </button>

      </div>
    </div>
  );
};

export default CourseCard;