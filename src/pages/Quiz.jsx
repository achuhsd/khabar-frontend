import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Check, Coins, ClipboardList, ThumbsUp } from 'lucide-react'
 
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
 
const TIME_PER_Q = 30 // seconds
 
// Demo question bank — swap for API data once the backend is wired up.
const QUESTIONS = [
  {
    id: 1,
    prompt: 'Which Indian state recently launched a new EV subsidy policy?',
    based_on: 'Based on article you read',
    options: ['Maharashtra', 'Tamil Nadu', 'Gujarat', 'Karnataka'],
    correct: 0,
  },
  {
    id: 2,
    prompt: "What was RBI's latest repo rate decision?",
    based_on: 'Based on article you read',
    options: ['Cut by 25 bps', 'Held steady', 'Hiked by 50 bps', 'Cut by 50 bps'],
    correct: 1,
  },
  {
    id: 3,
    prompt: 'Which country hosted the latest G20 summit session?',
    based_on: 'Based on article you read',
    options: ['Brazil', 'India', 'South Africa', 'Japan'],
    correct: 2,
  },
  {
    id: 4,
    prompt: 'Which ISRO mission was in the news this week?',
    based_on: 'Based on article you read',
    options: ['Chandrayaan-4', 'Gaganyaan test flight', 'Aditya-L2', 'Mangalyaan-2'],
    correct: 1,
  },
  {
    id: 5,
    prompt: 'Who was appointed as the new Chief Election Commissioner?',
    based_on: 'Based on article you read',
    options: ['Rajiv Kumar', 'Gyanesh Kumar', 'Sushil Chandra', 'OP Rawat'],
    correct: 1,
  },
  {
    id: 6,
    prompt: "Which Indian bill passed in Lok Sabha this week gave government agencies increased access to citizen's digital data?",
    based_on: 'Based on article you read',
    options: [
      'Digital Data Protection Bill',
      'Cyber Security Amendment Act',
      'Personal Data Privacy Bill',
      'Information Technology Act 2025',
    ],
    correct: 0,
  },
  {
    id: 7,
    prompt: 'Which Indian city topped the latest Ease of Living Index?',
    based_on: 'Based on article you read',
    options: ['Pune', 'Bengaluru', 'Ahmedabad', 'Hyderabad'],
    correct: 0,
  },
  {
    id: 8,
    prompt: 'Which ministry released the new National Education Policy update?',
    based_on: 'Based on article you read',
    options: [
      'Ministry of Education',
      'Ministry of Skill Development',
      'Ministry of Home Affairs',
      'NITI Aayog',
    ],
    correct: 0,
  },
  {
    id: 9,
    prompt: 'Which sector received the largest FDI inflow this quarter?',
    based_on: 'Based on article you read',
    options: ['Services', 'Manufacturing', 'Renewable Energy', 'Telecom'],
    correct: 2,
  },
  {
    id: 10,
    prompt: 'Which committee submitted its report on electoral reforms?',
    based_on: 'Based on article you read',
    options: [
      'Law Commission',
      'Ramnath Kovind Committee',
      'Election Commission Panel',
      'Niti Aayog Task Force',
    ],
    correct: 1,
  },
]
 
const RADIUS = 54
const CIRC = 2 * Math.PI * RADIUS
 
function CountdownRing({ secondsLeft, total }) {
  const pct = secondsLeft / total
  const offset = CIRC * (1 - pct)
  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={RADIUS} fill="none" stroke={C.cardDark} strokeWidth={8} />
        <circle
          cx={70}
          cy={70}
          r={RADIUS}
          fill="none"
          stroke={C.coral}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 6px ${C.coral}88)` }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: C.white, lineHeight: 1 }}>{secondsLeft}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>seconds left</div>
      </div>
    </div>
  )
}
 
export default function Quiz() {
  const navigate = useNavigate()
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(TIME_PER_Q)
  const [finished, setFinished] = useState(false)
  const timerRef = useRef(null)
 
  const question = QUESTIONS[qIndex]
  const totalQ = QUESTIONS.length
 
  const goNext = useCallback(() => {
    clearInterval(timerRef.current)
    if (qIndex + 1 >= totalQ) {
      setFinished(true)
      return
    }
    setQIndex((i) => i + 1)
    setSelected(null)
    setSecondsLeft(TIME_PER_Q)
  }, [qIndex, totalQ])
 
  // Countdown timer per question; auto-advances when it hits zero.
  useEffect(() => {
    if (finished) return
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          goNext()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, finished])
 
  function handleSelect(optIndex) {
    if (selected !== null) return
    setSelected(optIndex)
    if (optIndex === question.correct) setCorrectCount((c) => c + 1)
  }
 
  if (finished) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: C.navy,
          color: C.white,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Quiz Complete!</div>
        <div style={{ color: C.muted, marginBottom: 24 }}>
          You scored {correctCount} out of {totalQ}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: C.cardDark,
            border: `1px solid ${C.gold}55`,
            borderRadius: 20,
            padding: '10px 18px',
            color: C.gold,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          <Coins size={18} /> +1 token earned
        </div>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: C.coral,
            border: 'none',
            borderRadius: 14,
            padding: '14px 32px',
            color: C.white,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    )
  }
 
  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.navy,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '16px 16px 24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: C.white, cursor: 'pointer', padding: 4 }}
          aria-label="Close quiz"
        >
          <X size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 18 }}>
          Weekly Quiz <ClipboardList size={20} />
        </div>
        <div style={{ color: C.gold, fontWeight: 700, fontSize: 16 }}>
          {correctCount}/{totalQ}
        </div>
      </div>
 
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 6, margin: '18px 0 8px' }}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: i <= qIndex ? C.coral : C.cardDark,
              boxShadow: i <= qIndex ? `0 0 6px ${C.coral}88` : 'none',
            }}
          />
        ))}
      </div>
      <div style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>
        Question {qIndex + 1} of {totalQ}
      </div>
 
      {/* Timer + token pill */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', marginTop: 8 }}>
        <div
          style={{
            position: 'absolute',
            top: -6,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: C.cardDark,
            border: `1px solid ${C.gold}66`,
            borderRadius: 20,
            padding: '6px 12px',
            color: C.gold,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <Coins size={14} /> +1 token on completion
        </div>
        <CountdownRing secondsLeft={secondsLeft} total={TIME_PER_Q} />
      </div>
 
      {/* Question card */}
      <div
        style={{
          background: C.cardDark,
          border: `1px solid ${C.coral}55`,
          borderRadius: 16,
          padding: 18,
          marginTop: 20,
          boxShadow: `0 0 20px ${C.coral}22`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: C.coral,
            color: C.white,
            fontWeight: 800,
            fontSize: 12,
            padding: '4px 12px',
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          Q{qIndex + 1}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>
          {question.prompt}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.teal, fontSize: 13 }}>
          <ClipboardList size={14} /> {question.based_on}
        </div>
      </div>
 
      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          const letter = String.fromCharCode(65 + i)
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: isSelected ? `${C.coral}22` : C.cardDark,
                border: `1px solid ${isSelected ? C.coral : C.cardDarker}`,
                borderRadius: 14,
                padding: '14px 16px',
                cursor: selected === null ? 'pointer' : 'default',
                boxShadow: isSelected ? `0 0 12px ${C.coral}55` : 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: isSelected ? C.coral : C.cardDarker,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 14,
                  color: C.white,
                  flexShrink: 0,
                }}
              >
                {letter}
              </div>
              <div style={{ flex: 1, textAlign: 'left', fontWeight: 600, fontSize: 15 }}>{opt}</div>
              {isSelected && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: C.coral,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={16} color={C.white} />
                </div>
              )}
            </button>
          )
        })}
      </div>
 
      {/* Next button */}
      <button
        onClick={goNext}
        disabled={selected === null}
        style={{
          marginTop: 24,
          background: selected === null ? C.cardDark : C.coral,
          border: 'none',
          borderRadius: 14,
          padding: '16px',
          color: selected === null ? C.muted : C.white,
          fontWeight: 800,
          fontSize: 16,
          cursor: selected === null ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        Next Question →
      </button>
 
      <div style={{ textAlign: 'center', color: C.muted, fontSize: 13, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {correctCount} correct so far • Keep going! <ThumbsUp size={14} color={C.gold} />
      </div>
    </div>
  )
}
 