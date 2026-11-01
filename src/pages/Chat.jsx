import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Bot, Mic, Send, X, Brain, RefreshCw, TrendingUp } from 'lucide-react'
import api from '../lib/api'
import { getStoredUser } from '../lib/user'

const C = {
  navy: '#0A0F2C',
  coral: '#FF6B47',
  teal: '#1ECFAA',
  gold: '#FFD166',
  cardDark: '#161B3A',
  cardDarker: '#1A2040',
  muted: '#A0A8C0',
  white: '#FFFFFF',
}

const QUICK_CHIPS = [
  { label: 'Quiz me', icon: Brain },
  { label: 'Aur explain karo', icon: null },
  { label: 'Impact kya hoga?', icon: null },
]

const BOTTOM_CHIPS = [
  { label: 'Simplify karo', icon: RefreshCw },
  { label: 'Quiz me', icon: Brain },
  { label: "What's trending?", icon: TrendingUp },
]

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: C.teal,
            display: 'inline-block',
            animation: `khabarBounce 1.2s ${i * 0.15}s infinite ease-in-out`,
          }}
        />
      ))}
      <style>{`
        @keyframes khabarBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
const user = getStoredUser()
const firstName = user?.fullName?.split(' ')[0] || 'there'

export default function Chat() {
  const navigate = useNavigate()
  const location = useLocation()

  // Real article passed from Home/CardSwipe/ArticleDetail, or no context at all
  const article = location.state?.article || null

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: article
        ? `Hey ${firstName}!👋\nI'm Khabar Mitra. Ask me anything about "${article.title}"!`
        : `Hey ${firstName}! 👋\nI'm Khabar Mitra. Ask me anything about today's news!`,
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSlowHint, setShowSlowHint] = useState(false)
  const [showContext, setShowContext] = useState(!!article)
  // Countdown for 429 retry-after (seconds remaining, 0 = enabled)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const countdownRef = useRef(null)
  const scrollRef = useRef(null)
  const sendingRef = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  // Clear countdown timer on unmount
  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [])

  function startCountdown(seconds) {
    if (countdownRef.current) clearInterval(countdownRef.current)
    setRetryCountdown(seconds)
    countdownRef.current = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function sendMessage(text, retryMessageId = null) {
    const trimmed = text.trim()
    // Single-request guard: block if already sending OR countdown active
    if (!trimmed || sendingRef.current || retryCountdown > 0) return

    sendingRef.current = true
    const userMsg = retryMessageId
      ? null
      : {
          id: Date.now(),
          sender: 'user',
          text: trimmed,
          time: 'Just now',
        }
    const historyForApi = retryMessageId
      ? messages.filter((m) => m.id !== retryMessageId)
      : [...messages, userMsg]
    if (retryMessageId) {
      setMessages(historyForApi)
    } else {
      setMessages(historyForApi)
      setInput('')
    }
    setIsTyping(true)
    setShowSlowHint(false)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30_000)
    const slowHintTimeoutId = setTimeout(() => setShowSlowHint(true), 5_000)

    try {
      const res = await api.post('/chat', {
        message: trimmed,
        article,
        history: historyForApi.map((m) => ({ sender: m.sender, text: m.text })),
      }, {
        signal: controller.signal,
      })

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: res.data.reply, time: 'Just now' },
      ])
    } catch (err) {
      const status = err.response?.status
      const serverData = err.response?.data
      const timedOut = controller.signal.aborted || err.code === 'ECONNABORTED'
      let errorMessage
      let retryText

      if (timedOut || status === 504) {
        errorMessage = 'Server abhi so raha tha ya busy hai, 30-60 second ruk ke dobara try karo 🙏'
        retryText = trimmed
      } else if (status === 429) {
        const secs = serverData?.retryAfterSeconds
        if (secs && secs > 0) {
          startCountdown(secs)
          errorMessage = serverData.message || `AI abhi busy hai, ${secs} second baad dobara try karo 🙏`
        } else {
          errorMessage = serverData?.message || 'AI par abhi bahut requests hain, 1 minute baad try karo 🙏'
        }
      } else if (!err.response) {
        errorMessage = 'Internet connection check karo, phir dobara try karo 🙏'
      } else {
        errorMessage = 'Abhi reply nahi aa paaya. Thodi der baad dobara try karo 🙏'
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `⚠️ ${errorMessage}`,
          time: 'Just now',
          retryText,
        },
      ])
    } finally {
      clearTimeout(timeoutId)
      clearTimeout(slowHintTimeoutId)
      sendingRef.current = false
      setShowSlowHint(false)
      setIsTyping(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  // True when the UI should block all sends (in-flight OR rate-limited)
  const isDisabled = isTyping || retryCountdown > 0

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.navy,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: `1px solid ${C.coral}`,
          position: 'sticky',
          top: 0,
          background: C.navy,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: C.white, cursor: 'pointer', padding: 4 }}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 18 }}>
          Khabar Mitra <Bot size={20} color={C.teal} />
        </div>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #C08CFF, #7B3FE4)',
            boxShadow: '0 0 8px #7B3FE4',
          }}
        />
      </div>

      {/* Article context card */}
      {showContext && article && (
        <div
          style={{
            margin: '14px 16px 0',
            background: C.cardDark,
            border: `1px solid ${C.teal}55`,
            borderRadius: 14,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              overflow: 'hidden',
              flexShrink: 0,
              background: C.cardDarker,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {article.image ? (
              <img
                src={article.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              '📰'
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: C.muted }}>Talking about:</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {article.title}
            </div>
          </div>
          <button
            onClick={() => setShowContext(false)}
            style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 4 }}
            aria-label="Dismiss article context"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '82%',
                background: m.sender === 'user' ? C.coral : C.cardDark,
                borderLeft: m.sender === 'bot' ? `3px solid ${C.teal}` : 'none',
                borderRadius: 14,
                borderTopRightRadius: m.sender === 'user' ? 4 : 14,
                borderTopLeftRadius: m.sender === 'bot' ? 4 : 14,
                padding: '12px 14px',
                whiteSpace: 'pre-line',
                fontSize: 14.5,
                lineHeight: 1.5,
              }}
            >
              {m.sender === 'bot' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: C.teal, fontWeight: 700, fontSize: 12 }}>
                  KM <Bot size={14} />
                </div>
              )}
              {m.text}
              {m.retryText && !isTyping && (
                <button
                  type="button"
                  onClick={() => sendMessage(m.retryText, m.id)}
                  style={{
                    display: 'block',
                    marginTop: 10,
                    background: 'transparent',
                    border: `1px solid ${C.teal}`,
                    color: C.teal,
                    borderRadius: 18,
                    padding: '6px 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              )}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
              {m.sender === 'user' ? `${firstName} • ${m.time}` : m.time}
            </div>

            {/* Quick reply chips under the latest bot message */}
            {m.sender === 'bot' && m.id === messages[messages.length - 1].id && !isDisabled && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => sendMessage(chip.label)}
                    disabled={isDisabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'transparent',
                      border: `1px solid ${C.teal}`,
                      color: C.teal,
                      borderRadius: 20,
                      padding: '8px 14px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    {chip.label} {chip.icon && <chip.icon size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ alignSelf: 'flex-start', background: C.cardDark, borderLeft: `3px solid ${C.teal}`, borderRadius: 14, borderTopLeftRadius: 4, padding: '12px 14px' }}>
            <TypingDots />
            {showSlowHint && (
              <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
                Server jag raha hai, thoda time lagega...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom suggestion chips */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', overflowX: 'auto' }}>
        {BOTTOM_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => sendMessage(chip.label)}
            disabled={isDisabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              background: 'transparent',
              border: `1px solid ${C.teal}`,
              color: C.teal,
              borderRadius: 20,
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.5 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {chip.label} <chip.icon size={14} />
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px 18px',
          borderTop: `1px solid ${C.cardDark}`,
        }}
      >
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: C.coral, cursor: 'pointer', padding: 6 }}
          aria-label="Voice input"
        >
          <Mic size={22} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={retryCountdown > 0 ? `${retryCountdown}s baad try karo...` : 'Kuch bhi pucho...'}
          disabled={isDisabled}
          style={{
            flex: 1,
            background: C.cardDark,
            border: `1px solid ${C.cardDarker}`,
            borderRadius: 24,
            padding: '12px 16px',
            color: C.white,
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isDisabled}
          style={{
            background: retryCountdown > 0 ? C.cardDarker : C.coral,
            border: 'none',
            borderRadius: '50%',
            width: 42,
            height: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.6 : 1,
            flexShrink: 0,
          }}
          aria-label="Send message"
        >
          {retryCountdown > 0
            ? <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{retryCountdown}</span>
            : <Send size={18} color={C.white} />
          }
        </button>
      </form>
    </div>
  )
}
