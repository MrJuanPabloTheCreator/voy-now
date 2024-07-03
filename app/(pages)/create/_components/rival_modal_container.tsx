"use client"

import { X } from 'lucide-react';
import React, { useState } from 'react'
import DateLocationSlide from './_rival_from/date_location_slide';

interface CreateTournamentModalProps {
    setModalOpen: (value: string | null) => void;
}

const RivalModalContainer = ({setModalOpen}: CreateTournamentModalProps) => {
    const [activeSlide, setActiveSlide] = useState(1)

    return (
        <div className='absolute w-full h-full flex items-center justify-center bg-black/40'>
            <div className='bg-zdark w-[600px] rounded-md overflow-hidden'>
                <div className="flex justify-center items-center relative w-full bg-zwteen">
                    <h1 className="font-semibold text-lg text-white py-3">Rival</h1>
                    <button 
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-700" 
                        onClick={() => setModalOpen(null)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <form className="p-4">
                    {activeSlide === 1 ? (
                        <div className="space-y-4">
                            <h2 className="font-bold text-white text-xl border-b-2 border-white/10 pb-3">Date & Location</h2>
                            <DateLocationSlide/>
                            <div className="flex justify-end pt-2">
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setActiveSlide(2)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ):(
                        <div className="space-y-4">
                            <h2 className="font-bold text-white text-xl border-b-2 border-white/10 pb-3">Rival Team</h2>
                            <></>
                            <div className="flex justify-between pt-2">
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setActiveSlide(1)}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setActiveSlide(3)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default RivalModalContainer;