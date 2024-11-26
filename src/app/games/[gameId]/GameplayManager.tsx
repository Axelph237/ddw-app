'use client'

import {ChangeEvent, useState} from "react";
import Button from "@/app/components/button.tsx";

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
            return <WaitingRoom/>
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
    const MAX_INPUT_LEN = 50
    const [errMsg, setErrMsg] = useState('');
    const [nameCharsLength, setNameCharsLength] = useState(MAX_INPUT_LEN);
    const [weaponCharsLength, setWeaponCharsLength] = useState(MAX_INPUT_LEN);

    const handleClick = () => {
        const name = (document.getElementById("character-name") as HTMLInputElement)?.value;
        const weapon = (document.getElementById("character-weapon") as HTMLInputElement)?.value;

        console.log('Creating character', name, weapon)

        if (name && weapon && name.length < MAX_INPUT_LEN && weapon.length < MAX_INPUT_LEN)  {
            handleCreate();
        }
        else if (name.length > MAX_INPUT_LEN || weapon.length > MAX_INPUT_LEN) {
            setErrMsg('Woahhh slow down! Those are some pretty big pieces of text.')
        }
        else {
            setErrMsg('An empty entrant is no entrant :/')
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.id == 'character-name')
            setNameCharsLength(MAX_INPUT_LEN - e.target.value.length);
        else if (e.currentTarget.id == 'character-weapon')
            setWeaponCharsLength(MAX_INPUT_LEN - e.target.value.length);

        setErrMsg('')
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1 className="text-3xl font-[family-name:var(--font-geist-mono)]">Name Your Challenger!</h1>
            {/* Character Name Div */}
            <div className='flex flex-row items-center justify-center'>
                <input id='character-name' type='text' placeholder='Character Name'
                       onChange={handleChange}/>
                <p className={`w-0 ${nameCharsLength < 0 ? 'text-red-500' : 'text-white'} ${nameCharsLength == 50 && 'hidden'}`}>
                    {nameCharsLength}/50</p>
            </div>

            {/* Character Weapon Div */}
            <div className='flex flex-row items-center justify-center'>
                <input id='character-weapon' type='text' placeholder='Character Weapon'
                       onChange={handleChange}/>
                <p className={`w-0 ${weaponCharsLength < 0 ? 'text-red-500' : 'text-white'} ${weaponCharsLength == 50 && 'hidden'}`}>
                    {weaponCharsLength}/50</p>
            </div>

            {/* Character Creation Button*/}
            <Button text={'Create Entrant'} onClick={handleClick}/>
            <p className='h-0'>{errMsg}</p>
        </div>
    )
}

const WaitingRoom = () => {
    return (
        <p>Waiting Room</p>
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