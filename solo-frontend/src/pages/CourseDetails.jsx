import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourses, enrollCourse, getProgress, createProgress, updateProgress, getEnrollments, updateUserXP } from '../api'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

function CourseDetails() {
  const { id } = useParams()
  const { user, setUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    getCourses()
      .then(res => {
        const found = res.data.data.find(c => c.documentId === id)
        setCourse(found)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))

    if (user) {
      getProgress(user.id)
        .then(res => setProgress(res.data.data))
        .catch(err => console.error(err))

      getEnrollments()
        .then(res => {
          const enrolled = res.data.data.some(e => e.course?.documentId === id)
          setIsEnrolled(enrolled)
        })
        .catch(err => console.error(err))
    }
  }, [id, user])

  async function handleEnroll() {
    setEnrolling(true)
    setMessage('')
    try {
      await enrollCourse(id)
      setMessage('Successfully enrolled! 🎉')
      setIsEnrolled(true)
    } catch (err) {
      setMessage(err.response?.data?.error?.message || 'Already enrolled or error occurred.')
    } finally {
      setEnrolling(false)
    }
  }

  async function handleStart(mod) {
    try {
      const res = await createProgress({
        module: mod.documentId || mod.id,
        status: 'in_progress',
        score: 0,
        time_spent: 0,
      })
      const newProgress = res.data.data;
      newProgress.module = mod; // Manually attach module relation for UI state
      setProgress([...progress, newProgress])
      setMessage('Lesson started! 🚀')
    } catch (err) {
      console.error(err)
      const backendError = err.response?.data?.error?.message || err.message
      setMessage(`Error starting lesson: ${backendError}`)
    }
  }

  async function handleFinish(mod) {
    const existing = progress.find(p => p.module?.id === mod.id || p.module?.documentId === mod.documentId)
    if (!existing) return
    try {
      const res = await updateProgress(existing.documentId, {
        status: 'completed',
        score: 100,
      })
      const updatedProgress = res.data.data;
      updatedProgress.module = mod; // Keep the module relation attached
      setProgress(progress.map(p => p.documentId === existing.documentId ? updatedProgress : p))
      
      // Award 10 XP
      const newXP = (user.xp || 0) + 10
      await updateUserXP(user.id, newXP)
      setUser({ ...user, xp: newXP })

      setMessage('Lesson marked as complete! +10 XP Earned! 🏆')
    } catch (err) {
      console.error(err)
      const backendError = err.response?.data?.error?.message || err.message
      setMessage(`Error finishing lesson: ${backendError}`)
    }
  }

  function getModuleStatus(mod) {
    const p = progress.find(p => p.module?.id === mod.id || p.module?.documentId === mod.documentId)
    return p?.status || null
  }

  if (loading) return <Spinner />
  if (!course) return <div className="p-10 text-xl">Course not found!</div>

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <Link to="/courses" className="btn btn-ghost btn-sm mb-6">← Back to Courses</Link>
      <span className="badge badge-primary">{course.category}</span>
      <h1 className="text-4xl font-bold mt-2 mb-2">{course.title}</h1>
      <p className="text-base-content/60 mb-4">By {course.instructorName || 'Unknown'}</p>
      <p className="text-base-content mb-8">{course.description}</p>

      {/* Modules */}
      {course.modules && course.modules.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Course Modules</h2>
          <div className="flex flex-col gap-3">
            {course.modules.map((mod, index) => {
              const status = getModuleStatus(mod)
              return (
                <div key={mod.id} className="bg-base-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${status === 'completed' ? 'bg-success text-success-content' : 'bg-primary text-primary-content'}`}>
                      {status === 'completed' ? '✓' : index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{mod.title}</p>
                      <span className="badge badge-sm badge-ghost">{mod.content_type}</span>
                    </div>
                  </div>
                  {user && isEnrolled && (
                    <div className="flex gap-2">
                      {!status && (
                        <button
                          onClick={() => handleStart(mod)}
                          className="btn btn-sm btn-primary"
                        >
                          Start Lesson
                        </button>
                      )}
                      {status === 'in_progress' && (
                        <button
                          onClick={() => handleFinish(mod)}
                          className="btn btn-sm btn-warning"
                        >
                          Finish Lesson
                        </button>
                      )}
                      {status === 'completed' && (
                        <button
                          disabled
                          className="btn btn-sm btn-success"
                        >
                          Completed ✓
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {message && (
        <div className={`alert mb-4 ${message.includes('🎉') || message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {user && (
        isEnrolled ? (
          <div className="bg-base-200 rounded-2xl p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">Your Progress</h3>
            <div className="flex items-center gap-4 mb-2">
              <progress 
                className="progress progress-primary w-full" 
                value={course?.modules?.length ? progress.filter(p => p.status === 'completed' && course.modules.some(m => m.id === p.module?.id || m.documentId === p.module?.documentId)).length : 0} 
                max={course?.modules?.length || 1}
              ></progress>
              <span className="font-bold whitespace-nowrap">
                {course?.modules?.length ? Math.round((progress.filter(p => p.status === 'completed' && course.modules.some(m => m.id === p.module?.id || m.documentId === p.module?.documentId)).length / course.modules.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-sm text-base-content/60">
              {progress.filter(p => p.status === 'completed' && course?.modules?.some(m => m.id === p.module?.id || m.documentId === p.module?.documentId)).length} of {course?.modules?.length || 0} lessons completed
            </p>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-lg w-full mt-4"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? <span className="loading loading-spinner loading-sm"></span> : 'Enroll Now'}
          </button>
        )
      )}
    </div>
  )
}

export default CourseDetails
