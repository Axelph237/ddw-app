import {Entrant, getEntrant} from "@/scripts/entrants.ts";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import Loading from "@/app/games/[gameId]/pagecontents/Loading.tsx";
import './Betting.css'
import './PostMatch.css'
import dog from "@/public/dog.jpg";

export default function GameComplete({entrantId}: {entrantId: number}) {
    const [entrantStats, setEntrantStats] = useState<Entrant | null>(null)

    useEffect(() => {
        getEntrant(entrantId).then(response => {
            setEntrantStats(response)
            console.log('Entrant stats:', response)
        })
    }, []);

    return (
        entrantStats
            ? (<div className='flex flex-col items-center justify-center'>
                <div className={`w-44 h-44 grid grid-rows-1 grid-cols-1 cursor-pointer`}>
                    <p className={'row-end-1 col-end-1 relative text-8xl'} style={{
                        rotate: '15deg',
                        top: '-35%',
                        left: '22.5%'
                    }}>👑</p>
                    <Image src={entrantStats.img_url ? entrantStats.img_url : dog} alt={entrantStats.name} width={300} height={400}
                           className='object-cover row-end-1 col-end-1 rounded-full'/>
                </div>
                <p className='text-3xl font-bold m-4'>BIG TIME WINNER!</p>
                <p className='entrant-name'>{entrantStats.name}</p>
                <p className='entrant-weapon mb-4'>With {entrantStats.weapon}</p>

                {/* Stats */}
                <p className='text-xl font-bold mt-4'>Stats:</p>
                <p>Total bets: {entrantStats.total_bets}</p>
                <p>Highest bets: {entrantStats.max_bet}</p>
                <p>Matches won: {entrantStats.matches_won}</p>
            </div>)
            : <Loading/>
    )
}