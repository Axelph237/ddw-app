'use client'

import {useRef, useState} from "react";
import Button from "@/app/components/button.tsx";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import Limitedinput, {LimitedInputHandle} from "@/app/components/limitedinput.tsx";
import {createEntrant} from "@/scripts/entrants.ts";
import './Betting.css'
import {Entrant} from "@/scripts/entrants.ts";
// Page content components
import Betting from "@/app/games/[gameId]/pagecontents/Betting.tsx";
import WaitingRoom from "@/app/games/[gameId]/pagecontents/WaitingRoom.tsx";
import CharacterCreation from "@/app/games/[gameId]/pagecontents/CharacterCreation.tsx";
import PostMatch from "@/app/games/[gameId]/pagecontents/PostMatch.tsx";

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