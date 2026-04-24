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

  // ✅ FETCH COURSE
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
        setPurchased(res.data.hasPurchased);
      } catch (error) {
        console.log(error)
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // 💳 BUY COURSE
  const handleBuy = async () => {
    try {
      const { data: order } = await api.post("/payment/create-order", {
        courseId: id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Studify",
        description: course.title,

handler: async function (response) {
  console.log("FULL RESPONSE:", response); // debug

    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
    courseId: id,
  });

  toast.success("Payment successful 🎉");
  setPurchased(true);
},
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    }
  };

  // ❤️ SAVE
  const handleSave = async () => {
    try {
      const res = await api.post(`/auth/bookmark/${id}`);
      setSaved((prev) => !prev);
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center p-10 bg-gray-950 text-white">
        Course not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-96 object-cover rounded-xl"
        />

        <div className="mt-6">
          <h1 className="text-4xl font-bold">{course.title}</h1>

          <p className="text-gray-400 mt-4">
            {course.description}
          </p>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-2xl text-green-400 font-bold">
              {course.price > 0 ? `₹${course.price}` : "Free"}
            </span>

            <div className="flex gap-3">

              <button
                onClick={handleSave}
                className="bg-gray-700 px-4 py-2 rounded"
              >
                {saved ? "❤️ Saved" : "Save"}
              </button>

              {course.price > 0 ? (
                purchased ? (
                  <button
                    onClick={() =>
                      navigate(`/course/${id}/lectures`)
                    }
                    className="bg-indigo-600 px-5 py-2 rounded"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    className="bg-green-600 px-5 py-2 rounded"
                  >
                    Buy Now
                  </button>
                )
              ) : (
                <button
                  onClick={() =>
                    navigate(`/course/${id}/lectures`)
                  }
                  className="bg-indigo-600 px-5 py-2 rounded"
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