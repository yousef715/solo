import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEnrollments, getProgress, getCourses, updateUserGoal } from '../api'
import Spinner from '../components/Spinner'

function Dashboard() {
  const { user, setUser, logout } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [progress, setProgress] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [settingGoal, setSettingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(0)

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([getEnrollments(), getProgress(user.id), getCourses()])
      .then(([enrollRes, progressRes, coursesRes]) => {
        setEnrollments(enrollRes.data.data)
        setProgress(progressRes.data.data)
        setCourses(coursesRes.data.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
      
    if (user?.daily_goal) {
      setGoalInput(user.daily_goal)
    }
  }, [user])

  const completed = progress.filter(p => p.status === 'completed').length
  const inProgress = progress.filter(p => p.status === 'in_progress').length

  function isCourseCompleted(enrollmentCourse) {
    const course = courses.find(c => c.id === enrollmentCourse?.id || c.documentId === enrollmentCourse?.documentId);
    if (!course?.modules || course.modules.length === 0) return false;
    const completedModules = progress.filter(p => 
      p.status === 'completed' && course.modules.some(m => m.id === p.module?.id || m.documentId === p.module?.documentId)
    );
    return completedModules.length === course.modules.length;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = progress.filter(p => {
    if (p.status !== 'completed') return false;
    const updatedAt = new Date(p.updatedAt);
    return updatedAt >= today;
  }).length;

  const currentGoal = user?.daily_goal || 0;
  const isGoalSet = currentGoal > 0;
  const isGoalReached = isGoalSet && completedToday >= currentGoal;
  const goalProgress = isGoalSet ? Math.min((completedToday / currentGoal) * 100, 100) : 0;

  async function handleSetGoal() {
    if (!goalInput || goalInput <= 0) return;
    setSettingGoal(true);
    try {
      await updateUserGoal(user.id, goalInput);
      setUser({ ...user, daily_goal: goalInput });
      setSettingGoal(false);
    } catch (err) {
      console.error('Failed to set goal', err);
      setSettingGoal(false);
    }
  }
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

      {/* Daily Goal Tracker */}
      <div className="mb-10 bg-base-200 rounded-2xl p-6 shadow-sm border border-base-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              🎯 Daily Goal
            </h2>
            <p className="text-base-content/60 text-sm">
              {isGoalSet ? "Track your daily learning progress." : "Set a daily goal to build a learning habit!"}
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Goal:</span>
            <input 
              type="number" 
              className="input input-bordered input-sm w-20" 
              value={goalInput}
              onChange={(e) => {
                const val = e.target.value;
                setGoalInput(val === '' ? '' : parseInt(val));
              }}
              min="0"
            />
            <span className="text-sm">lessons</span>
            {goalInput !== currentGoal && (
              <button 
                className="btn btn-primary btn-sm ml-2" 
                onClick={handleSetGoal}
                disabled={settingGoal}
              >
                {settingGoal ? <span className="loading loading-spinner loading-xs"></span> : 'Save'}
              </button>
            )}
          </div>
        </div>

        {isGoalSet && (
          <div className="mt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-lg">
                {completedToday} / {currentGoal}
                <span className="text-sm text-base-content/60 ml-2 font-normal">lessons today</span>
              </span>
              <span className="text-sm font-medium text-primary">{Math.round(goalProgress)}%</span>
            </div>
            <progress 
              className={`progress w-full h-3 ${isGoalReached ? 'progress-success' : 'progress-primary'}`} 
              value={completedToday} 
              max={currentGoal}
            ></progress>
            
            {/* Motivational Message */}
            <div className="mt-3 text-sm font-medium">
              {isGoalReached ? (
                <span className="text-success flex items-center gap-1">
                  🎉 Amazing! You've reached your daily goal. Take a break or keep crushing it!
                </span>
              ) : completedToday > 0 ? (
                <span className="text-warning">
                  🔥 You're on fire! Only {currentGoal - completedToday} more to go.
                </span>
              ) : (
                <span className="text-base-content/60">
                  Ready to start? Pick a course and finish your first lesson today!
                </span>
              )}
            </div>
          </div>
        )}
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
            {enrollments.map(enrollment => {
              const completed = isCourseCompleted(enrollment.course)
              return (
                <div key={enrollment.id} className="bg-base-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{enrollment.course?.title}</h3>
                    <span className={`badge badge-sm mt-1 ${completed ? 'badge-success text-success-content' : 'badge-primary text-primary-content'}`}>
                      {completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 sm:mt-0">
                    {completed && (
                      <Link 
                        to={`/certificate/${enrollment.course?.documentId}`}
                        className="btn btn-sm btn-outline btn-warning"
                      >
                        View Certificate 🎓
                      </Link>
                    )}
                    <Link to={`/courses/${enrollment.course?.documentId}`} className={`btn btn-sm ${completed ? 'btn-outline btn-success' : 'btn-primary'}`}>
                      {completed ? 'Review Course' : 'Continue'}
                    </Link>
                  </div>
                </div>
              )
            })}
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