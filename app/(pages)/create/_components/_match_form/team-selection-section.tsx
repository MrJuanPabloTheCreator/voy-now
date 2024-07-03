import { CircleUserRound, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useMatchForm } from './matchFormContext';
import { FaShirt } from 'react-icons/fa6';

const role_options = [
    'player',
    'admin',
    'captain',
    'coach'
]

const size_options = [
    { value: 5, label: '5 vs 5' },
    { value: 7, label: '7 vs 7' },
    { value: 9, label: '9 vs 9' },
    { value: 11, label: '11 vs 11' },
];

const color_options = [
    { value: '#FF0000', label: 'Red' },
    { value: '#0000FF', label: 'Blue' },
    { value: '#008000', label: 'Green' },
    { value: '#FFFF00', label: 'Yellow' },
    { value: '#FFA500', label: 'Orange' },
    { value: '#800080', label: 'Purple' },
    { value: '#000000', label: 'Black' },
    { value: '#FFFFFF', label: 'White' },
    { value: '#808080', label: 'Gray' },
    { value: '#FFC0CB', label: 'Pink' },
    { value: '#A52A2A', label: 'Brown' },
  ];

interface UserSearch {
    user_id: string;
    name: string;
    image: string;
}

const TeamSelection = () => {
    const [playerSearch, setPlayerSearch] = useState<UserSearch[]>([])
    const { matchForm, setMatchForm } = useMatchForm();
    const { team_1 } = matchForm;
    const { invited_users } = team_1;

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
    
    const handlePlayerSelect = (e: React.MouseEvent<HTMLButtonElement>, player: UserSearch) => {
        e.preventDefault();

        setMatchForm((prevForm) => {
            const isSelected = prevForm.team_1.invited_users.some((user) => user.user_id === player.user_id);
            let newUsers;
            if (isSelected) {
                newUsers =  prevForm.team_1.invited_users.filter((user) => user.user_id !== player.user_id);
            } else {
                newUsers =  [...prevForm.team_1.invited_users, {user_id: player.user_id, name: player.name, image: player.image, role: 'player'}];
            }
            return {...prevForm, team_1: {...team_1, invited_users: newUsers}}
        });
    }

    const handleDeletePlayer = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();

        setMatchForm((prevForm) => {
            return {...prevForm, team_1: {...team_1, invited_users: invited_users.filter((_, i) => i !== index)}}
        });
    }

    return (
        <div className='flex flex-col h-full w-full space-y-6'>
            <div className="flex w-full space-x-4">
                <div className="flex flex-col w-2/6 space-y-1">
                    <h2 className="font-semibold text-white">Players per side?</h2>
                    <select 
                        className="w-full border-2 rounded-md py-1 bg-zdark text-white border-white/10 outline-none"
                        value={matchForm.size}
                        onChange={(e) => setMatchForm({ ...matchForm, size: Number(e.target.value) })}
                    >   
                        {size_options.map((option) => (
                            <option key={option.value} value={option.value} className="text-sm">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <label className='flex flex-col relative space-y-1 w-3/6'>
                    <h2 className='font-semibold text-white'>Add players</h2>
                    <input type='text' className='w-full border-2 rounded-md p-1 outline-none border-white/10 text-white bg-zdark' onChange={handleUserSearch}/>
                    {playerSearch.length > 0 && 
                        <div className='absolute top-16 flex flex-col w-full max-h-64 overflow-y-auto overflow-hidden border-white/10 rounded-md border-x-2 border-t-2'>
                            {playerSearch.map((item, index) => 
                                <button 
                                    key={index} 
                                    className='flex items-center w-full justify-between border-b-2 border-white/10 bg-zdark px-2 py-2 hover:bg-zwteen'
                                    onClick={(e) => handlePlayerSelect(e, item)}
                                >
                                    <div className='flex items-start space-x-1'>{item.image ? (
                                            <Image src={item.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                                        ):( 
                                            <CircleUserRound size={24} className="text-zdgray rounded-full"/>
                                        )}
                                        <p className="text-sm text-white">{item.name}</p>
                                    </div>
                                    <div className={`p-2 border-2 border-white/10 rounded-full ${invited_users.some((m) => m.user_id === item.user_id) ? 'bg-light_green' : ''}`}/>
                                </button>
                            )}
                        </div>
                    }
                </label>
                <div className="flex flex-col w-1/6 space-y-1">
                    <h2 className="font-semibold text-white">Color</h2>
                    <div className='flex items-center space-x-2'>
                        <FaShirt size={28} style={{ color: matchForm.team_1.color || ''}}/>
                        <select 
                            style={{ 
                                backgroundColor: matchForm.team_1.color || '#182525', 
                                color: '#FFFF' 
                            }}
                            className="flex-grow border-2 rounded-md py-1 outline-none bg-zdark border-white/10"
                            value={matchForm.team_1.color || ''}
                            onChange={(e) => setMatchForm({ ...matchForm, team_1: {...team_1, color: e.target.value}})}
                        >   
                            {color_options.map((option, index) => (
                                <option key={index} value={option.value} style={{ backgroundColor: option.value, color: '#000000' }}/>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2'>
                {invited_users.map((user, index) => 
                    <div key={index} className='flex p-2 items-center justify-between bg-zdark'>
                        <span className='flex items-center space-x-1'>
                            {user.image ? (
                                <Image src={user.image} alt="User Image" width={24} height={24} className="rounded-full"/>
                            ):( 
                                <CircleUserRound size={24} className="text-zdgray rounded-full"/>
                            )}
                            <p className="text-sm font-bold text-white">{user.name}</p>
                        </span>
                        <div className='flex items-center space-x-1'> 
                            <select 
                                value={matchForm.team_1.invited_users[index].role || 'player'}
                                onChange={(e) => setMatchForm((prevForm) => {

                                    const updatedPlayers = [...prevForm.team_1.invited_users];
                                    updatedPlayers[index] = {...updatedPlayers[index], role: e.target.value};
                                    return {...prevForm, team_1: {...team_1, invited_users: updatedPlayers}}
                                })}
                                className='rounded-md bg-zdark text-white/40 outline-none'
                            >
                                {index === 0 ? (<option key={index} value={'admin'}>{'admin'}</option>): (
                                    <>
                                        {role_options.map((role, index) => (
                                            <option key={index} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            {index > 0 &&
                                <button 
                                    onClick={(e) => handleDeletePlayer(e, index)}
                                    className='text-zdgray hover:bg-black/20 hover:text-red-600 rounded-full'
                                >
                                    <Trash2 size={18}/>
                                </button>
                            }
                        </div>
                    </div>
                )}
                {Array.from({ length: matchForm.size - invited_users.length }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-1 p-2">
                        <CircleUserRound size={24} className="text-zlgray rounded-full"/>
                        <p className="text-sm text-white/40">Empty Spot</p>
                    </div>
                ))}
            </div>          
        </div>
    )
}

export default TeamSelection