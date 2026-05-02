import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCourses } from '../api'

function Home() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data.data.slice(0, 3)))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center bg-base-200">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Empower Your <span className="text-primary">Learning Journey</span>
          </h1>
          <p className="text-lg text-base-content/60 mb-8">
            Learn from expert instructors at your own pace. wherever you are, whatever your goal.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore Courses
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center px-6">
          <div>
            <p className="text-4xl font-bold text-primary">50+</p>
            <p className="text-base-content/60 mt-1">Expert Courses</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">20+</p>
            <p className="text-base-content/60 mt-1">Instructors</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">1000+</p>
            <p className="text-base-content/60 mt-1">Students</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
          <p className="text-base-content/60 mb-8">Hand-picked courses to get you started</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <span className="badge badge-primary badge-sm w-fit">{course.category}</span>
                  <h2 className="card-title mt-1">{course.title}</h2>
                  <p className="text-sm text-base-content/60">By {course.instructorName || 'Unknown'}</p>
                  <div className="card-actions justify-end mt-4">
                    <Link to={`/courses/${course.documentId}`} className="btn btn-primary btn-sm">
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/courses" className="btn btn-outline btn-primary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-base-content/60 mb-12">Start learning in 3 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free and set up your profile in minutes.' },
              { step: '02', title: 'Choose a Course', desc: 'Browse our library and find the perfect course for you.' },
              { step: '03', title: 'Start Learning', desc: 'Learn at your own pace and track your progress.' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-base-content/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-primary text-primary-content text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-8 opacity-80">Join thousands of students already learning on Solo.</p>
          <Link to="/register" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none">
            Join for Free
          </Link>
        </section>
      )}
    </div>
  )
}

export default Home