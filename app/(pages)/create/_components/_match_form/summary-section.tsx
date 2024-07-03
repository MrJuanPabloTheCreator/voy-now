import React from 'react'
import { useMatchForm } from './matchFormContext';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';
import { FaShirt } from "react-icons/fa6";

const SummarySection = () => {
    const { matchForm, setMatchForm } = useMatchForm();
    const { team_1, team_2 } = matchForm;

    return (
        <div className='space-y-4'>
            <div>
                <h3 className="text-white/40 font-semibold">{matchForm.location?.formatted_address}</h3>
                <div className='flex items-center space-x-4'>
                    <div className='flex text-white/40 font-semibold space-x-1'>
                        <span>{matchForm.start_date.toLocaleDateString('default', { day: 'numeric' })}</span>
                        <span>{matchForm.start_date.toLocaleDateString('default', { month: 'long' })}</span>
                        <span>{matchForm.start_date.toLocaleDateString('default', { year: 'numeric' })}</span>
                    </div>
                    <div className='flex text-white/40 font-semibold'>
                        <span>{matchForm.start_date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span> -
                        <span>{matchForm.end_date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
            <div className='flex space-x-0'>
                <div className='flex flex-col w-1/2 items-center'>
                    <div className='flex items-center space-x-2'>
                        <h2 className='font-semibold text-white/40'>Your team</h2>
                        <FaShirt size={22} style={{ color: matchForm.team_1.color || ''}}/>
                    </div> 
                    <div className='w-full grid grid-cols-2'>
                        {team_1.invited_users.map((item, index) => 
                            <div key={index} className='flex items-center space-x-1 py-2'>
                                {item.image ? (
                                    <Image src={item.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                                ):( 
                                    <CircleUserRound size={24} className="text-zlgray rounded-full"/>
                                )}
                                <p className="flex flex-shrink-0 text-sm text-white">{item.name}</p>
                                {item.role === 'admin' && <>A</>}
                            </div>
                        )}
                        {Array.from({ length: matchForm.size - matchForm.team_1.invited_users.length }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-1 py-2">
                                <CircleUserRound size={24} className="text-zlgray rounded-full"/>
                                <p className="text-sm text-white/20">Empty Spot</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col w-1/2 items-center'>
                    <div className='flex items-center space-x-2'>
                        <h2 className='font-semibold text-white/40'>Rivals</h2>
                        <FaShirt size={22} style={{ color: matchForm.team_2.color || ''}}/>
                    </div>
                    <div className='w-full grid grid-cols-2'>
                        {team_2.invited_users.map((item, index) => 
                            <div key={index} className='flex items-center space-x-1 py-2'>
                                {item.image ? (
                                    <Image src={item.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                                ):( 
                                    <CircleUserRound size={24} className="text-zlgray rounded-full"/>
                                )}
                                <p className="text-sm text-white">{item.name}</p>
                                {item.role === 'admin' && <>A</>}
                            </div>
                        )}              
                        {Array.from({ length: matchForm.size - matchForm.team_2.invited_users.length }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-1 py-2">
                                <CircleUserRound size={24} className="text-zlgray rounded-full"/>
                                <p className="text-sm text-white/20">Empty Spot</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-full space-y-1">
                <h2 className="font-semibold text-white">Description (optional)</h2>
                <textarea 
                    className="w-full border-2 rounded-md h-20 bg-zdark border-white/10 text-white outline-none"
                    value={matchForm.text}
                    onChange={(e) => setMatchForm({...matchForm, text: e.target.value})}
                />
            </div>
        </div>
    )
}

export default SummarySection