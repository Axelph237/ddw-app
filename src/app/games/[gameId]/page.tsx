import Button from "@/app/components/button.tsx";
import GameplayManager from "@/app/games/[gameId]/GameplayManager.tsx";
import {getCurrentGame, getUserStatus} from "@/scripts/game.ts";
import {redirect} from "next/navigation";

export default async function GamePage({params}: {
    params: Promise<{ gameId: number }>
}) {
    let isAdmin = false;
    const gameDetails = await getCurrentGame()
    const userStatus = await getUserStatus()

    console.log('User status:', userStatus)
    if (userStatus && userStatus.in_lobby) {
        if (userStatus.is_admin) isAdmin = true;

        // Possibly other logic for when user is in lobby
    }
    else { // Take user to join page if not in game
        redirect('/home')
    }

    return (
        <div className='font-[family-name:var(--font-geist-mono)] flex flex-col items-center justify-center'>
            <p className='absolute bg-white text-black rounded p-1 m-2 top-0 left-0'>{(await params).gameId}</p>
            <GameplayManager game={{
                id: gameDetails.id,
                isAdmin: isAdmin,
                inLobby: gameDetails.inLobby
            }}/>
        </div>
    )
}