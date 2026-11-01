import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { getStoredUser } from '../lib/user'
import { getStoredSeconds, DAILY_GOAL_SECONDS } from '../lib/readingTimer'

function pickRandom(arr, n) {
  const copy = [...arr]
  const result = []
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

export default function Home() {
  const navigate = useNavigate()
  const storedUser = getStoredUser()
  const displayName = storedUser.fullName?.split(' ')[0] || 'Guest'
  const initials = (storedUser.fullName || 'G')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const [seconds, setSeconds] = useState(getStoredSeconds)
  useEffect(() => {
    const id = setInterval(() => setSeconds(getStoredSeconds()), 1000)
    return () => clearInterval(id)
  }, [])
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const goalReached = seconds >= DAILY_GOAL_SECONDS
  const progressPct = Math.min(100, (seconds / DAILY_GOAL_SECONDS) * 100)

  const [hero, setHero] = useState(null)
  const [moreCards, setMoreCards] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState('')

  const loadNews = useCallback(async () => {
    let categories = ['general']
    try {
      const u = JSON.parse(localStorage.getItem('khabar_user') || '{}')
      if (u.interests?.length) categories = u.interests.map((i) => i.toLowerCase())
    } catch { /* ignore */ }
    setNewsLoading(true)
    setNewsError('')
    try {
      const res = await api.get('/news', { params: { category: categories.join(','), max: 12 } })
      const articles = res.data.articles || []
      if (articles.length > 0) {
        setHero(articles[0])
        setMoreCards(pickRandom(articles.slice(1), 2))
      }
    } catch (err) {
      setNewsError(err.response?.data?.message || 'Could not load news right now')
    } finally {
      setNewsLoading(false)
    }
  }, [])

  useEffect(() => { loadNews() }, [loadNews])

  const goToArticle = (article, focusKey) => {
    navigate('/article', { state: { article, focus: focusKey } })
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F2C',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: '80px'
    }}>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', position: 'sticky', top: 0,
        background: '#0A0F2C', zIndex: 100, borderBottom: '1px solid #161B3A'
      }}>
        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', margin: 0 }}>
          KHABAR <span style={{ color: '#FF6B47' }}>⚡</span>
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '20px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔥</span>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{storedUser.streak ?? 0} days</span>
          </div>
          <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '20px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#FFD166', fontSize: '12px', fontWeight: '700' }}>{storedUser.tokens ?? 0}/6 🪙</span>
          </div>
          <div
            onClick={() => navigate('/profile')}
            title="Profile"
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B47, #1ECFAA)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}>{initials}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 8px' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: 0 }}>
          {greeting}, {displayName} 👋
        </h2>
        <p style={{ color: '#A0A8C0', fontSize: '12px', margin: '4px 0 0' }}>
          Your news. Your city. Your world.
        </p>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ background: '#161B3A', borderRadius: '14px', padding: '12px 16px', border: '1px solid #1A2040' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            {goalReached ? (
              <span style={{ color: '#1ECFAA', fontSize: '13px', fontWeight: '700' }}>🎉 Daily goal complete!</span>
            ) : (
              <>
                <span style={{ color: '#FF6B47', fontSize: '13px', fontWeight: '700' }}>{mins} min {String(secs).padStart(2,'0')} s</span>
                <span style={{ color: '#A0A8C0', fontSize: '13px' }}>/ 60 min</span>
                <span style={{ fontSize: '16px' }}>📖</span>
              </>
            )}
          </div>
          <div style={{ background: '#1A2040', borderRadius: '4px', height: '6px' }}>
            <div style={{ background: goalReached ? '#1ECFAA' : '#FF6B47', borderRadius: '4px', height: '6px', width: `${progressPct}%`, transition: 'width 1s linear' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        {newsLoading ? (
          <div style={{ background: '#161B3A', borderRadius: '16px', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1A2040' }}>
            <p style={{ color: '#A0A8C0', fontSize: '13px' }}>Loading top story...</p>
          </div>
        ) : newsError ? (
          <div style={{ background: '#161B3A', borderRadius: '16px', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #1A2040', padding: '20px' }}>
            <p style={{ color: '#FF6B47', fontSize: '13px', textAlign: 'center' }}>⚠️ {newsError}</p>
            <button onClick={loadNews} style={{ marginTop: '10px', background: '#FF6B47', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Retry</button>
          </div>
        ) : hero ? (
          <div
            onClick={() => goToArticle(hero, null)}
            style={{
              borderRadius: '16px', overflow: 'hidden',
              background: hero.image ? `url(${hero.image}) center/cover no-repeat` : 'linear-gradient(135deg, #1a2040, #0d1235)',
              minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '20px', border: '1px solid #1A2040', position: 'relative', cursor: 'pointer'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,44,0.95) 0%, rgba(10,15,44,0.4) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: '14px', left: '14px', background: '#FF6B47', borderRadius: '20px', padding: '4px 10px', fontSize: '10px', fontWeight: '700', color: '#fff', zIndex: 1 }}>
              📈 TRENDING
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', margin: '0 0 10px', lineHeight: '1.3' }}>{hero.title}</h3>
              <button
                onClick={(e) => { e.stopPropagation(); goToArticle(hero, null) }}
                style={{ background: '#FF6B47', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}
              >
                ✨ Explain Like a Friend
              </button>
              <p style={{ color: '#A0A8C0', fontSize: '11px', margin: '8px 0 0' }}>{hero.source}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ background: '#161B3A', borderRadius: '14px', padding: '14px 16px', border: '1px solid #1A2040' }}>
          <p style={{ color: '#fff', fontSize: '13px', fontWeight: '700', margin: '0 0 12px' }}>Explain Like a Friend ✨</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { icon: '📌', label: 'What\nhappened', focus: 'what' },
              { icon: '🔍', label: 'Why it\nhappened', focus: 'why' },
              { icon: '💡', label: 'What it\nmeans for you', focus: 'means' },
            ].map(({ icon, label, focus }) => (
              <div
                key={focus}
                onClick={() => hero ? goToArticle(hero, focus) : navigate('/cardswipe')}
                style={{ textAlign: 'center', cursor: 'pointer', padding: '6px 8px', borderRadius: '10px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1A2040'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.93)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '18px' }}>{icon}</div>
                <div style={{ color: '#A0A8C0', fontSize: '10px', marginTop: '4px', whiteSpace: 'pre-line' }}>{label}</div>
              </div>
            ))}
            <div
              onClick={() => hero ? navigate('/chat', { state: { article: hero } }) : navigate('/chat')}
              style={{ fontSize: '32px', cursor: 'pointer', padding: '4px', borderRadius: '10px' }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🤖
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '800', margin: 0 }}>More for You</h3>
          <span onClick={() => navigate('/cardswipe')} style={{ color: '#1ECFAA', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>See all →</span>
        </div>
        {newsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ background: '#161B3A', borderRadius: '14px', height: '180px', border: '1px solid #1A2040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#A0A8C0', fontSize: '11px' }}>Loading...</p>
              </div>
            ))}
          </div>
        ) : moreCards.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {moreCards.map((article) => {
              const cardColor = article.categoryColor || '#FF6B47'
              return (
                <div
                  key={article.id || article.url}
                  onClick={() => goToArticle(article, null)}
                  style={{ background: '#161B3A', borderRadius: '14px', overflow: 'hidden', border: '1px solid #1A2040', cursor: 'pointer' }}
                >
                  <div style={{
                    height: '100px',
                    background: article.image ? `url(${article.image}) center/cover no-repeat` : `linear-gradient(135deg, ${cardColor}22, #0d1235)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
                  }}>
                    {!article.image && '📰'}
                  </div>
                  <div style={{ padding: '10px' }}>
                    <p style={{ color: '#fff', fontSize: '11px', fontWeight: '700', margin: '0 0 6px', lineHeight: '1.4' }}>{article.title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: cardColor, fontSize: '9px', fontWeight: '700' }}>{article.category}</span>
                      <span style={{ color: '#A0A8C0', fontSize: '9px' }}>{article.source}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : !newsError ? (
          <p style={{ color: '#A0A8C0', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>No articles found</p>
        ) : null}
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px', background: '#161B3A',
        borderTop: '1px solid #1A2040', display: 'flex', justifyContent: 'space-around',
        alignItems: 'center', padding: '10px 0 16px', zIndex: 100
      }}>
        {[
          { icon: '🏠', label: 'Home', path: '/home', active: true },
          { icon: '🔍', label: 'Explore', path: '/cardswipe' },
          { icon: '🤖', label: 'AI', path: '/chat', special: true },
          { icon: '🏆', label: 'Quiz', path: '/quiz' },
          { icon: '👤', label: 'Profile', path: '/profile' },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer',
              ...(item.special ? { background: '#7c3aed', borderRadius: '50%', width: '48px', height: '48px', justifyContent: 'center', marginTop: '-16px', border: '3px solid #0A0F2C' } : {})
            }}
          >
            <span style={{ fontSize: item.special ? '20px' : '18px' }}>{item.icon}</span>
            {!item.special && (
              <span style={{ fontSize: '10px', color: item.active ? '#FF6B47' : '#A0A8C0', fontWeight: item.active ? '700' : '400' }}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
