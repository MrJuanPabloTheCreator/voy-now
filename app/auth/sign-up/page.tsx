"use client"

import { login } from '@/actions/login';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface NewUser {
    name: string;
    email: string;
    password: string;
    provider: string;
}

export default function SignUp() {
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [newUserForm, setNewUserForm] = useState<NewUser>({
        name: '',
        email: '',
        password: '',
        provider: 'credentials'
    })

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUserForm),
            });

            const data = await response.json();
            if(data.success){
                toast.success('User Created Successfully')
                await login({email: newUserForm.email, password: newUserForm.password});
            } else {
                throw new Error('Error creating user')
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            // setLoading(false);
        }
    };

    const validatePasswords = (event: React.FormEvent) => {
        event.preventDefault();

        if(confirmPassword === newUserForm.password){
            handleSubmit();
        } else {
            toast.error('Incorrect passwords')
        }
    }

    return (
        <div className='flex flex-col space-y-5 items-center bg-zdark p-7 rounded-lg w-[450px]'>
            <header className='flex flex-col items-center space-y-2'>
                <div className='flex items-center'>
                    <h1 className="text-4xl flex font-extrabold text-zdgreen items-center">Party</h1>
                    <p className="text-white/40 text-4xl font-extrabold">-</p>
                    <h1 className="text-4xl flex font-extrabold text-white/40 items-center">Do</h1>
                </div>
                <h1 className='font-semibold text-xl text-white/40'>Welcome!</h1>
            </header>
            <form onSubmit={validatePasswords} className='w-full flex flex-col space-y-4'>
                <label className='flex flex-col'>
                    <h2 className='font-semibold text-white'>Name</h2>
                    <input
                        required
                        type="text"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                        className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none'
                    />
                </label>
                <label className='flex flex-col'>
                    <h2 className='font-semibold text-white'>Email</h2>
                    <input
                        required
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                        className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none'
                    />
                </label>
                <label className='flex flex-col'>
                    <h2 className='font-semibold text-white'>Password</h2>
                    <input
                        required
                        type="password"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                        className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none'
                    />
                </label>
                <label className='flex flex-col'>
                    <h2 className='font-semibold text-white'>Confirm Password</h2>
                    <input
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none'
                    />
                </label>
                <button 
                    type="submit"
                    className='w-full bg-white/10 hover:bg-white/20 py-2 text-zdgreen rounded-md font-semibold'
                >
                    Sign Up
                </button>
            </form>
            <Link 
                href={'/auth/sign-in'} 
                className='text-sm hover:underline text-white/40'
            >
                Already have an account?
            </Link>
        </div>
    );
}
