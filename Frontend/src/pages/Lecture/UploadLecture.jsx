import React from "react";
import api from "../../services/api.js";
import { toast } from "react-toastify";

const UploadLecture = () => {
  const [title, setTitle] = React.useState("");
  const [video, setVideo] = React.useState("");
  const [courseId, setCourseId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    setLoading(true);

    api.post(
      "/lectures/create",
      { title, video, courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        toast.success("Lecture created successfully!");
        setTitle("");
        setVideo("");
        setCourseId("");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create lecture");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl space-y-4 w-full max-w-md"
      >
        <h1 className="text-white text-xl font-bold">Upload Lecture</h1>

        <input
          placeholder="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
        />

        <input
          placeholder="Video URL"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
        />

        <input
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
        />

        <button className="w-full bg-indigo-600 text-white p-3 rounded">
          {loading ? "Uploading..." : "Upload Lecture"}
        </button>
      </form>
    </div>
  );
};

export default UploadLecture;