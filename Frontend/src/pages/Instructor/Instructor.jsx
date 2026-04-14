import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Instructor = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/courses",
        { title, description, price, thumbnail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Course created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail("");
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create course");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted");
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete course");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading courses...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Instructor Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              {courses.length} course{courses.length !== 1 ? "s" : ""} published
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/upload-lecture")}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 transition-all"
            >
              Upload Lecture
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
            >
              {showForm ? "Cancel" : "+ New Course"}
            </button>
          </div>
        </div>

        {/* CREATE FORM */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-5">Create New Course</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack with React"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 499"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="What will students learn?"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="border-t border-gray-800 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl py-3 transition-all"
                >
                  {formLoading ? "Publishing..." : "Publish Course"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* COURSES GRID */}
        {courses.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <p className="text-gray-600 text-sm">No courses yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
              >
                <img
                  src={course.thumbnail}
                  className="h-44 w-full object-cover"
                  alt={course.title}
                />
                <div className="p-4">
                  <h2 className="font-semibold text-white text-sm leading-snug">{course.title}</h2>
                  <p className="text-indigo-400 font-medium text-sm mt-1">₹{course.price}</p>
                  <div className="border-t border-gray-800 mt-4 pt-3 flex gap-2">
                    <button
                      onClick={() => navigate("/upload-lecture")}
                      className="flex-1 text-xs font-medium py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-all"
                    >
                      Add Lecture
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex-1 text-xs font-medium py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructor;