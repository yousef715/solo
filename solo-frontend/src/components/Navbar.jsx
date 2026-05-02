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
    <div className="navbar bg-base-100 shadow-sm px-6">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">Solo</Link>
      </div>
      <div className="flex gap-4 items-center">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle btn-sm">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Link to="/courses" className="btn btn-ghost btn-sm">Courses</Link>
        {user ? (
          <>
            <Link to="/leaderboard" className="btn btn-ghost btn-sm">🏆 Leaderboard</Link>
            <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
            <span className="text-sm text-base-content/60">Hi, {user.username || user.email}</span>
            <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar