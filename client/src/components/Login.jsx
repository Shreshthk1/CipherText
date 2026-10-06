import { Link } from 'react-router-dom';
import React, { useState } from 'react';
const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpToken, setTotpToken] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      setTotpEnabled(true);

    } else {
      alert("Invalid username or password");
    }
  }

  const verifyToken = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/2fa/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, token: totpToken })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("username", username);
      window.location.href = "/dashboard";
    } else {
      alert("Invalid 2FA token");
    }
  }


  return (
<main className="min-h-screen flex flex-col items-center justify-center gap-2">
  <span className='flex justify-center items-center gap-2'>
    <img src="https://img.icons8.com/?size=100&id=82747&format=png&color=000000" alt="lock" className='w-8 h-8' />
  </span>

  <div className='shadow-2xl w-full max-w-sm rounded-xl flex flex-col gap-6 px-10 py-10'>
    {totpEnabled ? (
      <div className='flex flex-col gap-4'>
        <span className='flex flex-col gap-1'>
          <label>2FA Token</label>
          <input
            type='text'
            value={totpToken}
            onChange={(e) => setTotpToken(e.target.value)}
            placeholder='123456'
            className='rounded-md border border-gray-300 px-6 py-2'
          />
          <button onClick={verifyToken} className='w-full py-2 mt-2 text-center border border-black hover:bg-black hover:text-white rounded-xl'>
            Verify Token
          </button>
        </span>
      </div>
    ) : (  
    <>
      <div>
        <h1 className='text-xl text-left font-inter'>Sign in</h1>
        <h2>Your messages stay end to end encrypted</h2>
      </div>
      <div className='flex flex-col gap-4'>
        <span className='flex flex-col gap-1'>
          <label>Username</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={15}
            placeholder='Username'
            className='rounded-md border border-gray-300 px-6 py-2'
          />
        </span>
        <span className='flex flex-col gap-1'>
          <label>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={15}
            placeholder='********'
            className='rounded-md border border-gray-300 px-6 py-2'
          />
        </span>
        <button
          onClick={handleLogin}
          className='w-full py-2 mt-2 text-center border border-black hover:bg-black hover:text-white rounded-xl'
        >
          Login
        </button>
      </div>
      <span className='text-center'>
        <Link to="/register" className='underline'>No Account? Create one</Link>
      </span>
    </>
  )}
  </div>
</main>
  )
}

export default Login