import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import MyCourse from "./pages/MyCourse";
import CourseCard from "./components/CourseCard";
import AllCourses from "./pages/AllCourses";

import ProtectedRoute from "./components/ProctedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/my-courses" element={<MyCourse />} />
        <Route path="/course-card" element={<CourseCard />} />
        <Route path="/dashboard/all-courses" element={<AllCourses />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;