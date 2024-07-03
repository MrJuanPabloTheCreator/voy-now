"use client"

import Link from "next/link";
import { useRouter } from "next/navigation"

export default function LandingPage(){
    const router = useRouter();

    return (
        <div className="flex flex-col bg-white">
            <div className="flex justify-between items-center mx-4 mt-2">
                <div className="flex items-center space-x-1">
                    <img src="/Asset 3.svg" className="h-12 w-12"/>
                    <h2 className="text-xl font-bold">Paridinho</h2>
                </div>
                <div className="flex space-x-2">
                    <button 
                        className="bg-light_purple py-2 px-4 text-white text-sm font-semibold rounded-md"
                        onClick={() => router.push('/auth/sign-in')}
                    >
                        Sign In
                    </button>
                    <button 
                        className="bg-light_purple py-2 px-4 text-white text-sm font-semibold rounded-md"
                        onClick={() => router.push('/auth/sign-up')}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full justify-center items-center space-y-5 py-20">
                <h1 className="flex font-bold text-6xl w-[50%] text-center">Find the perfect field, and make it roll!</h1>
                <h2 className="flex font-semibold text-xl">Book a field, connect with players, and joga bonito.</h2>
                <div className="flex space-x-2 w-1/6">
                    <Link
                        className="flex justify-center bg-light_purple py-2 w-1/2 text-white font-semibold rounded-md shadow-lg"
                        href={'/home'}
                    >
                        Home Page
                    </Link>
                    <button 
                        className="flex justify-center bg-green-400 py-2 w-1/2 text-white font-semibold rounded-md shadow-lg"
                    > 
                        Explore
                    </button>
                </div>
                <img src="/Landing.png" className="w-2/3 rounded-lg shadow-xl shadow-t-lg"/>
            </div>
        </div>
    )
}