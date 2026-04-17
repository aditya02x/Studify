import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useParams } from "react-router-dom";

const LecturePlayer = () => {

  const { id } = useParams(); // courseId

  const [lectures, setLectures] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedLectureId, setSelectedLectureId] = useState(null);

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const getEmbedUrl = (url) => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  // 🎥 Fetch lectures
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(`/lectures/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLectures(res.data.lectures);

        if (res.data.lectures.length > 0) {
          const firstLecture = res.data.lectures[0];

          setCurrentVideo(getEmbedUrl(firstLecture.video));
          setSelectedLectureId(firstLecture._id);
        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchLectures();
  }, [id]);

  // 💬 Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedLectureId) return;

      try {
        const res = await api.get(`/lectures/${selectedLectureId}/comments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setComments(res.data.comments);

      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, [selectedLectureId]);

  // ➕ Add comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        `/lectures/${selectedLectureId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments([res.data.comment, ...comments]);
      setContent("");

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">

      {/* LEFT → VIDEO + COMMENTS */}
      <div className="w-full lg:w-3/4 p-4 flex flex-col h-full overflow-hidden">

        {/* 🎥 VIDEO (fixed) */}
        <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
          {currentVideo ? (
            <iframe
              className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]"
              src={currentVideo}
              title="video"
              allowFullScreen
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-800">
              No Video Selected
            </div>
          )}
        </div>

        {/* 🎬 TITLE */}
        <h2 className="mt-4 text-base md:text-xl font-semibold flex-shrink-0">
          {lectures[activeIndex]?.title || "Select a Lecture"}
        </h2>

        {/* 💬 COMMENTS (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4">

          <h2 className="text-lg font-bold mb-3 border-b border-gray-700 pb-2">
            Comments
          </h2>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border rounded outline-none text-white bg-gray-800 border-gray-700 focus:border-blue-500"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={loading}
              className="bg-blue-500 text-white px-4 rounded"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {/* List */}
    <div className="space-y-6">
  {comments.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-800 rounded-xl">
      <p className="text-gray-500 italic">No voices here yet. Be the first to speak!</p>
    </div>
  ) : (
    comments.map((c) => (
      <div 
        key={c._id} 
        className="group relative p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all duration-300 ease-in-out shadow-sm"
      >
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
              {c.user?.name || "Anonymous User"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>
          
          <span className="text-[10px] text-gray-600">
            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            {c.content}
          </p>
        </div>
      </div>
    ))
  )}
</div>

        </div>

      </div>

      {/* RIGHT → LECTURES */}
      <div className="w-full lg:w-1/4 bg-gray-800 p-4 overflow-y-auto">

        <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">
          Lectures
        </h2>

        {lectures.length === 0 && (
          <p className="text-gray-400 text-sm">No lectures available</p>
        )}

        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto">

          {lectures.map((lecture, index) => (
            <div
              key={lecture._id}
              onClick={() => {
                setCurrentVideo(getEmbedUrl(lecture.video));
                setActiveIndex(index);
                setSelectedLectureId(lecture._id);
              }}
              className={`p-3 rounded-lg cursor-pointer text-sm ${
                index === activeIndex
                  ? "bg-indigo-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {index + 1}. {lecture.title}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default LecturePlayer;