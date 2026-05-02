import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { jsPDF } from 'jspdf'
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
  const [scale, setScale] = useState(1)
  const certRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      // 900px is the certificate width, plus 32px for padding
      const availableWidth = window.innerWidth - 32;
      if (availableWidth < 900) {
        setScale(availableWidth / 900);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      toPng(certRef.current, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => {
          download(dataUrl, `${course.title}_Certificate.png`);
          setDownloading(false);
        })
        .catch((err) => {
          console.error('Image capture error:', err);
          setDownloading(false);
        });
    }
  }

  const handleDownloadPDF = () => {
    setDownloading(true)
    if (certRef.current) {
      toPng(certRef.current, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => {
          const pdf = new jsPDF('landscape', 'px', [900, 650]);
          pdf.addImage(dataUrl, 'PNG', 0, 0, 900, 650);
          pdf.save(`${course.title}_Certificate.pdf`);
          setDownloading(false);
        })
        .catch((err) => {
          console.error('Image capture error:', err);
          setDownloading(false);
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
          onClick={handleDownloadPDF} 
          disabled={downloading}
          className="btn btn-secondary"
        >
          {downloading ? 'Generating PDF...' : 'Save as PDF 📄'}
        </button>
      </div>

      <div 
        className="shadow-2xl bg-white rounded-lg overflow-hidden flex-shrink-0"
        style={{ width: `${900 * scale}px`, height: `${650 * scale}px` }}
      >
        {/* We keep Certificate in its exact pixel dimensions to ensure high quality */}
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: '900px', height: '650px' }}>
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
