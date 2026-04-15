import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { toast } from "react-toastify";
import api from "../services/api.js";

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [name, setName] = React.useState('')
  const [active, setActive] = React.useState('view')
  const [courses, setCourses] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    const fetchCources = async () => {
      try {
        const res = await api.get('/courses')
        setCourses(res.data.courses)
      } catch (error) {
        toast.error('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCources()

    const storedName = localStorage.getItem('name')
    if (storedName) setName(storedName)
  }, [])

  if (loading) {
    return (
      <div className='text-center p-10 text-gray-300 font-medium bg-gray-950 min-h-screen'>
        Loading courses...
      </div>
    )
  }

  return (
    <div className='flex flex-col md:flex-row h-screen bg-gray-950 text-white'>

      {/* Sidebar */}
      <aside className='w-full md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col shadow-sm md:h-screen'>

        {/* Logo */}
        <div className='flex items-center gap-3 px-6 py-5 border-b border-gray-800'>
          <div className='w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center'>
            <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' />
            </svg>
          </div>
          <span className='text-xl font-bold'>studify</span>
        </div>

        {/* Nav */}
        <nav className='flex flex-col gap-1 px-3 pt-4 flex-1'>

          <button
            onClick={() => { setActive('view'); navigate('/my-courses') }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm w-full text-left
            ${active === 'view'
                ? 'bg-gray-800 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            My Courses
          </button>

          <button
            onClick={() => { setActive('all'); navigate('/dashboard/all-courses') }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm w-full text-left
            ${active === 'all'
                ? 'bg-gray-800 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            All Courses
          </button>

        </nav>

        {/* Logout */}
        <div className='px-3 pb-6'>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('name')
              navigate('/login')
            }}
            className='text-red-400 bg-red-950 w-full py-2 rounded-lg'
          >
            Log Out
          </button>
        </div>

      </aside>

      {/* Main */}
      <main className='flex-1 overflow-y-auto bg-gray-950'>

        {/* Top bar */}
        <nav className='sticky top-0 bg-gray-900 border-b border-gray-800 z-10'>
          <div className='px-4 md:px-6 py-4'>
            <h1 className='text-xl md:text-2xl font-semibold'>
              Hello, {name}!
            </h1>
          </div>
        </nav>

        <div className='p-4 md:p-6'>

          <h1 className='text-2xl md:text-4xl font-bold mb-6'>
            Popular Courses
          </h1>

          {/* GRID RESPONSIVE FIX (already good, just safer spacing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">

            {courses?.map((course) => (
              <div
                key={course._id}
                className='flex flex-col border border-gray-800 rounded-2xl overflow-hidden bg-gray-900'
              >

                {/* thumbnail */}
                <div className='overflow-hidden'>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className='w-full h-40 object-cover'
                  />
                </div>

                {/* content */}
                <div className='p-4 flex flex-col flex-grow'>
                  <h2 className='font-bold text-lg'>
                    {course.title}
                  </h2>

                  <p className='text-gray-400 text-sm mt-2'>
                    {course.description}
                  </p>

                  <div className='mt-4 flex items-center justify-between'>
                    <span className='text-green-400 font-bold'>
                      ${course.price}
                    </span>

                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className='bg-indigo-600 px-3 py-1 rounded-lg text-sm'
                    >
                      View
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>

        </div>

        <Outlet />
      </main>

    </div>
  )
}

export default StudentDashboard