import React, { useState } from "react";
import api from "../../services/api.js";
import { toast } from "react-toastify";

const CreateNew = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/courses",
        {
          title,
          description,
          price,
          thumbnail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Course created successfully!");

      // reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail("");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        
        <h1 className="text-3xl font-bold mb-6">
          Create Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

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
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded"
          >
            {loading ? "Publishing..." : "Publish Course"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateNew;