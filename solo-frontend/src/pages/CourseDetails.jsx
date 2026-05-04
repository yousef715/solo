import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import YouTube from 'react-youtube'
import QuizComponent from '../components/QuizComponent'
import { getCourses, enrollCourse, getProgress, createProgress, updateProgress, getEnrollments, updateUserXP } from '../api'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import PaymentModal from '../components/PaymentModal'

function CourseDetails() {
  const { id } = useParams()
  const { user, setUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [activeModule, setActiveModule] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [canFinishText, setCanFinishText] = useState(false)
  const [allEnrollments, setAllEnrollments] = useState([])
  const [allCourses, setAllCourses] = useState([])

  useEffect(() => {
    if (activeModule && course?.modules) {
      const mod = course.modules.find(m => m.id === activeModule);
      if (mod) {
        setCanFinishText(false);
        const delay = mod.content_type?.toLowerCase() === 'text' ? 10000 : 60000;
        const timer = setTimeout(() => {
          setCanFinishText(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [activeModule, course]);

  useEffect(() => {
    getCourses()
      .then(res => {
        setAllCourses(res.data.data)
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
          setAllEnrollments(res.data.data)
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
      
      // Auto-close the module when finished (unless it's a quiz, so they can see their score)
      if (activeModule === mod.id && mod.content_type?.toLowerCase() !== 'quiz') {
        setActiveModule(null);
      }
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

  const hasInProgressLesson = course?.modules?.some(mod => getModuleStatus(mod) === 'in_progress');

  const completedCoursesCount = allEnrollments.filter(enrollment => {
    const c = allCourses.find(course => course.id === enrollment.course?.id || course.documentId === enrollment.course?.documentId);
    if (!c?.modules || c.modules.length === 0) return false;
    const completedModules = progress.filter(p => 
      p.status === 'completed' && c.modules.some(m => m.id === p.module?.id || m.documentId === p.module?.documentId)
    );
    return completedModules.length === c.modules.length;
  }).length;

  const isEligibleForDiscount = completedCoursesCount >= 2;
  const originalPrice = course?.price ? parseFloat(course.price) : 0;
  const finalPrice = isEligibleForDiscount && originalPrice > 0 ? originalPrice * 0.8 : originalPrice;

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
              const isActive = activeModule === mod.id
              const isFirstLesson = index === 0;
              const prevModStatus = isFirstLesson ? null : getModuleStatus(course.modules[index - 1]);
              const isLocked = !isFirstLesson && prevModStatus !== 'completed';

              return (
                <div key={mod.id} className={`bg-base-200 rounded-xl overflow-hidden shadow-sm ${isLocked ? 'opacity-70' : ''}`}>
                  {/* Module Header / Accordion Toggle */}
                  <div 
                    className={`p-4 flex items-center justify-between transition-colors ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-base-300'}`}
                    onClick={() => {
                      // Only allow opening if enrolled and started
                      if (!isEnrolled || !user) {
                        setMessage("Please enroll in the course to view module content. 🔒")
                      } else if (isLocked && !status) {
                        setMessage("⚠️ You must complete the previous lessons first!")
                      } else if (!status) {
                        if (hasInProgressLesson) {
                          setMessage("⚠️ You must finish your current lesson before starting a new one!")
                        } else {
                          setMessage("You must click 'Start Lesson' to view the content. 🎬")
                        }
                      } else {
                        const isOpening = !isActive;
                        setActiveModule(isOpening ? mod.id : null)
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${status === 'completed' ? 'bg-success text-success-content' : (isLocked ? 'bg-base-300 text-base-content/50' : 'bg-primary text-primary-content')}`}>
                        {status === 'completed' ? '✓' : (isLocked ? '🔒' : index + 1)}
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <p className={`font-medium ${status === 'completed' ? 'line-through text-base-content/50' : 'text-lg'}`}>
                          {mod.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`badge badge-sm ${mod.content_type?.toLowerCase() === 'quiz' ? 'badge-secondary' : 'badge-ghost'}`}>
                            {mod.content_type?.toLowerCase() === 'video' && '🎥 Video'}
                            {mod.content_type?.toLowerCase() === 'text' && '📄 Reading'}
                            {mod.content_type?.toLowerCase() === 'quiz' && '📝 Quiz'}
                            {!mod.content_type && '📄 Lesson'}
                          </span>
                          <span className="text-xs font-bold text-secondary">{mod.xp_reward || 10} XP</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {user && isEnrolled && (
                        <div className="flex gap-2 mr-4" onClick={(e) => e.stopPropagation()}>
                          {!status && (
                            <button
                              onClick={() => {
                                if (isLocked) {
                                  setMessage("⚠️ You must complete the previous lessons first!");
                                  return;
                                }
                                if (hasInProgressLesson) {
                                  setMessage("⚠️ You must finish your current lesson before starting a new one!");
                                  return;
                                }
                                handleStart(mod);
                                setActiveModule(mod.id); // Auto open when starting
                              }}
                              className={`btn btn-sm ${isLocked || hasInProgressLesson ? 'bg-base-300 text-base-content/50 cursor-not-allowed border-none' : 'btn-primary'}`}
                            >
                              {isLocked ? 'Locked 🔒' : (mod.content_type?.toLowerCase() === 'quiz' ? 'Start Quiz' : 'Start Lesson')}
                            </button>
                          )}
                          {status === 'in_progress' && (
                            <button
                              onClick={() => handleFinish(mod)}
                              disabled={!canFinishText}
                              className={`btn btn-sm btn-warning ${!canFinishText ? 'opacity-50 cursor-not-allowed' : ''} ${['video', 'quiz'].includes(mod.content_type?.toLowerCase()) ? 'hidden' : ''}`}
                            >
                              {!canFinishText 
                                ? 'Keep Reading...'
                                : 'Finish Lesson'}
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
                      
                      {isEnrolled && user && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${isActive ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content View */}
                  {isActive && (
                    <div className="p-6 bg-base-100 border-t border-base-300">
                      {mod.content_type?.toLowerCase() === 'quiz' ? (
                        <QuizComponent 
                          quizData={mod.quiz_data} 
                          onPass={() => {
                            if (status === 'in_progress') {
                              handleFinish(mod);
                            }
                          }}
                        />
                      ) : (
                        <>
                          {/* Explicit Video Field */}
                          {mod.video_url && (() => {
                            // Extract clean URL
                            let url = mod.video_url.replace(/\[.*?\]\((.*?)\)/, '$1').replace(/<a.*?href="(.*?)".*?>.*?<\/a>/, '$1').replace(/^['"]|['"]$/g, '').trim();
                            
                            // Extract YouTube ID
                            const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
                            const videoId = ytMatch ? ytMatch[1] : null;

                            return videoId ? (
                              <div className="mb-6 aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-base-300 bg-black">
                                <YouTube 
                                  videoId={videoId} 
                                  opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0 } }}
                                  iframeClassName="w-full h-full"
                                  className="w-full h-full"
                                  onEnd={() => {
                                    if (status === 'in_progress') {
                                      handleFinish(mod);
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="mb-6 alert alert-warning">
                                <span>Unsupported video URL: </span>
                                <a href={url} target="_blank" rel="noreferrer" className="underline font-bold text-primary">{url}</a>
                              </div>
                            );
                          })()}

                          {/* Rich Text Content */}
                          {mod.content ? (
                            <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-primary prose-a:text-primary">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {mod.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            !mod.video_url && (
                              <div className="text-center text-base-content/60 py-4">
                                No content has been added to this module yet.
                              </div>
                            )
                          )}
                        </>
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
        <div className={`alert mb-4 ${
          message.includes('Error') 
            ? 'alert-error' 
            : message.includes('🚀')
              ? 'bg-red-300 text-red-900 border-none'
            : message.includes('🔒') || message.includes('🎬') || message.includes('⚠️')
              ? 'alert-warning'
              : 'alert-success'
        } shadow-sm animate-in fade-in slide-in-from-top-2`}>
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
          <div className="mt-4">
            {isEligibleForDiscount && originalPrice > 0 && (
              <div className="alert alert-success shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>🎉 You unlocked a 20% Loyalty Discount for completing 2+ courses!</span>
              </div>
            )}
            <button
              className="btn btn-primary btn-lg w-full"
              onClick={() => {
                if (finalPrice > 0) {
                  setShowPayment(true)
                } else {
                  handleEnroll()
                }
              }}
              disabled={enrolling}
            >
              {enrolling ? <span className="loading loading-spinner loading-sm"></span> : 
               finalPrice > 0 ? 
                 isEligibleForDiscount ? `Enroll Now - $${finalPrice.toFixed(2)} (was $${originalPrice.toFixed(2)})` : `Enroll Now - $${originalPrice.toFixed(2)}`
                 : 'Enroll Now (Free)'}
            </button>
          </div>
        )
      )}

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        onPaymentSuccess={() => {
          setShowPayment(false);
          handleEnroll();
        }}
        coursePrice={finalPrice.toFixed(2)}
      />
    </div>
  )
}

export default CourseDetails
