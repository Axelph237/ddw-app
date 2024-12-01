import Button from "@/app/components/button.tsx";
import GameplayManager from "@/app/games/[gameId]/GameplayManager.tsx";
import {getCurrentGame, getUserStatus} from "@/scripts/game.ts";
import {redirect} from "next/navigation";
import {getMe} from "@/scripts/user.ts";
import GameplayHeader from "@/app/games/[gameId]/pagecontents/GameplayHeader.tsx";

export default async function GamePage({params}: {
    params: Promise<{ gameId: number }>
}) {
    let isAdmin = false;
    let userDetails;
    const gameDetails = await getCurrentGame()
    const userStatus = await getUserStatus()

    if (userStatus && userStatus.in_lobby) {
        if (userStatus.is_admin) isAdmin = true;

        userDetails = await getMe()
        console.log('User details:', userDetails)

        // Possibly other logic for when user is in lobby
    }
    else { // Take user to join page if not in game
        redirect('/home')
    }

    return (
        <div className='font-[family-name:var(--font-geist-mono)] flex flex-col items-center justify-center'>
            <GameplayHeader gameId={gameDetails.id} isAdmin={isAdmin} username={userDetails.username} />
            <GameplayManager game={{
                id: gameDetails.id,
                isAdmin: isAdmin,
                inLobby: gameDetails.inLobby
            }}/>
        </div>
    )
}