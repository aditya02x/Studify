import React, { useEffect } from "react";
import api from "../../Services/api.js";
import { toast } from "react-toastify";

const UploadLecture = () => {
  const [title, setTitle] = React.useState("");
  const [video, setVideo] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [courseId, setCourseId] = React.useState("");
  const [courses, setCourses] = React.useState([]); // ✅ fixed: array not string
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/my-courses");
        setCourses(res.data.courses);
      } catch (err) {
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);

    api.post(
      "/lectures/create",
      { title, video, duration, courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        toast.success("Lecture created successfully!");
        setTitle("");
        setVideo("");
        setDuration("");
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
          required
        />

        <input
          placeholder="Video URL"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />

        {/* ✅ Fixed dropdown */}
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded"
        >
          {loading ? "Uploading..." : "Upload Lecture"}
        </button>
      </form>
    </div>
  );
};

export default UploadLecture;