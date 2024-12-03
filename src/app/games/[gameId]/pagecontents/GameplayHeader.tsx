'use client'

import {logout} from "@/scripts/user.ts";
import Button from "@/app/components/button.tsx";
import {endGame} from "@/scripts/gameplay.ts";
import {redirect} from "next/navigation";

export default function GameplayHeader({gameId, isAdmin, username}: {gameId: number, isAdmin: boolean, username: string}) {
    console.log(`${username} is Admin? ${isAdmin}`);

    const handleLogout = () => {
        logout().then(response => console.log('Logged out with response:', response))
    }

    const handleEndGame = () => {
        endGame(gameId).then(response => console.log('Ended game with response:', response))

        redirect('/home')
    }

    return (
        <div className='absolute flex flex-row justify-around items-center top-0 left-0 w-screen p-2 border-b-white border-transparent border-b-white border-2'>
            <p className='text-white text-xl rounded p-1'>Game Id: {gameId}</p>
            <p className='text-white text-xl rounded p-1'>{username}</p>
            <Button text='Log Out' onClick={handleLogout} />
            {isAdmin && <Button onClick={handleEndGame} text='Kill Game' />}
        </div>
    )
}