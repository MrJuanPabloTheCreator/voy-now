"use client"

import { X } from "lucide-react";
import { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import toast from "react-hot-toast";

import ModalStyles from "./modal.module.css";
import { useSession } from "next-auth/react";
import TeamSelection from "./team-selection-section";
import SummarySection from "./summary-section";
import { MatchFormProvider, useMatchForm } from "./matchFormContext";
import GoogleMapTest from "@/app/_components/googleMapTest";
import DateSection from "./date-section";
import RivalSection from "./rival-section";

interface PostMatchModalProps {
    setModalOpen: (value: string | null) => void;
}

const PostMatchModal: React.FC<PostMatchModalProps> = ({setModalOpen}) => {
    const { matchForm, setMatchForm } = useMatchForm();
    const [slideActive, setSlideActive] = useState(1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        try {
            //Form Submission
            const postRequest = await fetch('/api/matches', {
                method: 'POST',
                body: JSON.stringify(matchForm)
            })
            const { success, error} = await postRequest.json();
            if(success){
                toast.success('Match created!')
            } else {
                toast.error(error)
            }     
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setModalOpen(null)
            // setLoading(false)
        }
    };

    return (
        <div className={`${ModalStyles.modal_container}`}>
            <div className="flex flex-col w-[700px] bg-zdark rounded-lg relative overflow-hidden">
                <div className="flex justify-center items-center relative py-3 w-full bg-white/10">
                    <h1 className="font-bold text-lg text-zdgreen">Create Match</h1>
                    <button 
                        className="absolute top-2 right-2 p-1 text-zdark hover:text-red-700 font-bold rounded-full" 
                        onClick={() => setModalOpen(null)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    {slideActive == 1 ? (
                        <div className="space-y-4">
                            <h2 className="font-bold text-white text-xl border-b-2 border-white/10 pb-3">Date</h2>
                            <DateSection/>
                            <div className="flex justify-end pt-2">
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(2)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ): slideActive == 2 ? (
                        <div className="space-y-4">
                            <h2 className="font-bold text-white text-xl border-b-2 border-white/10 pb-3">Location</h2>
                            <GoogleMapTest />
                            <div className="flex justify-between pt-2">
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(1)}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(3)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ): slideActive == 3 ?(
                        <div className="space-y-4">
                            <h2 className="font-bold text-white text-xl border-white/10 border-b-2 pb-3">Your Team</h2>
                            <TeamSelection />
                            <div className="flex justify-between pt-2">
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(2)}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(4)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ): slideActive == 4 ? (
                        <div className="space-y-4">
                            <h2 className="font-bold text-white text-xl border-white/10 border-b-2 pb-3">Additional Info</h2>
                            <RivalSection/>
                            <div className="flex justify-between pt-2">
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(3)}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(5)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ):(
                        <div className="space-y-4">    
                            <h2 className="font-bold text-xl text-white border-white/10 border-b-2 pb-3">Summary</h2>        
                            <SummarySection/>
                            <div className="flex justify-between pt-2">
                                <button 
                                    type="button" 
                                    className="w-fit px-2 py-1 rounded-md  bg-zwteen text-zdgreen hover:bg-white/20"
                                    onClick={() => setSlideActive(4)}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    className="w-fit bg-zdgreen text-zdark rounded-md px-2 font-semibold"
                                    onClick={handleSubmit}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PostMatchModal;