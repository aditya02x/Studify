import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [name,setName]=React.useState('')
  const [active, setActive] = React.useState('view')

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
    }, []);

  return (
    <div className='flex h-screen bg-indigo-50'>

      {/* Sidebar */}
      <aside className='h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm flex-shrink-0'>

        {/* Logo */}
        <div className='flex items-center gap-3 px-6 py-5 border-b border-gray-100'>
          <div className='w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0'>
            <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' />
            </svg>
          </div>
          <span className='text-xl font-bold text-indigo-900 tracking-tight'>studify</span>
        </div>

        {/* Nav */}
        <nav className='flex flex-col gap-1 px-3 pt-4 flex-1'>
          <button
            onClick={() => { setActive('view'); navigate('/my-courses') }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left
              ${active === 'view'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
          >
            <svg className='w-4 h-4 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' />
            </svg>
            View Courses
          </button>

          <button
            onClick={() => { setActive('all'); navigate('/dashboard/all-courses') }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left
              ${active === 'all'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
          >
            <svg className='w-4 h-4 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z' />
            </svg>
            All Courses
          </button>
        </nav>

        {/* Logout */}
        <div className='px-3 pb-6'>
          <button
            onClick={() =>{
                localStorage.removeItem('token');
                localStorage.removeItem('name');

                navigate('/login')}
            }
            className='flex items-center justify-center gap-3 py-2.5 rounded-lg text-sm font-medium text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all duration-150 w-full'
          >
            <svg className='w-4 h-4 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            Log Out
          </button>
        </div>

      </aside>

      <main className='flex-1 overflow-y-auto'>
      <nav className='sticky top-0 bg-white border-b border-gray-200 z-10'>
            <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-100'>
                <h1 className='text-2xl font-semibold text-gray-800'>Hello, {name }!</h1>
            </div>
      </nav>
      <h1 className='text-5xl'>Heloo</h1>


        <Outlet />
      </main>

    </div>
  )
}

export default StudentDashboard