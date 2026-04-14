import React from 'react'
import api from "../../services/api.js";
import { toast } from "react-toastify";

const UploadLecture = () => {
    const [title, setTitle] = React.useState("");
    const [duration, setDuration] = React.useState("");
    const [video, setVideo] = React.useState("");
    const [courseId, setCourseId] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setLoading(true);

        api.post("/lectures/create", { title, duration, video, courseId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            toast.success("Lecture created successfully!");
            setTitle("");
            setDuration("");
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
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                            </svg>
                        </div>
                        <h1 className="text-white text-xl font-semibold tracking-tight">Upload Lecture</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-11">Add a new lecture to your course</p>
                </div>

                {/* Form Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Lecture Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Introduction to React Hooks"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Duration
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 12:30"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Video URL */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Video URL
                        </label>
                        <input
                            type="text"
                            placeholder="https://..."
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Course ID */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Course ID
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 64abc123..."
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-800 pt-2" />

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !title || !duration || !video || !courseId}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl py-3 px-4 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload Lecture
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadLecture;