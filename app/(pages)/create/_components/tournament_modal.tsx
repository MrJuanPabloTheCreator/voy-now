import { X } from 'lucide-react';
import React from 'react'

interface CreateTournamentModalProps {
    setModalOpen: (value: string | null) => void;
}

const CreateTournamentModal = ({setModalOpen}: CreateTournamentModalProps) => {
  return (
    <div className='absolute w-full h-full flex items-center justify-center bg-black/40'>
        <div className='bg-white w-[600px] h-[500px] rounded-md overflow-hidden'>
            <div className="flex justify-center items-center relative w-full bg-blue-950">
                <h1 className="font-semibold text-lg text-white py-3">Create Tournament</h1>
                <button 
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-700" 
                    onClick={() => setModalOpen(null)}
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreateTournamentModal;