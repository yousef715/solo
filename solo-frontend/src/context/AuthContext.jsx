import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

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
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}