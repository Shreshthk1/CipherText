import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GenerateKeys from '../encryption/generatekeys.js';
const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [qrCodeDataURL, setQrCodeDataURL] = useState(null);
    const [is2FASetup, setIs2FASetup] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        let res = await GenerateKeys(username, password);
        if (res.ok) {
            fetch('/api/2fa/setup?username=' + username, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json()).then(data => {
              console.log(data.qrCodeDataURL)
                setQrCodeDataURL(data.qrCodeDataURL);
                setIs2FASetup(true);
            })
              } 
             else if (res.status === 409) {
            alert('Username is already taken. Please choose a different username.');
        }
    }

    return (
<main className="min-h-screen flex flex-col items-center justify-center gap-2">
  <span className='flex justify-center items-center gap-2'>
    <img src="https://img.icons8.com/?size=100&id=82747&format=png&color=000000" alt="lock" className='w-8 h-8' />
  </span>

  <div className='shadow-2xl w-full max-w-sm rounded-xl flex flex-col gap-6 px-10 py-10'>
    <div>
      <h1 className='text-xl text-left font-inter'>Sign up</h1>
    </div>

    <form className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <span className='flex flex-col gap-1'>
          <label>Username</label>
          <input
            type='text'
            name='username'
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
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={15}
            placeholder='********'
            className='rounded-md border border-gray-300 px-6 py-2'
          />
        </span>
      </div>
      <button
        type='submit'
        onClick={onSubmit}
        className='w-full py-2 text-center border border-black hover:bg-black hover:text-white rounded-xl'
      >
        Register
      </button>
    </form>
  </div>
  
    {is2FASetup && (
      <div className="absolute w-full h-full bg-black bg-opacity-50">
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-white text-lg mb-4">Scan this QR code with your authenticator app</h2>  
        <img src={qrCodeDataURL} alt="QR Code" className="mb-4" />
        <Link to="/" className="bg-white text-black px-4 py-2 rounded-lg">Proceed to Login</Link>
      </div>
      </div>
    )}
  
</main>
    )
}

export default Register