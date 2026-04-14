import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useParams } from "react-router-dom";

const LecturePlayer = () => {
  const { courseId } = useParams();

  const [lectures, setLectures] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // convert youtube link
  const getEmbedUrl = (url) => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(
          `/lectures/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLectures(res.data.lectures);

        if (res.data.lectures.length > 0) {
          setCurrentVideo(
            getEmbedUrl(res.data.lectures[0].video)
          );
        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchLectures();
  }, [courseId]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">

      {/* LEFT → VIDEO */}
      <div className="w-3/4 p-6 flex flex-col">
        
        <div className="rounded-xl overflow-hidden shadow-lg">
          {currentVideo ? (
            <iframe
              className="w-full h-[500px]"
              src={currentVideo}
              title="video"
              allowFullScreen
            />
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-gray-800">
              No Video Selected
            </div>
          )}
        </div>

        <h2 className="mt-4 text-xl font-semibold">
          {lectures[activeIndex]?.title || "Select a Lecture"}
        </h2>
      </div>

      {/* RIGHT → LECTURE LIST */}
      <div className="w-1/4 bg-gray-800 p-4 overflow-y-auto">
        
        <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">
          Lectures
        </h2>

        {lectures.map((lecture, index) => (
          <div
            key={lecture._id}
            onClick={() => {
              setCurrentVideo(getEmbedUrl(lecture.video));
              setActiveIndex(index);
            }}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
              index === activeIndex
                ? "bg-indigo-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <p className="text-sm">
              {index + 1}. {lecture.title}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default LecturePlayer;