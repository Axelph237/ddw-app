import Button from "@/app/components/button.tsx";
import GameplayManager from "@/app/games/[gameId]/GameplayManager.tsx";

export default async function GamePage({params}: {
    params: Promise<{ gameId: number }>
}) {

    return (
        <div className='font-[family-name:var(--font-geist-mono)] flex flex-col items-center justify-center'>
            <p className='absolute bg-white text-black rounded p-1 m-2 top-0 left-0'>{(await params).gameId}</p>
            <GameplayManager isAdmin={true}/>
        </div>
    )
}