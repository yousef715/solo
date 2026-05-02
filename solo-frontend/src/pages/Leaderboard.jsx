import { useState, useEffect } from 'react'
import { getLeaderboard } from '../api'
import Spinner from '../components/Spinner'

function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getLeaderboard()
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error(err)
        const backendError = err.response?.data?.error?.message || err.message
        setError(`Error: ${backendError}. (Did you save "find" permission in Strapi?)`)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard 🏆</h1>
        <p className="text-base-content/60">Top students with the most XP points</p>
      </div>

      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="bg-base-200 rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>XP Points</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u.id} className={index < 3 ? 'bg-base-100 font-bold' : ''}>
                    <td>
                      {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `${index + 1}th`}
                    </td>
                    <td>{u.username}</td>
                    <td className="text-primary font-bold">{u.xp || 0} XP</td>
                    <td>
                      {u.xp >= 100 ? (
                        <span className="badge badge-success whitespace-nowrap py-3 px-4 font-bold">Master 🎓</span>
                      ) : u.xp >= 50 ? (
                        <span className="badge badge-warning whitespace-nowrap py-3 px-4 font-bold">Pro 🚀</span>
                      ) : (
                        <span className="badge badge-ghost whitespace-nowrap py-3 px-4 font-bold">Beginner 🌱</span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-base-content/60">
                      No students found yet. Be the first to earn points!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
