import Button from "@/app/components/button.tsx";
import GameplayManager from "@/app/games/GameplayManager.tsx";
import {getCurrentGame, getUserStatus} from "@/scripts/game.ts";
import {redirect} from "next/navigation";
import {getMe} from "@/scripts/user.ts";
import GameplayHeader from "@/app/games/pagecontents/GameplayHeader.tsx";

export default async function GamePage() {
    let isAdmin = false;
    let userDetails;
    const game = await getCurrentGame()
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

    console.log('Game data:', game)

    return (
        <div className='font-[family-name:var(--font-geist-mono)] flex flex-col items-center justify-center'>
            <GameplayHeader gameId={game.game_id} isAdmin={isAdmin} username={userDetails.username} />
            <GameplayManager game={{
                id: game.game_id,
                isAdmin: isAdmin,
            }}/>
        </div>
    )
}