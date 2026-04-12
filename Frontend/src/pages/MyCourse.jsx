import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { toast } from "react-toastify";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/course/my-courses");
        setCourses(res.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl  font-bold mb-4">My Courses</h2>

      <div className="grid grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course._id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{course.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourse;