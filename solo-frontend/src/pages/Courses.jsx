import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../api'
import Spinner from '../components/Spinner'

const categories = ['All', 'Software Engineering', 'Frontend', 'Backend', 'Design']

function Courses() {
  const [courses, setCourses] = useState([])
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c => {
    const matchCategory = selected === 'All' || c.category === selected
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  if (loading) return <Spinner />

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          className="input input-bordered w-full md:max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`btn btn-sm ${selected === cat ? 'btn-primary' : 'btn-ghost'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-base-content/60">
          <p className="text-xl">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <div key={course.id} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="card-body">
                <span className="badge badge-primary badge-sm w-fit">{course.category}</span>
                <h2 className="card-title mt-1">{course.title}</h2>
                <p className="text-sm text-base-content/60">By {course.instructorName || 'Unknown'}</p>
                <div className="card-actions justify-between items-center mt-4">
                  <Link to={`/courses/${course.documentId}`} className="btn btn-primary btn-sm">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Courses