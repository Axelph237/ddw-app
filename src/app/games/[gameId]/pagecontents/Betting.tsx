import {ChangeEvent, useEffect, useRef, useState} from "react";
import dog from "@/public/dog.jpg";
import cat from "@/public/cat.jpg";
import Image from "next/image";
import Button from "@/app/components/button.tsx";
import {Entrant} from "@/scripts/entrants.ts";
import './Betting.css'

/**
 * Page content when player is betting on current match entrants
 *
 * @constructor
 */
const Betting = ({entrantOne, entrantTwo, userBal, handleBet}:
                     {
                         entrantOne: Entrant,
                         entrantTwo: Entrant,
                         userBal: number,
                         handleBet: (entrant: Entrant, amount: number) => void
                     }
) => {
    const [selectedEntrant, setSelectedEntrant] = useState<string | null>(null)
    const [isValidAmount, setIsValidAmount] = useState(true)
    const [mousePos, setMousePos] = useState({x: -1, y: -1})
    const betInputRef = useRef<HTMLInputElement>(null)

    const imgLeft = entrantOne.imgUrl ? entrantOne.imgUrl : dog;
    const imgRight = entrantTwo.imgUrl ? entrantTwo.imgUrl : cat;

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

    const handleSubmit = () => {
        if (!betInputRef.current || !isValidAmount) return

        const entrant = selectedEntrant == 'left' ? entrantOne : entrantTwo

        handleBet(entrant, parseInt(betInputRef.current.value))
    }

    const handleMouseMouse = (event: MouseEvent) => {
        setMousePos({x: event.clientX, y: event.clientY})
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMouse)

        return () => {
            window.removeEventListener('mousemove', handleMouseMouse)
        }
    })

    return (
        <div className='flex flex-col justify-center items-center w-screen h-screen overflow-hidden gap-12'>
            <p>Who will win?</p>
            <div className='flex flex-row gap-6'>

                {/* Left entrant */}
                <div className='flex flex-col justify-center items-center'>
                    <div className={`${selectedEntrant == 'left' ? 'border-emerald-500' : 'hover:border-emerald-500 border-transparent'} box-border border-4 panel left-panel w-44 h-44 grid grid-rows-1 grid-cols-1 cursor-pointer`}
                         onClick={() => handleSelect('left')}>
                        {selectedEntrant == 'left' && <div className='shimmer w-full h-full row-end-1 col-end-1'  style={{backgroundPositionX: `${(mousePos.x * ( 2000 / window.innerWidth)) - 500}px`}}></div>}
                        <Image src={imgLeft} alt={entrantOne.name} className='w-44 h-44 object-cover row-end-1 col-end-1'/>
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
                        <Image src={imgRight} alt={entrantTwo.name} className='w-44 h-44 object-cover row-end-1 col-end-1'/>
                    </div>
                    <p className='entrant-name'>{entrantTwo.name}</p>
                    <p className='entrant-weapon'>With {entrantTwo.weapon}</p>
                </div>
            </div>
            {selectedEntrant && <div className='flex flex-col justify-center items-center'>
                <p>How much you wanna bet on {selectedEntrant == 'left' ? entrantOne.name : entrantTwo.name}?</p>
                <div className='flex flex-row justify-center items-center'>
                    <p className={`${!isValidAmount && 'text-red-500'}`}>$</p>
                    <input ref={betInputRef} type='number' placeholder='0' min={0} step={1} onChange={handleChange} className={`${!isValidAmount && 'border-red-500 text-red-500'}`}/>
                    <Button text={'Submit'} onClick={handleSubmit} />
                </div>
            </div>}
        </div>
    )
}
export default Betting