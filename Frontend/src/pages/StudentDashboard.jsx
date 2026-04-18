import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { 
  BookOpen, 
  LayoutGrid, 
  LogOut, 
  Search, 
  X, 
  ChevronRight, 
  GraduationCap 
} from "lucide-react";
import api from "../Services/api.js";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const activeTab = location.pathname.includes('all-courses') ? 'all' : 'view';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.courses || []);
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    const storedName = localStorage.getItem('name');
    if (storedName) setName(storedName);
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-950'>
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col md:flex-row h-screen bg-gray-950 text-gray-100 overflow-hidden'>
      
      {/* Sidebar */}
      <aside className='w-full md:w-72 bg-gray-900 border-r border-gray-800 flex flex-col'>
        <div className='flex items-center gap-3 px-8 py-8'>
          <div className='w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20'>
            <GraduationCap className='w-6 h-6 text-white' />
          </div>
          <span className='text-2xl font-bold tracking-tight'>studify</span>
        </div>

        <nav className='flex-1 px-4 space-y-2'>
          <NavButton 
            active={activeTab === 'view'} 
            onClick={() => navigate('/my-courses')}
            icon={<BookOpen size={18} />}
            label="My Courses"
          />
          <NavButton 
            active={activeTab === 'all'} 
            onClick={() => navigate('/dashboard/all-courses')}
            icon={<LayoutGrid size={18} />}
            label="Explore All"
          />
        </nav>

        <div className='p-4 border-t border-gray-800'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group'
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto bg-gray-950 custom-scrollbar'>
        
        {/* Top Header */}
        <header className='sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-6'>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
            <div>
              <p className='text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1'>Student Workspace</p>
              <h1 className='text-3xl font-bold text-white'>Hello👋, {name}!</h1>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search courses, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
              {searchTerm && (
                <X 
                  size={18} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className='p-6 md:p-8 max-w-7xl mx-auto'>
          <div className="mb-8">
            <h3 className='text-xl font-bold'>Popular Courses</h3>
            <div className="h-1 w-12 bg-indigo-500 mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={course} 
                  onNavigate={() => navigate(`/course/${course._id}`)} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
                <p className="text-gray-500">No courses found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

/* Helper Components */

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full transition-all
    ${active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
  >
    {icon}
    {label}
  </button>
);

const CourseCard = ({ course, onNavigate }) => (
  <div className='group flex flex-col bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10'>
    <div className='relative h-44 overflow-hidden'>
      <img
        src={course.thumbnail}
        alt={course.title}
        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
      />
    </div>

    <div className='p-5 flex flex-col flex-grow'>
      <h4 className='font-bold text-lg leading-snug group-hover:text-indigo-400 transition-colors'>
        {course.title}
      </h4>
      <p className='text-gray-500 text-xs mt-3 line-clamp-2 leading-relaxed'>
        {course.description}
      </p>

      <div className='mt-auto pt-6 flex items-center justify-between'>
        <span className='text-green-400 font-bold text-lg'>
          ${course.price}
        </span>

        <button
          onClick={onNavigate}
          className='flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20'
        >
          View <ChevronRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

export default StudentDashboard;