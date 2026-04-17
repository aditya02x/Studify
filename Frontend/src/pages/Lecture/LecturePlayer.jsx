import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useParams } from "react-router-dom";

const LecturePlayer = () => {


  const { id } = useParams();
  const [comments ,setCommets ] = useState([]);

  const [lectures, setLectures] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

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

        const res = await api.get(`/lectures/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLectures(res.data.lectures);

        if (res.data.lectures.length > 0) {
          setCurrentVideo(getEmbedUrl(res.data.lectures[0].video));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLectures();
  }, [id]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">

      {/* LEFT → VIDEO */}
      <div className="w-full lg:w-3/4 p-4 md:p-6 flex flex-col">

        <div className="rounded-xl overflow-hidden shadow-lg">

          {currentVideo ? (
            <iframe
              className="w-full h-[220px] sm:h-[350px] md:h-[450px] lg:h-[500px]"
              src={currentVideo}
              title="video"
              allowFullScreen
            />
          ) : (
            <div className="h-[220px] sm:h-[350px] md:h-[450px] lg:h-[500px] flex items-center justify-center bg-gray-800">
              No Video Selected
            </div>
          )}

        </div>

        <h2 className="mt-4 text-base md:text-xl font-semibold">
          {lectures[activeIndex]?.title || "Select a Lecture"}
        </h2>

      </div>

      {/* RIGHT → LECTURE LIST */}
      <div className="w-full lg:w-1/4 bg-gray-800 p-3 md:p-4 overflow-y-auto">

        <h2 className="text-lg font-bold mb-3 md:mb-4 border-b border-gray-700 pb-2">
          Lectures
        </h2>

        {lectures.length === 0 && (
          <p className="text-gray-400 text-sm">No lectures available</p>
        )}

        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0">

          {lectures.map((lecture, index) => (
            <div
              key={lecture._id}
              onClick={() => {
                setCurrentVideo(getEmbedUrl(lecture.video));
                setActiveIndex(index);
              }}
              className={`min-w-[180px] lg:min-w-0 p-3 rounded-lg cursor-pointer transition text-sm ${
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