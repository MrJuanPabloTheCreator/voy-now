"use client"

import { useState } from "react"

import CreatePostModal from "./_components/post_form"
import PostMatchModal from "./_components/_match_form/match_form"
import { MatchFormProvider } from "./_components/_match_form/matchFormContext"
import CreateTeamModal from "./_components/team_modal"
import CreateTournamentModal from "./_components/tournament_modal"
import RivalModalContainer from "./_components/rival_modal_container"
import { RivalFormProvider } from "./_components/_rival_from/rivalFormContext"
import Image from "next/image"

const CreatePage = () => {
  const [modalOpen, setModalOpen] = useState<string | null>(null)

  return (
    <div className="flex justify-center items-center w-full h-full relative">
      {/* <FacilityForm/> */}
      <div className="grid grid-cols-3 w-[90%] gap-2">
        <button 
          className="flex flex-col h-56 p-4 relative border-2 border-white/10 navbar rounded-lg overflow-hidden hover:bg-zdgreen/5 transition-colors duration-500"
          onClick={() => setModalOpen('Match')}
        >
          <h2 className="text-zdgreen font-semibold text-2xl relative">
            Create Match
            <span className="absolute left-0 bottom-0 p-[2px] rounded-lg navbar-border"/>
          </h2>
          <h3 className="text-white/40 text-md font-semibold">Enter Date and Location and lets play</h3>
          <Image src={'/file3.png'} width={220} height={220} className="object-cover absolute top-[25px] right-[-15px]" alt="play image"/>
        </button>
        <button 
          className="flex flex-col h-56 p-4 relative border-2 border-white/10 navbar rounded-lg overflow-hidden hover:bg-zdgreen/5 transition-colors duration-500"
          onClick={() => setModalOpen('Post')}
        >
          <h2 className="text-zdgreen font-semibold text-2xl relative">
            Create post
            <span className="absolute left-0 bottom-0 p-[2px] rounded-lg navbar-border"/>
          </h2>
          <h3 className="text-white/40 text-md font-semibold">Share your best pics!</h3>
          <Image src={'/file2.png'} width={300} height={300} className="object-cover absolute top-[10px] right-[-60px]" alt="play image"/>
        </button>
        <button 
          className="flex flex-col h-56 p-4 relative border-2 border-white/10 navbar rounded-lg overflow-hidden hover:bg-zdgreen/5 transition-colors duration-500"
          onClick={() => setModalOpen('Team')}
        >
          <h2 className="text-zdgreen font-semibold text-2xl relative">
            Create Team
            <span className="absolute left-0 bottom-0 p-[2px] rounded-lg navbar-border"/>
          </h2>
          <h3 className="text-white/40 text-md font-semibold">and invite whoever you want</h3>
          <Image src={'/file5.png'} width={220} height={220} className="object-cover absolute top-[35px] right-[-20px]" alt="play image"/>
        </button>
        <button 
          className="flex flex-col h-56 p-4 relative border-2 border-white/10 navbar rounded-lg overflow-hidden hover:bg-zdgreen/5 transition-colors duration-500"
          onClick={() => setModalOpen('Tournament')}
        >
          <h2 className="text-zdgreen font-semibold text-2xl relative">
            Create Tournament
            <span className="absolute left-0 bottom-0 p-[2px] rounded-lg navbar-border"/>
          </h2>
          <h3 className="text-white/40 text-md font-semibold">Publish your tournament</h3>
          <Image src={'/file6.png'} width={230} height={230} className="object-cover absolute top-[30px] right-[-35px]" alt="play image"/>
        </button>
        <button 
          className="flex flex-col h-56 p-4 relative border-2 border-white/10 navbar rounded-lg overflow-hidden hover:bg-zdgreen/10 transition-colors duration-500"
          onClick={() => setModalOpen('Rival')}
        >
          <h2 className="text-zdgreen font-semibold text-2xl relative">
            Need Rival
            <span className="absolute left-0 bottom-0 p-[2px] rounded-lg navbar-border"/>
          </h2>
          <h3 className="text-white/40 text-md font-semibold">Let us help you find a challenge</h3>
          <Image src={'/file.png'} width={220} height={220} className="object-cover absolute top-[25px] right-0" alt="play image"/>
        </button>
        <button 
          className="flex flex-col h-56 p-4 relative border-2 border-white/10 navbar rounded-lg overflow-hidden hover:bg-zdgreen/10 transition-colors duration-500"
          onClick={() => setModalOpen('Rival')}
        >
          <h2 className="text-zdgreen font-semibold text-2xl relative">
            Look for a team
            <span className="absolute left-0 bottom-0 p-[2px] rounded-lg navbar-border"/>
          </h2>
          <h3 className="text-white/40 text-md font-semibold">Let us help you find a team</h3>
          <Image src={'/file 4.png'} width={220} height={220} className="object-cover absolute top-[25px] right-0" alt="play image"/>
        </button>
      </div>
      {modalOpen === 'Post' ?(
        <CreatePostModal setModalOpen={setModalOpen}/>
      ): modalOpen === 'Match' ? (
          <MatchFormProvider>
            <PostMatchModal setModalOpen={setModalOpen}/>
         </MatchFormProvider>
      ): modalOpen === 'Team' ? (
        <CreateTeamModal setModalOpen={setModalOpen}/>
      ): modalOpen === 'Tournament' ? (
        <CreateTournamentModal setModalOpen={setModalOpen}/>
      ): modalOpen === 'Rival' ? (
        <RivalFormProvider>
          <RivalModalContainer setModalOpen={setModalOpen}/>
        </RivalFormProvider>
      ):(
        <></>
      )}
    </div>
  )
}
  
export default CreatePage;