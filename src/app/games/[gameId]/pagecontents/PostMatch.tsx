import {Entrant} from "@/scripts/entrants.ts";
import Image from "next/image";
import dog from "@/public/dog.jpg";
import cat from "@/public/cat.jpg";
import './PostMatch.css'

const PostMatch = ({winner, loser, prevBal, newBal, story}:
                       {
                           winner: Entrant,
                           loser: Entrant,
                           prevBal: number,
                           newBal: number,
                           story: string,
                       }) => {

    const imgWinner = winner.imgUrl ? winner.imgUrl : dog;
    const imgLoser = loser.imgUrl ? loser.imgUrl : cat;

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='grid grid-rows-1 grid-cols-1'>
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
            </div>
            <p className='text-3xl font-bold relative'>{winner.name} stands victorious!</p>
            <div className='flex flex-row items-center justify-center'>
                <p>{'Earnings:'}</p>
                <p className={`font-bold text-${newBal >= prevBal ? 'emerald-500' : 'red-500'} text-xl`}>{newBal > prevBal ? '+' : '-'}{Math.abs(newBal - prevBal)}</p>
            </div>
            <StarWarsText text={story}/>
        </div>
    )
}
export default PostMatch

const StarWarsText = ({text}: { text: string }) => {
    const CHARS_PER_MS = 0.035

    return (
        <>
            <div className='text-container grid grid-rows-1 grid-cols-1'>
                <p className='scroll-text fade-text row-end-1 col-end-1 text-2xl'
                   style={{animationDuration: `${text.length / CHARS_PER_MS}ms`}}>{'Lorem Ipsum '.repeat(50)}</p>
            </div>
            <div className='grid grid-rows-1 grid-cols-1 w-64 h-4 rounded-full overflow-hidden'>
                <div className='row-end-1 col-end-1 bg-emerald-950 w-64 h-4 opacity-50'></div>
                <div className='loading-bar row-end-1 col-end-1 bg-white w-64 h-4 rounded-full' style={{animationDuration: `${text.length / CHARS_PER_MS}ms`}}></div>
            </div>
        </>
    )
}