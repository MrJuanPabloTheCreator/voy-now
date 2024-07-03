"use client"

import { useState } from 'react';
import { login } from '@/actions/login';
import { GoogleLogin } from '@/actions/google_login';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import toast from 'react-hot-toast';

type LoginForm = {
    email: string;
    password: string;
}

export default function SignIn() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(loginForm);
  };

  return (
    <div className='flex flex-col space-y-5 items-center bg-zdark p-7 rounded-lg w-[450px]'>
      <header className='flex flex-col items-center space-y-2'>
        {/* <Image width={50} height={50} src='/Asset 6.png' alt='Logo'/> */}
        <div className='flex items-center'>
          <h1 className="text-4xl flex font-extrabold text-zdgreen items-center">Party</h1>
          <p className="text-white/40 text-4xl font-extrabold">-</p>
          <h1 className="text-4xl flex font-extrabold text-white/40 items-center">Do</h1>
        </div>
        <h1 className='font-semibold text-xl text-white/40'>Welcome Back!</h1>
      </header>
      <form onSubmit={handleSubmit} className='w-full flex flex-col space-y-4'>
        <label className='flex flex-col space-y-2'>
          <h2 className='font-semibold text-white'>Email</h2>
          <input
            type="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            required
            className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none'
          />
        </label>
        <label className='flex flex-col space-y-2'>
          <h2 className='font-semibold text-white'>Password</h2>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            required
            className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none'
          />
        </label>
        <button 
          type="submit" 
          className='bg-white/10 hover:bg-white/20 text-zdgreen font-semibold rounded-md py-2'
        >
          Sign In
        </button>
      </form>
      <div className='flex w-full items-center space-x-4'>
        <label className='py-[1px] bg-white/10 w-full rounded-full'/>
        <p className='text-white/20'>or</p>
        <label className='py-[1px] bg-white/10 w-full rounded-full'/>
      </div>
      <button 
        onClick={() => GoogleLogin()} 
        className='w-full flex justify-center bg-white/10 hover:bg-white/20 rounded-lg py-2'
      >
        <FcGoogle className='h-6 w-6'/>
      </button>
      <Link 
        href={'/auth/sign-up'} 
        className='text-sm hover:underline text-white/40'
      >
        Don&apos;t have an account?
      </Link>
    </div>
  );
}
