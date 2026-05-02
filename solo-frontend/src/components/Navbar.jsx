import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-6">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/courses">Courses</Link></li>
            {user && (
              <>
                <li><Link to="/leaderboard">🏆 Leaderboard</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="text-xl font-bold text-primary ml-2 lg:ml-0">Solo</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">
          <li><Link to="/courses">Courses</Link></li>
          {user && (
            <>
              <li><Link to="/leaderboard">🏆 Leaderboard</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end flex gap-2 items-center">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle btn-sm">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/60 hidden sm:inline-block">Hi, {user.username || user.email}</span>
            <button onClick={logout} className="btn btn-ghost btn-sm text-error">Logout</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar