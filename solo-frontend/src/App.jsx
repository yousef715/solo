import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Login from './pages/Login'
import Register from './pages/Register'
import CourseDetails from './pages/CourseDetails'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import NotFound from './pages/NotFound'



export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/courses/:id" element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <Leaderboard />
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}