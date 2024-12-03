import {Entrant} from "@/scripts/entrants.ts";
import Image from "next/image";
import dog from "@/public/dog.jpg";
import cat from "@/public/cat.jpg";
import './PostMatch.css'
import Button from "@/app/components/button.tsx";
import {useEffect, useState} from "react";
import {getMatchData} from "@/scripts/gameplay.ts";

// TODO add awaiting functionality to story so that story only displays once available
const PostMatch = ({winner, loser, prevBal, newBal, handleContinue, matchId}:
                       {
                           winner?: Entrant,
                           loser?: Entrant,
                           matchId: number | null,
                           prevBal: number,
                           newBal: number,
                           handleContinue?: () => void
                       }) => {
    const [imgMatch, setImgMatch] = useState<string | null>(null);
    const [story, setStory] = useState<string | null>(null);

    useEffect(() => {
        if (matchId) {
            getMatchData(matchId).then((data) => {
                setImgMatch(data.img_url)
                setStory(data.story)
            })
        }
    }, [])

    // Default entrant values if missing
    winner = winner ? winner : {name: 'None', weapon: 'None'}
    loser = loser ? loser : {name: 'None', weapon: 'None'}

    const imgWinner = winner.img_url ? winner.img_url : dog;
    const imgLoser = loser.img_url ? loser.img_url : cat;

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='grid grid-rows-1 grid-cols-1'>
                {imgMatch
                    ? <Image src={imgMatch} alt={imgMatch} className='w-64 h-64 object-cover' />
                    : (<>
                    {/* Loser */}
                    <div
                        className={`flat-gelatine row-end-1 col-end-1 w-44 h-44 grid grid-rows-1 grid-cols-1`}>
                        <div className={'w-44 h-44 bg-emerald-800 opacity-50 row-end-1 col-end-1 rounded-full'}></div>
                        <Image src={imgLoser} alt={loser.name}
                               className='w-44 h-44 object-cover row-end-1 col-end-1 rounded-full'/>
                    </div>

                    {/* Winner */}
                    <div
                        className={`bounce row-end-1 col-end-1 w-44 h-44 grid grid-rows-1 grid-cols-1 relative`}
                        style={{top: '-35%'}}>
                        <p className={'row-end-1 col-end-1 relative text-8xl'} style={{
                            rotate: '15deg',
                            top: '-35%',
                            left: '22.5%'
                        }}>👑</p>
                        <Image src={imgWinner} alt={winner.name}
                               className='w-44 h-44 object-cover row-end-1 col-end-1 rounded-full'/>
                    </div>
                </>)
            }
            </div>
            <p className='text-3xl font-bold relative'>{winner.name} stands victorious!</p>
            <div className='flex flex-row items-center justify-center'>
                <p>{'Earnings:'}</p>
                <p className={`font-bold ${newBal < prevBal ? 'text-red-500' : 'text-emerald-500'} text-xl`}>{newBal > prevBal ? '+' : '-'}{Math.abs(newBal - prevBal)}</p>
            </div>
            {story && <StarWarsText text={story}/>}
            <div className='h-'></div>
            {handleContinue && <Button text='Next Match' onClick={handleContinue}/>}
        </div>
    )
}
export default PostMatch

const StarWarsText = ({text}: { text: string }) => {
    const [visible, setVisible] = useState<boolean>(true)
    const CHARS_PER_MS = 0.03
    const durMS = text.length / CHARS_PER_MS

    console.log(`Setting speed with ${text.length}chars to speed of ${durMS}ms`)

    setTimeout(() => {
        setVisible(false)
    }, durMS)

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className={`text-container grid grid-rows-1 grid-cols-1 ${!visible && 'hidden'} text-center`}>
                <p className='scroll-text fade-text row-end-1 col-end-1 text-2xl'
                   style={{animationDuration: `${durMS}ms`}}>{text}</p>
            </div>
            <div className='grid grid-rows-1 grid-cols-1 w-64 h-2 rounded-full overflow-hidden mb-6'>
                <div className='loading-bar-bg row-end-1 col-end-1 bg-emerald-950 w-64 h-2' style={{animationDuration: `${durMS}ms`}}></div>
                <div className='loading-bar row-end-1 col-end-1 bg-white w-64 h-2 rounded-full' style={{animationDuration: `${durMS}ms`}}></div>
            </div>
        </div>
    )
}