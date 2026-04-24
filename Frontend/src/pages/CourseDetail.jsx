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
  const [paying, setPaying] = useState(false);

  // FETCH COURSE
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
        setPurchased(res.data.hasPurchased);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // BUY COURSE
  const handleBuy = async () => {
    try {
      setPaying(true);
      const { data: order } = await api.post("/payment/create-order", {
        courseId: id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Studify",
        description: course.title,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: id,
            });
            toast.success("Payment successful 🎉");
            setPurchased(true);
          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setPaying(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Payment failed");
      setPaying(false);
    }
  };

  // SAVE / BOOKMARK
  const handleSave = async () => {
    try {
      await api.post(`/auth/bookmark/${id}`);
      setSaved((prev) => !prev);
      toast.success(saved ? "Removed from saved" : "Course saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
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

          <p className="text-gray-400 mt-4">{course.description}</p>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-2xl text-green-400 font-bold">
              {course.price > 0 ? `₹${course.price}` : "Free"}
            </span>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
              >
                {saved ? "❤️ Saved" : "🤍 Save"}
              </button>

              {course.price > 0 ? (
                purchased ? (
                  <button
                    onClick={() => navigate(`/course/${id}/lectures`)}
                    className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded transition"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={paying}
                    className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paying ? "Processing..." : "Buy Now"}
                  </button>
                )
              ) : (
                <button
                  onClick={() => navigate(`/course/${id}/lectures`)}
                  className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded transition"
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