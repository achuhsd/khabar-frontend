// Reads the real logged-in user's data (saved at login/register/interests
// time). Falls back to an empty object if nothing is stored yet (e.g. a
// guest who skipped login), so callers can safely use `user.streak ?? 0`
// style defaults everywhere.
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('khabar_user') || '{}')
  } catch {
    return {}
  }
}

export function setStoredUser(user) {
  localStorage.setItem('khabar_user', JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem('khabar_user')
  localStorage.removeItem('khabar_token')
}
