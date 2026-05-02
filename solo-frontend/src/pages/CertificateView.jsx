import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { getCourses } from '../api'
import { useAuth } from '../context/AuthContext'
import Certificate from '../components/Certificate'
import Spinner from '../components/Spinner'

function CertificateView() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const certRef = useRef(null)

  useEffect(() => {
    getCourses()
      .then(res => {
        const found = res.data.data.find(c => c.documentId === id)
        setCourse(found)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownload = () => {
    setDownloading(true)
    if (certRef.current) {
      html2canvas(certRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        .then(canvas => {
          const link = document.createElement('a');
          link.download = `${course.title}_Certificate.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          setDownloading(false);
        })
        .catch(err => {
          console.error('Canvas error:', err)
          setDownloading(false)
        });
    }
  }

  if (loading) return <Spinner />
  if (!course) return <div className="p-10 text-center text-xl">Course not found!</div>

  const studentName = user?.username || user?.email || 'Student'
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-10 px-4">
      <div className="mb-8 flex gap-4">
        <Link to="/dashboard" className="btn btn-outline">← Back to Dashboard</Link>
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="btn btn-primary"
        >
          {downloading ? 'Generating Image...' : 'Download as PNG 📥'}
        </button>
        <button 
          onClick={() => window.print()} 
          className="btn btn-secondary"
        >
          Print / Save PDF 🖨️
        </button>
      </div>

      <div className="overflow-auto max-w-full shadow-2xl bg-white rounded-lg">
        {/* We keep Certificate in its exact pixel dimensions to ensure high quality */}
        <div style={{ width: '900px', height: '650px', transformOrigin: 'top left' }} className="sm:scale-100 scale-75 md:scale-100 origin-top-left">
          <Certificate 
            ref={certRef}
            studentName={studentName}
            courseName={course.title}
            date={dateStr}
          />
        </div>
      </div>
      
      <p className="mt-8 text-base-content/60 text-sm max-w-lg text-center">
        Note: If you are on a mobile device and the PNG download does not work, please use the "Print / Save PDF" button to save your certificate directly.
      </p>
    </div>
  )
}

export default CertificateView
