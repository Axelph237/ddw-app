import Button from "@/app/components/button.tsx";
import GameplayManager from "@/app/games/[gameId]/GameplayManager.tsx";

export default async function GamePage() {

    return (
        <div className='font-[family-name:var(--font-geist-sans)] w-screen h-screen flex flex-col items-center justify-center'>
            <GameplayManager/>
        </div>
    )
}