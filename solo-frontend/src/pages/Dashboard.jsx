import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEnrollments, getProgress } from '../api'
import Spinner from '../components/Spinner'

function Dashboard() {
  const { user, logout } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getEnrollments(), getProgress()])
      .then(([enrollRes, progressRes]) => {
        setEnrollments(enrollRes.data.data)
        setProgress(progressRes.data.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const completed = progress.filter(p => p.status === 'completed').length
  const inProgress = progress.filter(p => p.status === 'in_progress').length

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.username || user?.email} 👋</h1>
          <p className="text-base-content/60 mt-1">Here's your learning overview</p>
        </div>
        <button onClick={logout} className="btn btn-outline btn-error btn-sm">Logout</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="stat bg-base-200 rounded-2xl">
          <div className="stat-title">My XP Points</div>
          <div className="stat-value text-secondary">{user?.xp || 0}</div>
          <div className="stat-desc">Total experience</div>
        </div>
        <div className="stat bg-base-200 rounded-2xl">
          <div className="stat-title">Enrolled Courses</div>
          <div className="stat-value text-primary">{enrollments.length}</div>
          <div className="stat-desc">Total enrollments</div>
        </div>
        <div className="stat bg-base-200 rounded-2xl">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">{completed}</div>
          <div className="stat-desc">Lessons done</div>
        </div>
        <div className="stat bg-base-200 rounded-2xl">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-warning">{inProgress}</div>
          <div className="stat-desc">Lessons active</div>
        </div>
      </div>

      {/* My Courses */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        {enrollments.length === 0 ? (
          <div className="bg-base-200 rounded-2xl p-10 text-center">
            <p className="text-base-content/60 mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="bg-base-200 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{enrollment.course?.title}</h3>
                  <span className={`badge badge-sm ${enrollment.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                    {enrollment.status}
                  </span>
                </div>
                <Link to={`/courses/${enrollment.course?.documentId}`} className="btn btn-primary btn-sm">
                  Continue
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <div className="bg-base-200 rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-base-content/60">Username</span>
            <span className="font-medium">{user?.username || '—'}</span>
          </div>
          <div className="divider my-0"></div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard