// A simple, real reading-time counter. It runs once at the App level (see
// App.jsx) so it keeps counting no matter which screen the user is on, and
// persists to localStorage so it survives page refreshes. It automatically
// resets to zero at the start of a new day.

const SECONDS_KEY = 'khabar_reading_seconds'
const DATE_KEY = 'khabar_reading_date'

// 60-minute daily reading goal, in seconds
export const DAILY_GOAL_SECONDS = 60 * 60

function todayString() {
  return new Date().toDateString()
}

export function getStoredSeconds() {
  const storedDate = localStorage.getItem(DATE_KEY)
  if (storedDate !== todayString()) {
    // A new day has started - reset the counter
    localStorage.setItem(DATE_KEY, todayString())
    localStorage.setItem(SECONDS_KEY, '0')
    return 0
  }
  return parseInt(localStorage.getItem(SECONDS_KEY) || '0', 10)
}

export function incrementSecond() {
  const current = getStoredSeconds()
  const updated = current + 1
  localStorage.setItem(SECONDS_KEY, String(updated))
  return updated
}

// Starts the global ticking timer. Call this exactly once, at the top of
// the app (in App.jsx), not inside individual pages - otherwise multiple
// timers would stack up and count too fast.
export function startGlobalTimer() {
  const intervalId = setInterval(incrementSecond, 1000)
  return () => clearInterval(intervalId)
}
