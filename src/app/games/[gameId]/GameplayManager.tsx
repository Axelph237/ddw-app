'use client'

import {useState} from "react";
import Button from "@/app/components/button.tsx";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import Limitedinput, {LimitedInputElement} from "@/app/components/limitedinput.tsx";

enum GameplayState {
    CharacterCreation, // On join, before game start
    WaitingRoom, // After character create, before game start
    Betting, // During match
    PostMatch
}

/**
 * Manages what screen to render to the user if they are in a game.
 */
export default function GameplayManager() {
    const [currState, setCurrState] = useState(GameplayState.CharacterCreation);

    const handleCharacterCreate = () => {
        setCurrState(GameplayState.WaitingRoom);
    }

    switch (currState) {
        case GameplayState.CharacterCreation:
            return <CharacterCreation handleCreate={handleCharacterCreate} />
        case GameplayState.WaitingRoom:
            return <WaitingRoom handleStart={() => console.log('Did nothing :D')}/>
        case GameplayState.Betting:
            return <Betting/>
        case GameplayState.PostMatch:
            return <PostMatch/>
    }
}

const CharacterCreation = ({
                               handleCreate
}: {
    handleCreate: () => void
}) => {
    const [errMsg, setErrMsg] = useState('');

    const handleClick = () => {
        const nameInput = (document.getElementById("character-name") as LimitedInputElement)
        const weaponInput = (document.getElementById("character-weapon") as LimitedInputElement)

        console.log('Creating character', nameInput.value, weaponInput.value)

        if (nameInput.validInput && weaponInput.validInput && nameInput.value.length > 0 && weaponInput.value.length > 0)  {
            handleCreate();
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

            <Limitedinput maxChars={50} id='character-name' type='text' placeholder='Character New Name'/>
            <Limitedinput maxChars={50} id='character-weapon' type='text' placeholder='Character Weepon'/>

            {/* Character Creation Button*/}
            <Button text={'Create Entrant'} onClick={handleClick}/>
            <p className='h-0'>{errMsg}</p>
        </div>
    )
}

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

const Betting = () => {
    return (
        <p>Betting</p>
    )
}

const PostMatch = () => {
    return (
        <p>PostMatch</p>
    )
}