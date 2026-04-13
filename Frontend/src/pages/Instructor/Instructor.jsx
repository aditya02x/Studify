import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { toast } from "react-toastify";

const Instructor = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  // GET courses
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

  // CREATE course
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

      // reset form
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

  // DELETE course
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {showForm ? "Close" : "Create New"}
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg mb-6">
          <h2 className="text-3xl font-bold mb-6">Create Course</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Course Title"
              className="w-full border p-3 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              className="w-full border p-3 rounded"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full border p-3 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Thumbnail URL"
              className="w-full border p-3 rounded"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-black text-white p-3 rounded disabled:opacity-60"
            >
              {formLoading ? "Publishing..." : "Publish Course"}
            </button>
          </form>
        </div>
      )}

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border rounded-xl p-4 shadow bg-white"
          >
            <img
              src={course.thumbnail}
              className="h-40 w-full object-cover rounded"
              alt={course.title}
            />

            <h2 className="font-bold mt-2">{course.title}</h2>

            <p className="text-gray-600 text-sm">₹{course.price}</p>

            <button
              onClick={() => handleDelete(course._id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructor;