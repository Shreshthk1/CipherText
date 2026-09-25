import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Register from './components/Register.jsx'

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    
  }, [])

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </>
  )
}

export default App
