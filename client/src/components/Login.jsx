import { Link } from 'react-router-dom';
const Login = () => {
    return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-2 ">
      <span className='flex justify-center items-center gap-2'>
        <img src="https://img.icons8.com/?size=100&id=82747&format=png&color=000000" alt="lock" className='w-8 h-8' />

      </span>
      <div className='font- shadow-2xl w-1/4 h-1/4 rounded-xl flex flex-col gap-6 px-16 py-10 justify-between items-center'>
        <div>
          <h1 className='text-xl text-left font-inter'>Sign in</h1>
          <h2>Your messages stay end to end encrypted</h2>
        </div>
        <div className='flex flex-col justify-between items-center gap-8'>
          <div>
            <span className='flex flex-col '>
              <label>E-Mail</label>
              <input type='text' maxLength={15} placeholder='Username' className='rounded-md border-1 border-gray-300 px-6 py-2'></input>
            </span>
            <span className='flex flex-col'>
              <label>Password</label>
              <input type='text' name='password' maxLength={15} placeholder='********' className='rounded-md border-1 border-gray-300 px-6 py-2'></input>  
            </span>
          </div>
        <Link to="/dashboard" className='w-1/2 py-2 text-center border-1 border-black hover:bg-black hover:text-white rounded-xl'> Login </Link>
        </div>
        
        <span>
          <Link to="/register" className='underline'>No Account? Create one</Link>
        </span>
      </div>
    </main>
    )
}

export default Login