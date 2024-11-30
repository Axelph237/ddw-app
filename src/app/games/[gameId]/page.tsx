import Button from "@/app/components/button.tsx";
import GameplayManager from "@/app/games/[gameId]/GameplayManager.tsx";
import {getCurrentGame} from "@/scripts/game.ts";

export default async function GamePage({params}: {
    params: Promise<{ gameId: number }>
}) {

    const gameDetails = await getCurrentGame()

    // TODO create endpoint to get user data within game, and if user is in game

    return (
        <div className='font-[family-name:var(--font-geist-mono)] flex flex-col items-center justify-center'>
            <p className='absolute bg-white text-black rounded p-1 m-2 top-0 left-0'>{(await params).gameId}</p>
            <GameplayManager game={{
                id: gameDetails.id,
                isAdmin: true, // Filler
                inLobby: gameDetails.inLobby
            }}/>
        </div>
    )
}