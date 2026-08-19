import { useState } from 'react'
import { adminLogin } from '../../services/api'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

//   const handleSubmit = async (event) => {
//     event.preventDefault()

//     setLoading(true)
//     setMessage('')

//     try {
//       const data = await adminLogin(email, password)

//       localStorage.setItem('token', data.token)

//       setMessage('Login successful!')
//       console.log('Login response:', data)
//     } catch (error) {
//       setMessage(error.message || 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }
const handleSubmit = async (event) => {
  event.preventDefault()

  setLoading(true)
  setMessage('')

  try {
    const data = await adminLogin(email, password)

    localStorage.setItem('token', data.token)

    setMessage('Login successful!')
    console.log('Login response:', data)

    window.location.reload()
  } catch (error) {
    setMessage(error.message || 'Login failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <section>
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default AdminLogin