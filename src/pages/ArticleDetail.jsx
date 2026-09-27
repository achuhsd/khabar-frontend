import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../lib/api'

export default function ArticleDetail() {
  const navigate = useNavigate()
  const location = useLocation()

  const [article, setArticle] = useState(location.state?.article || null)
  const [loading, setLoading] = useState(!location.state?.article)
  const [error, setError] = useState('')

  useEffect(() => {
    // If someone opens /article directly (e.g. page refresh) with no article
    // passed via navigation state, fetch a fallback top story instead.
    if (article) return

    let cancelled = false
    async function loadFallback() {
      try {
        setLoading(true)
        const res = await api.get('/news', { params: { category: 'general', max: 1 } })
        if (!cancelled) {
          setArticle(res.data.articles?.[0] || null)
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load this article')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadFallback()
    return () => { cancelled = true }
  }, [article])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0F2C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#A0A8C0', fontSize: '13px' }}>Loading article...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0F2C', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <p style={{ color: '#FF6B47', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>⚠️ {error || 'Article not found'}</p>
        <button
          onClick={() => navigate('/home')}
          style={{ background: '#FF6B47', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
        >
          ← Back to Home
        </button>
      </div>
    )
  }

  const timeAgo = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F2C',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: '80px'
    }}>

      {/* Hero Image */}
      <div style={{
        height: '260px',
        background: article.image
          ? `url(${article.image}) center/cover no-repeat`
          : `linear-gradient(135deg, ${article.categoryColor || '#FF6B47'}33, #0d1235)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '80px'
      }}>
        {!article.image && '📰'}

        {/* Top bar over image */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '16px 20px'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(10,15,44,0.6)', border: '1px solid #1A2040', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >←</button>

          <div style={{ background: article.categoryColor || '#FF6B47', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
            {article.category || 'News'}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              style={{ background: 'rgba(10,15,44,0.6)', border: '1px solid #1A2040', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >📤</a>
            <button style={{ background: 'rgba(10,15,44,0.6)', border: '1px solid #1A2040', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔖</button>
          </div>
        </div>

        {/* Source */}
        <div style={{ position: 'absolute', bottom: '12px', left: '20px' }}>
          <span style={{ color: '#A0A8C0', fontSize: '11px' }}>Source: {article.source}{timeAgo ? ` • ${timeAgo}` : ''}</span>
        </div>
      </div>

      {/* Article Body */}
      <div style={{ padding: '20px' }}>

        {/* Headline */}
        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', margin: '0 0 8px', lineHeight: '1.3' }}>
          {article.title}
        </h1>
        <p style={{ color: '#A0A8C0', fontSize: '12px', margin: '0 0 4px' }}>
          By {article.source}
        </p>
        <div style={{ width: '48px', height: '3px', background: article.categoryColor || '#FF6B47', borderRadius: '2px', margin: '10px 0 16px' }} />

        {/* Explain Like a Friend Box */}
        <div style={{
          background: '#161B3A',
          borderRadius: '14px',
          border: '1px solid #1A2040',
          borderLeft: '4px solid #FF6B47',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1A2040' }}>
            <p style={{ color: '#fff', fontSize: '13px', fontWeight: '700', margin: 0 }}>
              Explain Like a Friend ✨
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1A2040', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>📌</span>
            <div>
              <p style={{ color: '#fff', fontSize: '12px', fontWeight: '700', margin: '0 0 4px' }}>What happened:</p>
              <p style={{ color: '#A0A8C0', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                {article.explainLikeFriend?.whatHappened}
              </p>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1A2040', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <div>
              <p style={{ color: '#fff', fontSize: '12px', fontWeight: '700', margin: '0 0 4px' }}>Why it happened:</p>
              <p style={{ color: '#A0A8C0', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                {article.explainLikeFriend?.whyItHappened}
              </p>
            </div>
          </div>

          <div style={{ padding: '12px 16px', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <div>
              <p style={{ color: '#fff', fontSize: '12px', fontWeight: '700', margin: '0 0 4px' }}>What it means for you:</p>
              <p style={{ color: '#A0A8C0', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                {article.explainLikeFriend?.whatItMeans}
              </p>
            </div>
          </div>
        </div>

        {/* Full Article Text */}
        <p style={{ color: '#A0A8C0', fontSize: '13px', lineHeight: '1.8', margin: '0 0 20px' }}>
          {article.content || article.summary}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#1ECFAA', fontSize: '13px',
            fontWeight: '700', textDecoration: 'none',
            display: 'inline-block', marginBottom: '80px'
          }}
        >
          Continue reading on {article.source} ↓
        </a>

      </div>

      {/* Floating Bottom Action Bar */}
      <div style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px',
        padding: '12px 20px 20px',
        background: 'linear-gradient(to top, #0A0F2C, transparent)',
        zIndex: 100
      }}>
        <div style={{
          background: '#161B3A',
          borderRadius: '20px',
          border: '1px solid #1A2040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span style={{ fontSize: '20px' }}>👍</span>
            <span style={{ color: '#A0A8C0', fontSize: '12px' }}>243</span>
          </div>

          <button
            onClick={() => navigate('/chat', { state: { article } })}
            style={{
              background: '#FF6B47', color: '#fff',
              border: 'none', borderRadius: '25px',
              padding: '12px 24px', fontSize: '13px',
              fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(255,107,71,0.4)'
            }}
          >
            🤖 Chat with Khabar Mitra
          </button>

          <div style={{ cursor: 'pointer', fontSize: '20px' }}>📤</div>
        </div>
      </div>

    </div>
  )
}
