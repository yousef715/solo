import { useState, useEffect, useRef } from 'react'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import Certificate from '../components/Certificate'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEnrollments, getProgress, getCourses } from '../api'
import Spinner from '../components/Spinner'

function Dashboard() {
  const { user, logout } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [progress, setProgress] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const certRef = useRef(null)
  const [certData, setCertData] = useState({ studentName: '', courseName: '', date: '' })
  const [downloadingId, setDownloadingId] = useState(null)

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
  }, [])

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

  const handleDownloadCertificate = (course) => {
    setDownloadingId(course.id)
    setCertData({
      studentName: user?.username || user?.email || 'Student',
      courseName: course.title,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    })
    
    // Wait for React to re-render the hidden component with new data
    setTimeout(() => {
      if (certRef.current) {
        toPng(certRef.current, { cacheBust: true, pixelRatio: 2 })
          .then((dataUrl) => {
            download(dataUrl, `${course.title}_Certificate.png`);
            setDownloadingId(null);
          })
          .catch((err) => {
            console.error('Image capture error:', err);
            setDownloadingId(null);
          });
      }
    }, 500);
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
                <div key={enrollment.id} className="bg-base-200 rounded-2xl p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{enrollment.course?.title}</h3>
                    <span className={`badge badge-sm mt-1 ${completed ? 'badge-success text-success-content' : 'badge-primary text-primary-content'}`}>
                      {completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {completed && (
                      <button 
                        onClick={() => handleDownloadCertificate(enrollment.course)}
                        disabled={downloadingId === enrollment.course?.id}
                        className="btn btn-sm btn-outline btn-warning"
                      >
                        {downloadingId === enrollment.course?.id ? <span className="loading loading-spinner loading-xs"></span> : 'Download Certificate 🎓'}
                      </button>
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

      {/* Hidden Certificate Component for html-to-image */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <Certificate 
          ref={certRef}
          studentName={certData.studentName}
          courseName={certData.courseName}
          date={certData.date}
        />
      </div>

    </div>
  )
}

export default Dashboard