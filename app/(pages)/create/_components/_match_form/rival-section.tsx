import React, { useState } from 'react'
import { useMatchForm } from './matchFormContext';
import Image from 'next/image';
import { CircleUserRound, X } from 'lucide-react';

interface UserSearch {
    user_id: string;
    name: string;
    image: string;
}

const RivalSection = () => {
    const [playerSearch, setPlayerSearch] = useState<UserSearch[]>([])
    const { matchForm, setMatchForm } = useMatchForm();
    const { team_2 } = matchForm;

    const handleUserSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const keyword = e.target.value;
    
        if(keyword.length > 1){
            const getListOfUsers = await fetch(`/api/search_users?key=${keyword}`)
            const usersSearch = await getListOfUsers.json();

            setPlayerSearch(usersSearch)
        } else {
          setPlayerSearch([])
        } 
    }

    const handleTogglePrivateMatch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMatchForm((prevFilter) => ({ ...prevFilter, privateMatch: !matchForm.privateMatch }))
    }

    const handlePlayerSelect = (e: React.MouseEvent<HTMLButtonElement>, player: UserSearch) => {
        e.preventDefault();

        setMatchForm((prevForm) => {
            const isSelected = prevForm.team_2.invited_users.some((user) => user.user_id === player.user_id);
            if(isSelected){
                return {
                    ...prevForm, 
                    team_2: {
                        ...prevForm.team_2, 
                        invited_users: prevForm.team_2.invited_users.filter((user) => user.user_id !== player.user_id) 
                    }
                }
            } else {
                return {
                    ...prevForm, 
                    team_2: {...prevForm.team_2,  
                        invited_users: [...prevForm.team_2.invited_users, {
                            user_id: player.user_id, 
                            name: player.name, 
                            image: player.image, 
                            role: 'admin'
                        }]
                    }
                }
            }
        });
    }

    return (
        <div className='flex w-full space-x-4'>
            <div className='w-1/2'>
                <h2 className='font-semibold text-white'>Rival Admins</h2>
                <input type='text' className='w-full border-2 rounded-md py-1 outline-none bg-zdark border-white/10 text-white' onChange={handleUserSearch}/>
                {playerSearch.length > 0 && 
                    <div className='absolute top-16 flex flex-col w-1/2 max-h-64 overflow-y-auto overflow-hidden rounded-md border-x-2 border-t-2'>
                        {playerSearch.map((item, index) => 
                            <button 
                                key={index} 
                                className='flex items-center w-full justify-between border-b-2 bg-white px-2 py-2 hover:bg-slate-100'
                                onClick={(e) => (handlePlayerSelect(e, item), setPlayerSearch([]))}
                            >
                                <div className='flex items-start space-x-1'>{item.image ? (
                                        <Image src={item.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                                    ):( 
                                        <CircleUserRound size={24} className="text-slate-400 bg-slate-200 rounded-full"/>
                                    )}
                                    <p className="text-sm">{item.name}</p>
                                </div>
                                <div className={`p-2 border-2 rounded-full ${team_2.invited_users.some((user) => user.user_id  === item.user_id) ? 'bg-light_green' : ''}`}/>
                            </button>
                        )}
                    </div>
                }
                {team_2.invited_users.map((user) => user.role === 'admin' ? (<div>{user.name}</div>):(<div></div>))}
            </div>
            <div className='w-1/2 flex flex-col'>
                <div className='flex justify-end space-x-2 items-center'>
                    <h2 className='font-semibold text-white'>Private Game</h2>
                    <button 
                        onClick={handleTogglePrivateMatch}
                        className={`p-1 flex h-fit w-12 rounded-full border-2 border-white/10 transition-colors duration-300 ${matchForm.privateMatch === true ? 'bg-zwteen':''}`}
                    >
                        <span className={`rounded-full p-2 transform transition-transform duration-300 bg-zdgreen ${matchForm.privateMatch === true ? 'translate-x-5':''}`}/>
                    </button>
                </div>
                <div className='flex space-x-4 items-center'>
                    <div className=''>
                        <h2 className='font-semibold text-white'>Field Amount</h2>
                        <input type='text' className='w-full border-2 rounded-md py-1 outline-none bg-zdark border-white/10 text-white'/>
                    </div>
                    <span className='text-white text-xl'>{`=>`}</span>
                    <div className='w-fit flex flex-col'>
                        <h2 className='font-semibold text-white'>Per player</h2>
                        <span className='py-1 px-2 border-2 border-white/10 rounded-md text-white/40'>13.5$</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RivalSection;