import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function CardSwipe() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [saved, setSaved] = useState([])

  useEffect(() => {
    let cancelled = false

    // Use ALL of the user's saved interests (not just the first one), so
    // the pool of stories is much bigger. "general" is always added
    // automatically by the backend too, as an extra baseline.
    let categories = ['general']
    try {
      const storedUser = JSON.parse(localStorage.getItem('khabar_user') || '{}')
      if (storedUser.interests?.length) {
        categories = storedUser.interests.map((i) => i.toLowerCase())
      }
    } catch {
      // ignore parse errors, just use general
    }

    async function loadNews() {
      try {
        setLoading(true)
        const res = await api.get('/news', {
          params: { category: categories.join(','), max: 30 },
        })
        if (!cancelled) {
          setArticles(res.data.articles || [])
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not load news right now')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNews()
    return () => { cancelled = true }
  }, [])

  const article = articles[current]

  const goNext = () => {
    if (current < articles.length - 1) setCurrent(current + 1)
  }

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const toggleSave = () => {
    setSaved(prev =>
      prev.includes(article.id)
        ? prev.filter(i => i !== article.id)
        : [...prev, article.id]
    )
  }

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (!touchStart) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (diff > 50) goNext()
    if (diff < -50) goPrev()
    setTouchStart(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F2C',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #161B3A'
      }}>
        <button
          onClick={() => navigate('/home')}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >←</button>
        <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>For You</span>
        <button style={{ background: 'none', border: 'none', color: '#A0A8C0', fontSize: '18px', cursor: 'pointer' }}>⚙️</button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#A0A8C0', fontSize: '13px' }}>Loading stories...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <p style={{ color: '#FF6B47', fontSize: '13px', textAlign: 'center' }}>⚠️ {error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && articles.length === 0 && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#A0A8C0', fontSize: '13px' }}>No stories found right now.</p>
        </div>
      )}

      {!loading && !error && article && (
        <>
          {/* Progress Bar */}
          <div style={{ padding: '10px 20px 4px' }}>
            <div style={{ background: '#161B3A', borderRadius: '4px', height: '4px' }}>
              <div style={{
                background: '#1ECFAA',
                borderRadius: '4px',
                height: '4px',
                width: `${((current + 1) / articles.length) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ color: '#A0A8C0', fontSize: '11px', textAlign: 'center', margin: '6px 0 0' }}>
              {current + 1} of {articles.length} stories
            </p>
          </div>

          {/* Main Card */}
          <div
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div style={{
              background: '#161B3A',
              borderRadius: '20px',
              overflow: 'hidden',
              width: '100%',
              border: '1px solid #1A2040',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>

              {/* Image Area */}
              <div style={{
                height: '200px',
                background: article.image
                  ? `url(${article.image}) center/cover no-repeat`
                  : `linear-gradient(135deg, ${article.categoryColor}33, #0d1235)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                fontSize: '64px'
              }}>
                {!article.image && '📰'}

                {/* Category pill */}
                <div style={{
                  position: 'absolute', top: '14px', left: '14px',
                  background: article.categoryColor,
                  borderRadius: '20px', padding: '5px 12px',
                  fontSize: '11px', fontWeight: '700', color: '#fff',
                }}>
                  {article.category}
                </div>

                {/* Bookmark */}
                <button
                  onClick={toggleSave}
                  style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: 'rgba(10,15,44,0.6)',
                    border: '1px solid #1A2040',
                    borderRadius: '50%', width: '36px', height: '36px',
                    cursor: 'pointer', fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {saved.includes(article.id) ? '🔖' : '🏷️'}
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '18px' }}>
                <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: '800', margin: '0 0 10px', lineHeight: '1.4' }}>
                  {article.title}
                </h2>
                <div style={{ height: '2px', width: '40px', background: article.categoryColor, borderRadius: '2px', marginBottom: '10px' }} />
                <p style={{ color: '#A0A8C0', fontSize: '13px', lineHeight: '1.6', margin: '0 0 16px' }}>
                  {article.summary}
                </p>
              </div>

              {/* Action Bar */}
              <div style={{
                padding: '12px 18px',
                background: '#0D1228',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #1A2040'
              }}>
                <span style={{ color: '#A0A8C0', fontSize: '11px' }}>
                  {article.source}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate('/article', { state: { article } })}
                    style={{
                      background: '#FF6B47', color: '#fff',
                      border: 'none', borderRadius: '20px',
                      padding: '8px 16px', fontSize: '12px',
                      fontWeight: '700', cursor: 'pointer'
                    }}
                  >
                    Detail →
                  </button>
                  <button
                    onClick={() => navigate('/chat', { state: { article } })}
                    style={{
                      background: 'transparent', color: '#1ECFAA',
                      border: '1px solid #1ECFAA', borderRadius: '20px',
                      padding: '8px 16px', fontSize: '12px',
                      fontWeight: '700', cursor: 'pointer'
                    }}
                  >
                    Ask AI 🤖
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Swipe hint + dots */}
          <div style={{ padding: '8px 20px 16px', textAlign: 'center' }}>
            <p style={{ color: '#A0A8C0', fontSize: '12px', margin: '0 0 10px' }}>
              ← Swipe for next story
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {articles.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === current ? '#FF6B47' : '#1A2040',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={goPrev}
                disabled={current === 0}
                style={{
                  background: current === 0 ? '#1A2040' : '#161B3A',
                  border: '1px solid #1A2040', color: current === 0 ? '#444' : '#fff',
                  borderRadius: '20px', padding: '6px 16px',
                  fontSize: '12px', cursor: current === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Prev
              </button>
              <button
                onClick={goNext}
                disabled={current === articles.length - 1}
                style={{
                  background: current === articles.length - 1 ? '#1A2040' : '#FF6B47',
                  border: 'none', color: current === articles.length - 1 ? '#444' : '#fff',
                  borderRadius: '20px', padding: '6px 16px',
                  fontSize: '12px', cursor: current === articles.length - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav */}
      <div style={{
        background: '#161B3A',
        borderTop: '1px solid #1A2040',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 0 16px'
      }}>
        {[
          { icon: '🏠', label: 'Home', path: '/home' },
          { icon: '🔍', label: 'Explore', path: '/cardswipe', active: true },
          { icon: '🤖', label: 'AI', path: '/chat', special: true },
          { icon: '🏆', label: 'Quiz', path: '/quiz' },
          { icon: '👤', label: 'Profile', path: '/profile' },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px', cursor: 'pointer',
              ...(item.special ? {
                background: '#7c3aed', borderRadius: '50%',
                width: '48px', height: '48px',
                justifyContent: 'center', marginTop: '-16px',
                border: '3px solid #0A0F2C'
              } : {})
            }}
          >
            <span style={{ fontSize: item.special ? '20px' : '18px' }}>{item.icon}</span>
            {!item.special && (
              <span style={{
                fontSize: '10px',
                color: item.active ? '#FF6B47' : '#A0A8C0',
                fontWeight: item.active ? '700' : '400'
              }}>{item.label}</span>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
