import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GenerateKeys from '../encryption/generatekeys.js';
const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        let res = await GenerateKeys(username, password);
        if (res.ok) {
            alert('User registered successfully!');
            window.location.href = '/login';
        } else if (res.status === 409) {
            alert('Username is already taken. Please choose a different username.');
        }
    }

    return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-2 ">
      <span className='flex justify-center items-center gap-2'>
        <img src="https://img.icons8.com/?size=100&id=82747&format=png&color=000000" alt="lock" className='w-8 h-8' />

      </span>
      <div className='font- shadow-2xl w-1/4 h-1/4 rounded-xl flex flex-col gap-6 px-16 py-10 justify-between items-center'>
        <div>
          <h1 className='text-xl text-left font-inter'>Sign up</h1>
        </div>
        <form className='flex flex-col justify-between items-center gap-8'>
          <div>
            <span className='flex flex-col '>
              <label>Username</label>
              <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} maxLength={15} placeholder='Username' className='rounded-md border-1 border-gray-300 px-6 py-2'></input>
            </span>
            <span className='flex flex-col'>
              <label>Password</label>
              <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} maxLength={15} placeholder='********' className='rounded-md border-1 border-gray-300 px-6 py-2'></input>  
            </span>
          </div>
        <button className='w-1/2 py-2 text-center border-1 border-black hover:bg-black hover:text-white rounded-xl' type='submit' onClick={onSubmit}> Register </button>
        </form>
      </div>
    </main>
    )
}

export default Register