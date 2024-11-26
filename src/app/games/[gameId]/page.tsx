import Button from "@/app/components/button.tsx";
import GameplayManager from "@/app/games/[gameId]/GameplayManager.tsx";

export default async function GamePage({params}: {
    params: Promise<{ gameId: number }>
}) {

    return (
        <div className='font-[family-name:var(--font-geist-sans)] w-screen h-screen flex flex-col items-center justify-center'>
            <p>You are in game {(await params).gameId}</p>
            <GameplayManager/>
        </div>
    )
}