import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Interests from './pages/Interests'
import Home from './pages/Home'
import CardSwipe from './pages/CardSwipe'
import ArticleDetail from './pages/ArticleDetail'
import Chat from './pages/Chat'
import Quiz from './pages/Quiz'
import Profile from './pages/Profile'
import { startGlobalTimer } from './lib/readingTimer'

function App() {
  useEffect(() => {
    const stop = startGlobalTimer()
    return stop
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cardswipe" element={<CardSwipe />} />
        <Route path="/article" element={<ArticleDetail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
