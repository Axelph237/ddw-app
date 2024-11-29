'use client'

import {ChangeEvent, useRef, useState} from "react";
import Button from "@/app/components/button.tsx";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import Limitedinput, {LimitedInputHandle} from "@/app/components/limitedinput.tsx";
import {createEntrant} from "@/scripts/entrants.ts";
import Image from "next/image";
import cat from "@/public/cat.jpg"
import dog from "@/public/dog.jpg"
import './Betting.css'

enum GameplayState {
    CharacterCreation, // On join, before game start
    WaitingRoom, // After character create, before game start
    Betting, // During match
    PostMatch
}

interface Entrant {
    name: string,
    weapon: string,
    id?: number,
    imgUrl?: string,
}

/**
 * Manages what screen to render to the user if they are in a game.
 */
export default function GameplayManager() {
    const [currState, setCurrState] = useState(GameplayState.Betting);

    const handleCharacterCreate = (entrant: Entrant) => {
        setCurrState(GameplayState.WaitingRoom);

        createEntrant(entrant).then(response => {
            console.log('Character created with response:', response)
        })
    }

    switch (currState) {
        case GameplayState.CharacterCreation:
            return <CharacterCreation handleCreate={handleCharacterCreate} />
        case GameplayState.WaitingRoom:
            return <WaitingRoom handleStart={() => console.log('Did nothing :D')}/>
        case GameplayState.Betting:
            return <Betting
                entrantOne={{name: 'Spongeborg', weapon: 'Spatubob'}}
                entrantTwo={{name: 'Adam Sandler', weapon: 'Philosphy'}}/>
        case GameplayState.PostMatch:
            return <PostMatch/>
    }
}

/**
 * Page content when user is creating a character
 *
 * @param handleCreate - the function to call to handle character creation
 * @constructor
 */
const CharacterCreation = ({
                               handleCreate
}: {
    handleCreate: (entrant: Entrant) => void
}) => {
    const [errMsg, setErrMsg] = useState('');
    const nameInputRef = useRef<LimitedInputHandle>(null)
    const weaponInputRef = useRef<LimitedInputHandle>(null)

    const handleClick = () => {
        const nameInput = nameInputRef.current
        const weaponInput = weaponInputRef.current

        if (!nameInput || !weaponInput) return // Return if elements are lost

        console.log('Creating character', nameInput.value, weaponInput.value)
        console.log('Name valid?:', nameInput.validInput)
        console.log('Weapon valid?:', weaponInput.validInput)

        if (nameInput.validInput && weaponInput.validInput && nameInput.value.length > 0 && weaponInput.value.length > 0)  {
            handleCreate({name: nameInput.value, weapon: weaponInput.value});
        }
        else if (!nameInput.validInput || !weaponInput.validInput) {
            setErrMsg('Woahhh slow down! Those are some pretty big pieces of text.')
        }
        else {
            setErrMsg('An empty entrant is no entrant :/')
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1 className="text-3xl font-[family-name:var(--font-geist-mono)]">Name Your Challenger!</h1>

            <Limitedinput maxChars={50} id='character-name' type='text' placeholder='Character New Name' ref={nameInputRef}/>
            <Limitedinput maxChars={50} id='character-weapon' type='text' placeholder='Character Weepon' ref={weaponInputRef}/>

            {/* Character Creation Button*/}
            <Button text={'Create Entrant'} onClick={handleClick}/>
            <p className='h-0'>{errMsg}</p>
        </div>
    )
}

/**
 * Page content when user is waiting for game to start. Displays 'Start Game' button when the user is the game admin.
 *
 * @param handleStart - the function to call on game start
 * @constructor
 */
const WaitingRoom = ({
                         handleStart
}: {
    handleStart: () => void,
}) => {
    const user = {isAdmin: true}

    return (
        <div className='flex flex-col items-center justify-center'>
            {/*<JumpyDog/>*/}
            <p>Waiting...</p>
            {user.isAdmin && <Button text={'Start Game'} onClick={handleStart} className='m-6'/>}
        </div>
    )
}

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

    return (
        <div className='flex flex-col justify-center items-center w-screen h-screen overflow-hidden gap-12'>
            <p>Who will win?</p>
            <div className='flex flex-row gap-6'>

                {/* Left entrant */}
                <div className='flex flex-col justify-center items-center'>
                    <div className={`${selectedEntrant == 'left' ? 'border-emerald-500' : 'hover:border-emerald-500 border-transparent'} box-border border-4 panel left-panel w-44 h-44 grid grid-rows-1 grid-cols-1`}
                         onClick={() => handleSelect('left')}>
                        {selectedEntrant == 'left' && <div className='shimmer w-full h-full row-end-1 col-end-1'></div>}
                        <Image src={imgLeft} alt={entrantOne.name} className='w-44 h-44 object-cover row-end-1 col-end-1'/>
                    </div>
                    <p className='entrant-name'>{entrantOne.name}</p>
                    <p className='entrant-weapon'>With {entrantOne.weapon}</p>
                </div>

                {/* Right entrant */}
                <div className='flex flex-col justify-center items-center'>
                    <div
                        className={`${selectedEntrant == 'right' ? 'border-emerald-500' : 'hover:border-emerald-500 border-transparent'} box-border border-4 panel right-panel w-44 h-44 grid grid-rows-1 grid-cols-1`}
                        onClick={() => handleSelect('right')}>
                        {selectedEntrant == 'right' && <div className='shimmer w-full h-full row-end-1 col-end-1'></div>}
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

const PostMatch = () => {
    return (
        <p>PostMatch</p>
    )
}