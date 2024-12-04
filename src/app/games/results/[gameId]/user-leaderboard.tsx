import {getUsersLeaderboard} from "@/scripts/leaderboards.ts";
import {ReactElement} from "react";

export default async function UserLeaderboard({ params }: {params: {gameId: number}}) {
    const gameId = params.gameId

    const response = await getUsersLeaderboard(gameId)

    if (response) {

        const users = response.result

        const leaderboardElems: ReactElement[] = []
        for (let i = 0; i < users.length; i++) {
            let elem: ReactElement

            if (i == users.length - 1) {
                elem = <div key={i} className='w-full flex flex-col items-start justify-start p-1 text-left'>
                    <p className='font-bold text-left'>{users[i].rank}. {users[i].username}</p>
                    <p className={`italic ${users[i].total_earnings < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{users[i].total_earnings}</p>
                </div>
            }
            else {
                elem = <div key={i} className='w-full flex flex-col items-start justify-start p-1 text-left'>
                    <p className='font-bold text-left'>{users[i].rank}. {users[i].username}</p>
                    <p className={`italic ${users[i].total_earnings < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{users[i].total_earnings}</p>
                    <div className='bg-white h-px w-full mt-2 mb-2'></div>
                </div>
            }

            leaderboardElems.push(elem)
        }

        return (
            <div className='flex flex-col items-center justify-center overflow-hidden'>
                <p className='text-2xl m-4 font-bold'>User leaderboard</p>
                <div className='min-w-64 flex flex-col items-center justify-center border-2 border-white rounded-3xl p-2'>
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