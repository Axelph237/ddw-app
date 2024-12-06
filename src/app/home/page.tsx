import type {Metadata} from "next";

export const dynamic = 'force-dynamic';

import Button from "@/app/components/button.tsx";
import { redirect } from 'next/navigation';
import {getLatestGame, getUserStatus, joinGame} from "@/scripts/game.ts";

export const metadata: Metadata = {
    title: "DDW | Home",
};

export default async function HomePage() {

    // Attempt to reenter current game if in lobby
    const userStatus = await getUserStatus();
    if (userStatus && userStatus.in_lobby == true) {
        redirect(`/games`)
    }

    async function handleJoin() { 'use server'
        await joinGame()

        redirect('/games')
    }

    async function handleLatestResults() { 'use server'
        const gameId = (await getLatestGame()).game_id

        redirect(`/games/results/${gameId}`)
    }

    return (
        <div className='font-[family-name:var(--font-geist-sans)] w-screen h-screen flex flex-col items-center justify-center'>
            <h2 className='font-[family-name:var(--font-geist-sans)] text-2xl'>welcome to</h2>
            <h1 className='mb-3 mt-1 font-[family-name:var(--font-geist-mono)] text-4xl'>D0GG33-D0G-W0RLD</h1>
            <Button onClick={handleJoin} text='Join Game' className='m-3' />
            <Button onClick={handleLatestResults} text='Latest Game Results' className='m-3' />
        </div>
    )
}