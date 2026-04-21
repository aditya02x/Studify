import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Services/api.js";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // ✅ FETCH COURSE (FIXED)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);

        setCourse(res.data.course);
        setPurchased(res.data.hasPurchased); // ✅ correct source of truth

      } catch (error) {
        console.log("Fetch error:", error.response?.data || error.message);
        toast.error("Failed to load course");
      } finally {
        
    try {
      const { data: order } = await api.post("/api/payment/create-order", {
        courseId: id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Studify",
        description: course.title,

        handler: async function (response) {
          await api.post("/api/payment/verify", {
            paymentId: response.razorpay_payment_id,
            courseId: id,
          });

          toast.success("Payment successful 🎉");
          setPurchased(true);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log("Payment failed:", error.response?.data || error.message);
      toast.error("Payment failed");
    }
  };

  // ❤️ SAVE
  const handleSave = async () => {
    try {
      const res = await api.post(`/auth/bookmark/${id}`);
      setSaved((prev) => !prev);
      toast.success(res.data.success ? "Course updated" : "Done");
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="text-center p-10 text-gray-300 bg-gray-950 min-h-screen">
        Loading course details...
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!course) {
    return (
      <div className="text-center p-10 text-gray-300 bg-gray-950 min-h-screen">
        Course not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Thumbnail */}
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-96 object-cover rounded-xl"
        />

        {/* Content */}
        <div className="mt-6">
          <h1 className="text-4xl font-bold">{course.title}</h1>

          <p className="text-gray-400 mt-4 text-lg">
            {course.description}
          </p>

          {/* Price + Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-bold text-green-400">
              {course.price > 0 ? `₹${course.price}` : "Free"}
            </span>

            <div className="flex gap-3">

              {/* SAVE */}
              <button
                onClick={handleSave}
                className={`px-5 py-3 rounded-lg font-medium transition ${
                  saved
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {saved ? "❤️ Saved" : "Save Course"}
              </button>

              {/* ACTION BUTTON */}
              {course.price > 0 ? (
                purchased ? (
                  <button
                    onClick={() =>
                      navigate(`/course/${id}/lectures`)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium"
                  >
                    Buy Now
                  </button>
                )
              ) : (
                <button
                  onClick={() =>
                    navigate(`/course/${id}/lectures`)
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium"
                >
                  Start Learning
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;