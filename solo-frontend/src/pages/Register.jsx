import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await register(username, email, password)
      if (!data.jwt) {
        setSuccess(true)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-base-200 w-full max-w-md shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Register</h2>
          {success ? (
            <div className="alert alert-success shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Registration successful! Please check your email to verify your account before logging in.</span>
              </div>
            </div>
          ) : (
            <>
              {error && <div className="alert alert-error text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered w-full"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Register'}
                </button>
              </form>
            </>
          )}
          <p className="text-center mt-2 text-sm">
            Already have an account? <Link to="/login" className="text-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register