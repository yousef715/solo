import { Link } from 'react-router-dom'
export default NotFound
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="text-2xl font-bold mt-4">Page Not Found</p>
        <p className="text-base-content/60 mt-2 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  )
}

