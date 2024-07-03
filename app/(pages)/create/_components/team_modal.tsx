"use client"

import { CircleUserRound, ImageUp, Trash2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

import { computeSHA256 } from '@/app/utils/SHA256';
import { getSignedURL } from '@/server/actions';

const role_options = [
    'player',
    'admin',
    'captain',
    'coach'
]

interface CreateTeamModalProps {
    setModalOpen: (value: string | null) => void;
}

interface User {
    user_id: string | undefined;
    name: string | undefined | null;
    image: string | undefined | null;
    role: string | null;
}

interface Team {
    name: string;
    selectedPlayers: User[]
    imageURL: string | null;
}

const CreateTeamModal = ({setModalOpen}: CreateTeamModalProps) => {
    const { data: session } = useSession();
    const [activeImageChanger, setActiveImageChanger] = useState<boolean>(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [userSearch, setUserSearch] = useState<User[]>([]);
    const [teamForm, setTeamForm] = useState<Team>({
        name: '',
        selectedPlayers: [
            {
                user_id: session?.user?.id,
                name: session?.user?.name,
                image: session?.user?.image,
                role: 'admin'
            }
        ],
        imageURL: null
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file)

        if(teamForm.imageURL){
            URL.revokeObjectURL(teamForm.imageURL)
        }

        if(file) {
            const url = URL.createObjectURL(file)
            setTeamForm(prevForm => ({...prevForm, imageURL: url}))
        } else {
            setTeamForm(prevForm => ({...prevForm, imageURL: null}))
        }
    };

    const handleTeamNameUniquenes = async () => {
        const isNameUnique = await fetch(`/api/teams/${teamForm.name}`)
        const { success, teamInfo } = await isNameUnique.json();
        if(success){
            return false;
        } else {
            return true;
        }
    }


    const handleUserSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const keyword = e.target.value;
    
        if(keyword.length > 1){
            const getListOfUsers = await fetch(`/api/search_users?key=${keyword}`)
            const usersSearch = await getListOfUsers.json();

            setUserSearch(usersSearch)
        } else {
          setUserSearch([])
        } 
    }
    
    const handlePlayerSelect = (e: React.MouseEvent<HTMLButtonElement>, player: User) => {
        e.preventDefault();

        setTeamForm((prevForm) => {
            const isSelected = prevForm.selectedPlayers.some((selectedPlayer) => selectedPlayer.user_id === player.user_id);
            if (isSelected) {
                return  {...prevForm, selectedPlayers: prevForm.selectedPlayers.filter((selectedPlayer) => selectedPlayer.user_id !== player.user_id)};
            } else {
                return  {...prevForm, selectedPlayers: [...prevForm.selectedPlayers, player]};
            }
        });
    }

    const handleDeletePlayer = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();

        setTeamForm((prevForm) => {
            return {...prevForm, selectedPlayers: prevForm.selectedPlayers.filter((_, i) => i !== index)}
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageURL = null;
        try {
            const isNameUnique = await handleTeamNameUniquenes();
            if(!isNameUnique) throw new Error('Team name is already taken');
            
            if(teamForm.selectedPlayers.length > 0 && teamForm.name.length > 0){
                if(imageFile){
                    const checksum = await computeSHA256(imageFile)
                    const signedUrlResult = await getSignedURL(imageFile.type, imageFile.size, checksum)
    
                    if (signedUrlResult.succes) {
                        const url = signedUrlResult.succes.url
                        const name = signedUrlResult.succes.name
                        imageURL = `https://voy-now-bucket.s3.amazonaws.com/${name}`
                        
                        const s3ImageUpload = await fetch(url, {
                            method: "PUT",
                            body: imageFile,
                            headers: {
                                "Content-Type": imageFile.type,
                            },
                        })

                        if (!s3ImageUpload.ok) {
                            throw new Error('Failed to upload image to S3');
                        }

                    } else {
                        throw new Error('Failed to get signed URL');
                    }
                }

                const newTeamResponse = await fetch('/api/teams',{
                    method: 'POST',
                    body: JSON.stringify({newTeam: teamForm, teamLogoUrl: imageURL})
                })
                const { success, error} = await newTeamResponse.json()
                if(success){
                    toast.success('Team created succesfully!')
                    setModalOpen(null);
                } else {
                    throw new Error(error)
                }
            } else {
                throw new Error('Plese enter team name and at least one member')
            }
        } catch(error: any) {
            toast.error(error.message);
        }
    }
    
    return (
        <div className='absolute w-full h-full flex items-center justify-center bg-black/40'>
            <div className='bg-zdark w-[700px] rounded-md'>
                <div className="flex justify-center items-center relative w-full bg-white/10">
                    <h1 className="font-semibold text-lg text-zdgreen py-3">Create Team</h1>
                    <button 
                        className="absolute top-2 right-2 p-1 text-zdark hover:text-red-700" 
                        onClick={() => setModalOpen(null)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <form className='p-4 space-y-4'>
                    <div className='flex items-center justify-center'>
                        <div className='space-y-4 w-1/2'>
                            <div className='flex flex-col space-y-1'>
                                <h2 className='font-semibold text-white'>Name</h2>
                                <input 
                                    type='text' 
                                    className='p-1 border-2 border-white/10 text-white bg-zdark rounded-md outline-none'
                                    onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                                />
                            </div>
                            <div className='flex flex-col relative space-y-1'>
                                <h2 className='font-semibold text-white'>Select team members</h2>
                                <input type='text' className='border-2 border-white/10 bg-zdark text-white rounded-md p-1 outline-none' onChange={handleUserSearch}/>
                                {userSearch.length > 0 && 
                                    <div className='absolute top-16 flex flex-col w-full max-h-64 overflow-y-auto overflow-hidden border-white/10 rounded-md border-x-2 border-t-2'>
                                        {userSearch.map((item, index) => 
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
                                                <div className={`p-2 border-2 border-white/10 rounded-full ${teamForm.selectedPlayers.some((user) => user.user_id === item.user_id) ? 'bg-zdgreen' : ''}`}/>
                                            </button>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='w-1/2 flex justify-center'>
                            {teamForm.imageURL !== null ? (
                                <div className="h-36 w-48 relative hover:cursor-pointer rounded-md overflow-auto" onMouseEnter={() => setActiveImageChanger(true)} onMouseLeave={() => setActiveImageChanger(false)}>
                                    <Image src={teamForm.imageURL} alt="Post Media" fill className='object-cover'/>
                                    {activeImageChanger && 
                                        <button onClick={() => setTeamForm({...teamForm, imageURL: null})} className='absolute bottom-1 right-1 p-1 text-zdgray hover:bg-black/20 hover:text-red-600 rounded-full'>
                                            <Trash2 size={20}/>
                                        </button>
                                    }
                                </div>
                            ):(
                                <div className='space-y-1'>
                                    <span className='text-white font-semibold'>Team Logo</span>
                                    <label className="flex flex-col space-y-1 hover:cursor-pointer items-center p-4 border-2 border-white/10 rounded-md">
                                        <ImageUp size={36} className="text-zdgray"/>
                                        <input
                                            className="bg-transparent flex-1 border-none outline-none hidden"
                                            name="media"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div> 
                    <div className='grid grid-cols-2'>
                        {teamForm.selectedPlayers.map((user, index) => 
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
                                        value={teamForm.selectedPlayers[index].role || 'player'}
                                        onChange={(e) => setTeamForm((prevForm) => {
                                            const updatedPlayers = [...prevForm.selectedPlayers];
                                            updatedPlayers[index] = {...updatedPlayers[index], role: e.target.value};
                                            return {...prevForm, selectedPlayers: updatedPlayers}
                                        })}
                                        className='rounded-md bg-zdark text-white/40 outline-none'
                                    >
                                        {index === 0 ? (<option key={index} value={'admin'}>{'admin'}</option>): (
                                            <>
                                                {role_options.map((role, i) => (
                                                    <option key={i} value={role}>
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
                    </div> 
                    <div className='flex justify-end'>
                        <button 
                            className='bg-zdgreen rounded-md text-zdark font-semibold py-2 px-3'
                            onClick={handleSubmit}
                        >
                            Create
                        </button> 
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTeamModal;