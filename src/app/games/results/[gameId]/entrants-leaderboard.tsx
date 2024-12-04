import {getEntrantsLeaderboard, getUsersLeaderboard} from "@/scripts/leaderboards.ts";
import {ReactElement} from "react";

export default async function EntrantsLeaderboard({ params }: {params: {gameId: number}}) {
    const gameId = params.gameId

    const response = await getEntrantsLeaderboard(gameId)

    if (response) {

        const entrants = response.result

        const leaderboardElems: ReactElement[] = []
        for (let i = 0; i < entrants.length; i++) {
            let elem: ReactElement

            if (i == entrants.length - 1) {
                elem = <div key={i} className='w-full flex flex-col items-start justify-start p-1 text-left'>
                    <p className='font-bold text-left'>{entrants[i].rank}. {entrants[i].entrant_name}</p>
                    <p className='italic text-left'>With {entrants[i].entrant_weapon}</p>
                    <p className={`italic ${entrants[i].total_wins > 0 ? 'text-emerald-500' : 'text-red-500'}`}>Wins: {entrants[i].total_wins}</p>
                </div>
            } else {
                elem = <div key={i} className='w-full flex flex-col items-start justify-start p-1 text-left'>
                    <p className='font-bold text-left'>{entrants[i].rank}. {entrants[i].entrant_name}</p>
                    <p className='italic text-left'>With {entrants[i].entrant_weapon}</p>
                    <p className={`italic ${entrants[i].total_wins > 0 ? 'text-emerald-500' : 'text-red-500'}`}>Wins: {entrants[i].total_wins}</p>
                    <div className='bg-white h-px w-full mt-2 mb-2'></div>
                </div>
            }

            leaderboardElems.push(elem)
        }

        return (
            <div className='flex flex-col items-center justify-center overflow-hidden'>
                <p className='text-2xl m-4 font-bold'>Entrant leaderboard</p>
                <div className='flex flex-col items-center justify-center border-2 border-white rounded-3xl p-2'>
                    {leaderboardElems}
                </div>
            </div>
        )
    } else {
        return (
            <p>No user leaderboard found...</p>
        )
    }
}