import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { setStoredUser } from '../lib/user'

const INTERESTS = [
  { emoji: '🏛', label: 'Politics' },
  { emoji: '💰', label: 'Business' },
  { emoji: '🏏', label: 'Sports' },
  { emoji: '💻', label: 'Technology' },
  { emoji: '🎬', label: 'Entertainment' },
  { emoji: '🌍', label: 'World' },
  { emoji: '📚', label: 'Education' },
  { emoji: '🏥', label: 'Health' },
  { emoji: '🚀', label: 'Science' },
  { emoji: '⚖️', label: 'Law' },
  { emoji: '🌾', label: 'Agriculture' },
  { emoji: '🎮', label: 'Gaming' },
]

export default function Interests() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    )
  }

  const handleSubmit = async () => {
    if (selected.length < 3) return

    setError('')
    setLoading(true)

    try {
      // This is the call that was missing before - without it, interests
      // were never actually saved anywhere, so the feed always fell back
      // to general news no matter what you picked here.
      const res = await api.patch('/auth/interests', { interests: selected })
      setStoredUser(res.data.user)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your interests, try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col px-6 py-8">

      {/* Top */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-white font-bold text-sm mb-3">KHABAR ⚡</h2>
        <p className="text-teal text-xs font-semibold mb-2">Almost done!</p>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2 h-2 rounded-full bg-coral" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-white font-black text-3xl mb-1 text-center">What Are You Into?</h1>
      <p className="text-muted text-sm text-center mb-6">Pick your interests — we'll build your perfect news feed.</p>

      {error && (
        <p className="text-coral text-sm text-center mb-4 bg-card border border-coral/40 rounded-xl px-4 py-3">
          ⚠️ {error}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {INTERESTS.map(({ emoji, label }) => {
          const isSelected = selected.includes(label)
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex flex-col items-center justify-center py-4 rounded-xl text-xs font-semibold border transition-all ${
                isSelected
                  ? 'bg-coral border-coral text-white'
                  : 'bg-card border-card2 text-muted'
              }`}
            >
              <span className="text-2xl mb-1">{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>

      {/* Min select note */}
      <p className="text-teal text-xs text-center mb-4">
        {selected.length < 3 ? `Select at least ${3 - selected.length} more to continue` : 'Great choices! 🎉'}
      </p>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={selected.length < 3 || loading}
        className={`w-full font-bold py-4 rounded-xl text-sm transition-all ${
          selected.length >= 3 && !loading
            ? 'bg-coral text-white'
            : 'bg-card2 text-muted cursor-not-allowed'
        }`}
      >
        {loading ? 'Saving...' : 'Build My Feed →'}
      </button>

      <p className="text-muted text-xs text-center mt-3">You can always change this later in Settings</p>

    </div>
  )
}
