import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser, clearStoredUser } from '../lib/user'

const LANGUAGES = ['English', 'Hindi', 'Hinglish']

// If you'd like feedback to go somewhere else, change this number.
const FEEDBACK_WHATSAPP_NUMBER = '919324460120'

export default function Profile() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const streak = user.streak ?? 0
  const tokens = user.tokens ?? 0
  const articlesRead = user.totalArticlesRead ?? 0
  const quizAvg = user.quizAvg ?? 0
  const displayName = user.fullName || 'Guest'
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—'
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState(localStorage.getItem('khabar_language') || 'English')
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(
    localStorage.getItem('khabar_notifications') === 'on'
  )
  const [shareCopied, setShareCopied] = useState(false)

  // Achievements are now computed from REAL progress, not pre-unlocked.
  // A brand-new account will correctly show every achievement as locked.
  const ACHIEVEMENTS = [
    { icon: '🔥', label: '7 Day Streak', color: '#FF6B47', locked: streak < 7 },
    { icon: '📚', label: '50 Articles Read', color: '#1ECFAA', locked: articlesRead < 50 },
    { icon: '🧠', label: 'First Quiz Cleared', color: '#FFD166', locked: quizAvg <= 0 },
    { icon: '🌟', label: 'Top Reader', color: '#1A2040', locked: true }, // needs a leaderboard feature, not built yet
  ]

  // Streak calendar is an approximation until real day-by-day activity
  // logging is built - it lights up the last `streak` days ending today,
  // rather than always showing a fixed hardcoded week.
  const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayIndex = (new Date().getDay() + 6) % 7 // convert Sun=0 to Mon=0 indexing
  const STREAK_DAYS = DAY_LETTERS.map((day, i) => {
    const daysAgo = (todayIndex - i + 7) % 7
    return {
      day,
      today: i === todayIndex,
      done: i !== todayIndex && daysAgo < streak,
    }
  })

  const handleLogout = () => {
    // Clears BOTH the token and the user data - previously only the token
    // was cleared, which is why a different account's login could still
    // show leftover info from whoever was logged in before.
    clearStoredUser()
    navigate('/login')
  }

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
    localStorage.setItem('khabar_language', lang)
    setShowLanguagePicker(false)
  }

  const handleNotificationsToggle = async () => {
    if (notificationsOn) {
      setNotificationsOn(false)
      localStorage.setItem('khabar_notifications', 'off')
      return
    }

    if (!('Notification' in window)) {
      alert('Your browser does not support notifications.')
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      setNotificationsOn(true)
      localStorage.setItem('khabar_notifications', 'on')
      new Notification('KHABAR', {
        body: "Notifications are on! We'll remind you to read daily. 🔥",
      })
    } else {
      alert('Notifications were blocked. You can enable them in your browser settings.')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'KHABAR — News. Understood. Remembered.',
      text: 'Check out KHABAR, an Indian news app that explains news simply and helps you build a daily reading habit!',
      url: window.location.origin,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user cancelled the share sheet
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } else {
      alert('Sharing is not supported on this browser.')
    }
  }

  const handleHelpFeedback = () => {
    window.open(`https://wa.me/${FEEDBACK_WHATSAPP_NUMBER}`, '_blank')
  }

  const SETTINGS_ITEMS = [
    {
      icon: '🔔',
      label: 'Notifications',
      type: 'toggle',
      value: notificationsOn,
      onToggle: handleNotificationsToggle,
    },
    {
      icon: '🌐',
      label: 'Language',
      type: 'link',
      value: language,
      onClick: () => setShowLanguagePicker(true),
    },
    {
      icon: '🎨',
      label: 'Appearance',
      type: 'toggle',
      value: darkMode,
      onToggle: () => setDarkMode(!darkMode),
    },
    {
      icon: '📤',
      label: 'Share App',
      type: 'link',
      value: shareCopied ? 'Copied!' : '',
      onClick: handleShare,
    },
    {
      icon: '❓',
      label: 'Help & Feedback',
      type: 'link',
      onClick: handleHelpFeedback,
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F2C',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: '100px'
    }}>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #161B3A',
        position: 'relative'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: 20, background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >←</button>
        <h2 style={{ color: '#fff', fontWeight: '800', fontSize: '16px', margin: 0 }}>Profile</h2>
      </div>

      {/* Avatar + Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px 20px' }}>
        <div style={{
          width: '92px',
          height: '92px',
          borderRadius: '50%',
          padding: '3px',
          background: 'linear-gradient(135deg, #FF6B47, #1ECFAA)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: '#0A0F2C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#FF6B47', fontSize: '28px', fontWeight: '900' }}>{initials || '👤'}</span>
          </div>
        </div>

        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: '0 0 4px' }}>{displayName}</h1>
        <p style={{ color: '#A0A8C0', fontSize: '12px', margin: '0 0 10px' }}>Member since {memberSince}</p>

        <div style={{
          background: '#161B3A',
          border: '1px solid #1ECFAA55',
          borderRadius: '20px',
          padding: '5px 14px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#1ECFAA'
        }}>
          {streak > 0 ? '🏅 Active Reader' : '🌱 New Reader'}
        </div>
      </div>

      {/* Stats Row - real numbers, zero for a fresh account */}
      <div style={{ padding: '0 20px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '14px', padding: '14px 8px', textAlign: 'center' }}>
          <p style={{ color: '#FFD166', fontSize: '20px', fontWeight: '900', margin: '0 0 4px' }}>{articlesRead}</p>
          <p style={{ color: '#A0A8C0', fontSize: '10px', margin: 0 }}>Articles Read</p>
        </div>
        <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '14px', padding: '14px 8px', textAlign: 'center' }}>
          <p style={{ color: '#FF6B47', fontSize: '20px', fontWeight: '900', margin: '0 0 4px' }}>{streak}</p>
          <p style={{ color: '#A0A8C0', fontSize: '10px', margin: 0 }}>Day Streak 🔥</p>
        </div>
        <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '14px', padding: '14px 8px', textAlign: 'center' }}>
          <p style={{ color: '#1ECFAA', fontSize: '20px', fontWeight: '900', margin: '0 0 4px' }}>{quizAvg}%</p>
          <p style={{ color: '#A0A8C0', fontSize: '10px', margin: 0 }}>Quiz Avg</p>
        </div>
      </div>

      {/* Token Progress - real value */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>This Week's Tokens</span>
            <span style={{ color: '#FFD166', fontSize: '14px', fontWeight: '800' }}>{tokens}/6 🪙</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                flex: 1,
                height: '8px',
                borderRadius: '4px',
                background: i < tokens ? '#FFD166' : '#1A2040'
              }} />
            ))}
          </div>
          <p style={{ color: '#1ECFAA', fontSize: '11px', margin: 0 }}>
            {tokens >= 6 ? 'Sunday Quiz unlocked! 🎯' : `Collect ${6 - tokens} more token${6 - tokens === 1 ? '' : 's'} to unlock Sunday Quiz 🎯`}
          </p>
        </div>
      </div>

      {/* Streak Calendar */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '14px', padding: '16px' }}>
          <p style={{ color: '#fff', fontSize: '13px', fontWeight: '700', margin: '0 0 12px' }}>🔥 Streak — {streak} Day{streak === 1 ? '' : 's'}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {STREAK_DAYS.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: d.done ? '#fff' : '#A0A8C0',
                  background: d.done ? '#FF6B47' : 'transparent',
                  border: d.today ? '2px solid #FF6B47' : d.done ? 'none' : '1px solid #1A2040'
                }}>
                  {d.done ? '✓' : ''}
                </div>
                <span style={{ color: '#A0A8C0', fontSize: '10px' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements - locked/unlocked based on real progress */}
      <div style={{ padding: '0 20px 16px' }}>
        <p style={{ color: '#fff', fontSize: '15px', fontWeight: '800', margin: '0 0 12px' }}>Achievements 🏆</p>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {ACHIEVEMENTS.map((a) => (
            <div key={a.label} style={{
              minWidth: '100px',
              background: a.locked ? '#161B3A' : a.color,
              border: a.locked ? '1px solid #1A2040' : 'none',
              borderRadius: '14px',
              padding: '14px 10px',
              textAlign: 'center',
              opacity: a.locked ? 0.6 : 1,
              flexShrink: 0
            }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{a.locked ? '🔒' : a.icon}</div>
              <p style={{ color: a.locked ? '#A0A8C0' : '#fff', fontSize: '10px', fontWeight: '700', margin: 0 }}>{a.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings List */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ background: '#161B3A', border: '1px solid #1A2040', borderRadius: '14px', overflow: 'hidden' }}>
          {SETTINGS_ITEMS.map((item, i) => (
            <div
              key={item.label}
              onClick={item.type === 'link' ? item.onClick : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: i < SETTINGS_ITEMS.length - 1 ? '1px solid #1A2040' : 'none',
                cursor: item.type === 'link' ? 'pointer' : 'default'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{item.label}</span>
              </div>

              {item.type === 'toggle' ? (
                <div
                  onClick={item.onToggle}
                  style={{
                    width: '38px',
                    height: '22px',
                    borderRadius: '11px',
                    background: item.value ? '#1ECFAA' : '#1A2040',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                    cursor: 'pointer',
                    justifyContent: item.value ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.value && <span style={{ color: '#1ECFAA', fontSize: '12px', fontWeight: '600' }}>{item.value}</span>}
                  <span style={{ color: '#A0A8C0', fontSize: '12px' }}>›</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '0 20px 16px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid #FF6B4755',
            color: '#FF6B47',
            fontWeight: '700',
            fontSize: '13px',
            padding: '14px',
            borderRadius: '14px',
            cursor: 'pointer'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Language picker modal */}
      {showLanguagePicker && (
        <div
          onClick={() => setShowLanguagePicker(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161B3A', border: '1px solid #1A2040',
              borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '340px'
            }}
          >
            <p style={{ color: '#fff', fontSize: '15px', fontWeight: '800', margin: '0 0 16px' }}>Choose Language</p>
            {LANGUAGES.map((lang) => (
              <div
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: '10px', marginBottom: '8px',
                  background: language === lang ? '#FF6B4722' : 'transparent',
                  border: language === lang ? '1px solid #FF6B47' : '1px solid #1A2040',
                  cursor: 'pointer'
                }}
              >
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{lang}</span>
                {language === lang && <span style={{ color: '#FF6B47' }}>✓</span>}
              </div>
            ))}
            <p style={{ color: '#A0A8C0', fontSize: '11px', margin: '8px 0 0' }}>
              Saved. Full app translation is coming in a future update.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        background: '#161B3A',
        borderTop: '1px solid #1A2040',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 0 16px',
        zIndex: 100
      }}>
        {[
          { icon: '🏠', label: 'Home', path: '/home' },
          { icon: '🔍', label: 'Explore', path: '/cardswipe' },
          { icon: '🤖', label: 'AI', path: '/chat', special: true },
          { icon: '🏆', label: 'Quiz', path: '/quiz' },
          { icon: '👤', label: 'Profile', path: '/profile', active: true },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              ...(item.special ? {
                background: '#7c3aed',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                justifyContent: 'center',
                marginTop: '-16px',
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
              }}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
