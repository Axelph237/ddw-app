import Button from "@/app/components/button.tsx";
import { redirect } from 'next/navigation';
import {getCurrentGame, joinGame} from "@/scripts/game.ts";

export default async function HomePage() {

    async function handleJoin() { 'use server'
        const joinedGame = await joinGame()

        if (joinedGame.id) {
            redirect(`/games/${joinedGame.id}`);
        }
        else {
            const currGame = await getCurrentGame()
            redirect(`/games/${currGame.id}`)
        }
    }

    return (
        <div className='font-[family-name:var(--font-geist-sans)] w-screen h-screen flex flex-col items-center justify-center'>
            <h2 className='font-[family-name:var(--font-geist-sans)] text-2xl'>welcome to</h2>
            <h1 className='mb-3 mt-1 font-[family-name:var(--font-geist-mono)] text-4xl'>DOGGEE-DOG-WORLD</h1>
            <Button onClick={handleJoin} text='Join Game' className='m-3' />
        </div>
    )
}