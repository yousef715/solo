import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default ProtectedRoute

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}
