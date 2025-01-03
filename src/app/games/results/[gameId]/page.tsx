import UserLeaderboard from "@/app/games/results/[gameId]/user-leaderboard.tsx";
import EntrantsLeaderboard from "@/app/games/results/[gameId]/entrants-leaderboard.tsx";
import type {Metadata} from "next";
import Button from "@/app/components/button.tsx";
import {redirect} from "next/navigation";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "DDW | Results",
};

export default async function GameResultsPage({ params }: {params: Promise<{ gameId: number }>}) {
    const gameId = (await params).gameId

    console.log('Game id:', gameId)

    async function handleClick() { 'use server'
        redirect('/home')
    }

    return (
            <div className='flex flex-col items-center justify-center p-12'>
                <h1 className='text-4xl font-bold font-[family-name:var(--font-geist-mono)]'>Game {gameId} Results</h1>
                <div
                    className='font-[family-name:var(--font-geist-mono)] flex flex-row items-start justify-center'>
                    <EntrantsLeaderboard params={{gameId: gameId}}/>
                    <UserLeaderboard params={{gameId: gameId}}/>
                </div>
                <Button text={'Home'} onClick={handleClick} className='m-4'/>
            </div>
    )
}