import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, getMe } from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('jwt')
    if (token) {
      getMe()
        .then(res => setUser(res.data))
        .catch(err => {
          console.error('Session hydration failed', err)
          localStorage.removeItem('jwt')
        })
        .finally(() => setAuthLoading(false))
    } else {
      setAuthLoading(false)
    }
  }, [])

  async function login(identifier, password) {
    const res = await loginUser({ identifier, password })
    setUser(res.data.user)
    localStorage.setItem('jwt', res.data.jwt)
  }

  async function register(username, email, password) {
    const res = await registerUser({ username, email, password })
    setUser(res.data.user)
    localStorage.setItem('jwt', res.data.jwt)
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('jwt')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, authLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}