import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captainData, setCaptainData] = useState({})

  const submitHandler = (e) => {
    e.preventDefault();
    setCaptainData({
      email: email,
      password: password,
    })
    setEmail('')
    setPassword('')

  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <img className='w-16 mb-10 ' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
      <div>
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-xl font-medium mb-2'> What's Your E-mail </h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='bg-[#eeeeee] mb-7 rounded px-2 py-4 border w-full text-lg font-medium placeholder:text-base'
            type="email"
            placeholder='email@example.com' />
          <h3 className='font-medium'>Enter Password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='bg-[#eeeeee] mb-7 rounded px-2 py-4 border w-full text-lg font-medium placeholder:text-base'
            type='password'
            placeholder='Password' />
          <button className='bg-[#111] text-white font-semibold mb-7 rounded px-2 py-4 w-full text-lg placeholder:text-base'>
            Login</button>
          <p className=' text-[#3e3e3e] text-center '>Want to join as a fleet? <Link to='/captain-signup' className='text-blue-600 '>Register as a Captain</Link></p>



        </form>
      </div>
      <div>
        <Link
        to='/user-login' className='bg-[#d5754c] text-white flex items-center justify-center cursor-pointer w-full py-3 px-4 mr-2 rounded text-xl font-medium ' > Sign in As User </Link>
      </div>

    </div>
  )
}

export default CaptainLogin
