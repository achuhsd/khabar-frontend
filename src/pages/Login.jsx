import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Email aur password dono zaroori hain')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('khabar_token', res.data.token)
      localStorage.setItem('khabar_user', JSON.stringify(res.data.user))
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Login fail ho gaya, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F2C',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 24px',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-1px' }}>
          KHABAR <span style={{ color: '#FF6B47' }}>⚡</span>
        </h1>
        <p style={{ color: '#A0A8C0', fontSize: '13px', marginTop: '6px' }}>
          News. Understood. Remembered.
        </p>
        <div style={{ width: '48px', height: '3px', background: '#FF6B47', margin: '8px auto 0', borderRadius: '2px' }} />
      </div>

      {!showEmailForm ? (
        <>
          {/* Hero Card */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '32px',
            height: '220px',
            background: 'linear-gradient(to top, rgba(10,15,44,0.85) 0%, rgba(10,15,44,0.3) 100%), url(/india_gate.jpg.png) center/cover no-repeat',
            display: 'flex',
            alignItems: 'flex-end',
            position: 'relative',
            border: '1px solid #1A2040'
          }}>
            <div style={{ position: 'relative', zIndex: 2, padding: '24px', background: 'linear-gradient(to top, rgba(10,15,44,0.95), transparent)', width: '100%' }}>
              <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', margin: 0, lineHeight: '1.2' }}>
                Stay Informed.<br />Stay Ahead.
              </h2>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Continue with Email */}
            <button
              onClick={() => setShowEmailForm(true)}
              style={{
                width: '100%',
                background: '#161B3A',
                color: '#fff',
                fontWeight: '700',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid #1A2040',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A8C0" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="m2 7 10 7 10-7" />
              </svg>
              Login with Email
            </button>

            {/* Guest */}
            <button
              onClick={() => navigate('/home')}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#A0A8C0',
                fontWeight: '600',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid #1A2040',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A8C0" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              Continue as Guest
            </button>
          </div>

          {/* Terms */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#A0A8C0', marginTop: '16px' }}>
            By continuing you agree to our{' '}
            <span style={{ color: '#1ECFAA' }}>Terms</span>
            {' '}&{' '}
            <span style={{ color: '#1ECFAA' }}>Privacy Policy</span>
          </p>

          {/* Signup */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#A0A8C0', marginTop: '20px' }}>
            New here?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{ color: '#FF6B47', fontWeight: '700', cursor: 'pointer' }}
            >
              Create your account
            </span>
          </p>
        </>
      ) : (
        <>
          {/* Real email + password login form */}
          <button
            onClick={() => { setShowEmailForm(false); setError('') }}
            style={{ background: 'none', border: 'none', color: '#A0A8C0', fontSize: '13px', textAlign: 'left', marginBottom: '16px', cursor: 'pointer', padding: 0 }}
          >
            ← Back
          </button>

          <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>Welcome back</h2>
          <p style={{ color: '#A0A8C0', fontSize: '13px', marginBottom: '24px' }}>Login to your KHABAR account</p>

          {error && (
            <p style={{ color: '#FF6B47', fontSize: '13px', marginBottom: '16px', background: '#161B3A', border: '1px solid #FF6B4740', borderRadius: '12px', padding: '12px' }}>
              ⚠️ {error}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="✉️  Your email address"
              style={{
                background: '#161B3A',
                border: '1px solid #1A2040',
                color: '#fff',
                borderRadius: '14px',
                padding: '16px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔒  Your password"
                style={{
                  width: '100%',
                  background: '#161B3A',
                  border: '1px solid #1A2040',
                  color: '#fff',
                  borderRadius: '14px',
                  padding: '16px',
                  paddingRight: '48px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#A0A8C0', fontSize: '13px' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              background: '#FF6B47',
              color: '#fff',
              fontWeight: '700',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginTop: '20px'
            }}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#A0A8C0', marginTop: '20px' }}>
            New here?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{ color: '#FF6B47', fontWeight: '700', cursor: 'pointer' }}
            >
              Create your account
            </span>
          </p>
        </>
      )}

    </div>
  )
}
