import {ChangeEvent, useEffect, useRef, useState} from "react";
import dog from "@/public/dog.jpg";
import cat from "@/public/cat.jpg";
import Image from "next/image";
import Button from "@/app/components/button.tsx";
import {Entrant} from "@/scripts/entrants.ts";
import './Betting.css'
import {getBetInfo} from "@/scripts/gameplay.ts";

/**
 * Page content when player is betting on current match entrants
 *
 * @constructor
 */
const Betting = ({entrantOne, entrantTwo, userBal, handleBet, matchId, handleContinue}:
                     {
                         entrantOne?: Entrant,
                         entrantTwo?: Entrant,
                         userBal: number,
                         matchId: number | null,
                         handleBet: (matchId: number, entrantId: number, amount: number) => void
                         handleContinue?: () => void
                     }
) => {
    const [numBets, setNumBets] = useState<number>(0)
    const [numPlayers, setNumPlayers] = useState<number | null>(null)
    const [selectedEntrant, setSelectedEntrant] = useState<string | null>(null)
    const [isValidAmount, setIsValidAmount] = useState(true)
    const [mousePos, setMousePos] = useState({x: -1, y: -1})
    const [placedBet, setPlacedBet] = useState(false)
    const betInputRef = useRef<HTMLInputElement>(null)

    // Default entrant values if missing
    entrantOne = entrantOne ? entrantOne : {name: 'None', weapon: 'None'}
    entrantTwo = entrantTwo ? entrantTwo : {name: 'None', weapon: 'None'}

    // Set image values, or default values if missing
    const imgLeft = entrantOne.img_url ? entrantOne.img_url : dog;
    const imgRight = entrantTwo.img_url ? entrantTwo.img_url : cat;

    const handleSelect = (target: string) => {
        if (target == selectedEntrant) {
            setSelectedEntrant(null)
        }
        else {
            setSelectedEntrant(target)
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const amount  = parseInt(event.target.value)

        if (amount < 0 || amount > userBal)
            setIsValidAmount(false)
        else
            setIsValidAmount(true)
    }

    const handlePlaceBet = () => {
        if (!betInputRef.current || !isValidAmount) return

        setPlacedBet(true)
        const entrant = selectedEntrant == 'left' ? entrantOne : entrantTwo

        if (entrant.entrant_id && matchId) {
            handleBet(matchId, entrant.entrant_id, parseInt(betInputRef.current.value))
        }
    }

    const handleMouseMouse = (event: MouseEvent) => {
        setMousePos({x: event.clientX, y: event.clientY})
    }

    useEffect(() => {
        // Update num bets display
        const updateDisplay = async () => {
            if (!matchId) return;

            const betInfo = await getBetInfo(matchId)

            if (betInfo?.bet_count && betInfo?.player_count) {
                setNumBets(betInfo.bet_count)
                setNumPlayers(betInfo.player_count)
            }
        }
        updateDisplay().then(() => {})

        const updateDelay = 2000
        const intervalId = setInterval(updateDisplay, updateDelay)

        window.addEventListener('mousemove', handleMouseMouse)

        return () => {
            window.removeEventListener('mousemove', handleMouseMouse)
            clearInterval(intervalId)
        }
    })

    return (
        <div className='flex flex-col justify-center items-center w-fit h-fit p-32 overflow-hidden gap-12'>
            <div className='flex flex-col justify-center items-center'>
                <p className='text-3xl font-bold'>{placedBet ? 'Waiting on results' : 'Who will win?'}</p>
                {numPlayers && <p>Player bets: {numBets}/{numPlayers}</p>}
            </div>
            <div className='flex flex-row gap-6'>

                {/* Left entrant */}
                <div className='flex flex-col justify-center items-center'>
                    <div className={`${selectedEntrant == 'left' ? 'border-emerald-500' : 'hover:border-emerald-500 border-transparent'} box-border border-4 panel left-panel w-44 h-44 grid grid-rows-1 grid-cols-1 cursor-pointer`}
                         onClick={() => handleSelect('left')}>
                        {selectedEntrant == 'left' && <div className='shimmer w-full h-full row-end-1 col-end-1'  style={{backgroundPositionX: `${(mousePos.x * ( 2000 / window.innerWidth)) - 500}px`}}></div>}
                        <Image src={imgLeft} alt={entrantOne.name} width={300} height={300} className='w-44 h-44 object-cover row-end-1 col-end-1'/>
                    </div>
                    <p className='entrant-name'>{entrantOne.name}</p>
                    <p className='entrant-weapon'>With {entrantOne.weapon}</p>
                </div>

                {/* Right entrant */}
                <div className='flex flex-col justify-center items-center'>
                    <div
                        className={`${selectedEntrant == 'right' ? 'border-emerald-500' : 'hover:border-emerald-500 border-transparent'} box-border border-4 panel right-panel w-44 h-44 grid grid-rows-1 grid-cols-1 cursor-pointer`}
                        onClick={() => handleSelect('right')}>
                        {selectedEntrant == 'right' && <div className='shimmer w-full h-full row-end-1 col-end-1' style={{backgroundPositionX: `${(mousePos.x * ( 2000 / window.innerWidth)) - 500}px`}}></div>}
                        <Image src={imgRight} alt={entrantTwo.name} width={300} height={300} className='w-44 h-44 object-cover row-end-1 col-end-1'/>
                    </div>
                    <p className='entrant-name'>{entrantTwo.name}</p>
                    <p className='entrant-weapon'>With {entrantTwo.weapon}</p>
                </div>
            </div>
            {(selectedEntrant && !placedBet) && <div className='flex flex-col justify-center items-center'>
                <p>How much you wanna bet on {selectedEntrant == 'left' ? entrantOne.name : entrantTwo.name}?</p>
                <div className='flex flex-row justify-center items-center'>
                    <p className={`${!isValidAmount && 'text-red-500'}`}>$</p>
                    <input ref={betInputRef} type='number' placeholder='0' min={0} step={1} onChange={handleChange} className={`${!isValidAmount && 'border-red-500 text-red-500'}`}/>
                    <Button text={'Submit'} onClick={handlePlaceBet} />
                </div>
            </div>}
            {handleContinue && <Button text={'Conclude Match'} onClick={handleContinue}/>}
        </div>
    )
}
export default Betting