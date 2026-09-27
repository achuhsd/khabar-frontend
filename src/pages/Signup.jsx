import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
      setError('Sab fields zaroori hain bhai!')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Email sahi format mein nahi hai')
      return
    }

    if (form.password.length < 6) {
      setError('Password minimum 6 characters ka hona chahiye')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Password match nahi ho raha')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await axios.post('https://khabar-backend-pwnp.onrender.com/api/auth/register', {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      })

      // Backend real token bhejta hai - isko save karo
      localStorage.setItem('khabar_token', response.data.token)
      localStorage.setItem('khabar_user', JSON.stringify(response.data.user))

      setLoading(false)
      navigate('/interests')
    } catch (err) {
      setLoading(false)
      // Backend se aaya real error message dikhao (jaise "email already exists")
      const backendMessage = err.response?.data?.message
      setError(backendMessage || 'Kuch gadbad ho gayi, dobara try karo')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col px-6 py-8">

      {/* Top bar */}
      <div className="flex items-center justify-center relative mb-8">
        <button onClick={() => navigate('/login')} className="absolute left-0 text-white text-xl">←</button>
        <h2 className="text-white font-bold text-sm">KHABAR ⚡</h2>
      </div>

      {/* Heading */}
      <h1 className="text-white font-black text-3xl mb-1">Create Your Account</h1>
      <p className="text-muted text-sm mb-8">Join thousands of Indians reading smarter.</p>

      {/* Error message */}
      {error && (
        <p className="text-coral text-sm mb-4 bg-card border border-coral/40 rounded-xl px-4 py-3">
          ⚠️ {error}
        </p>
      )}

      {/* Form */}
      <div className="flex flex-col gap-3">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="bg-card border border-card2 text-white rounded-xl px-4 py-4 text-sm outline-none placeholder:text-muted"
          placeholder="👤  Your full name"
        />

        <div>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-card border border-card2 text-white rounded-xl px-4 py-4 text-sm outline-none placeholder:text-muted"
            placeholder="@  Choose a username (e.g. Aditya, StarGazer99)"
          />
          <p className="text-muted text-xs mt-1 px-1">This is how friends will find you — make it yours!</p>
        </div>

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="bg-card border border-card2 text-white rounded-xl px-4 py-4 text-sm outline-none placeholder:text-muted"
          placeholder="✉️  Your email address"
        />

        {/* Password with show/hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-card border border-card2 text-white rounded-xl px-4 py-4 pr-12 text-sm outline-none placeholder:text-muted"
            placeholder="🔒  Create a password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm cursor-pointer"
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Confirm password with show/hide toggle */}
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full bg-card border border-card2 text-white rounded-xl px-4 py-4 pr-12 text-sm outline-none placeholder:text-muted"
            placeholder="🔒  Confirm your password"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm cursor-pointer"
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-coral text-white font-bold py-4 rounded-xl mt-6 text-sm disabled:opacity-60"
      >
        {loading ? 'Please wait...' : 'Create Account →'}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-muted mt-4">
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} className="text-coral font-semibold cursor-pointer">Login</span>
      </p>

    </div>
  )
}