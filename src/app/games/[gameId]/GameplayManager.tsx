'use client'

import {useState} from "react";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import {createEntrant} from "@/scripts/entrants.ts";
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
export default function GameplayManager({isAdmin}: {isAdmin: boolean}) {
    const [currState, setCurrState] = useState(GameplayState.CharacterCreation);
    const [currMatch, setCurrMatch] = useState<number | null>(null)
    const [userBal, setUserBal] = useState<number>(4000);

    const handleCharacterCreate = (entrant: Entrant) => {
        setCurrState(GameplayState.WaitingRoom);

        createEntrant(entrant).then(response => {
            console.log('Character created with response:', response)
        })
    }

    const handleStart = () => {

    }

    const handleContinue = () => {

    }

    // Get specific page contents based on state
    let pageContents;
    switch (currState) {
        case GameplayState.CharacterCreation:
            pageContents = <CharacterCreation // Make actual updated values
                handleCreate={handleCharacterCreate}
            />
            break;
        case GameplayState.WaitingRoom:
            pageContents = <WaitingRoom handleStart={isAdmin ? handleStart : undefined}/>
            break;
        case GameplayState.Betting:
            pageContents = <Betting // Make actual updated values
                entrantOne={{name: 'Spongeborg', weapon: 'Spatubob'}}
                entrantTwo={{name: 'Adam Sandler', weapon: 'Philosphy'}}
                userBal={userBal}
                handleBet={(entrant: Entrant, amount: number) => {console.log(`$${amount} bet on ${entrant.name}(id:${entrant.id})`)}}
            />
            break;
        case GameplayState.PostMatch:
            pageContents = <PostMatch // Make actual updated values
                winner={{name: 'Spongeborg', weapon: 'Spatubob'}}
                loser={{name: 'Adam Sandler', weapon: 'Philosphy'}}
                newBal={userBal}
                prevBal={3000}
                story={'Lorem Ipsum'}
                handleContinue={isAdmin ? handleContinue : undefined}
            />
            break;
    }

    return (
        <div className={'w-screen h-screen flex flex-col justify-center items-center'}>
            <p className='absolute top-12 left-2'>User bal: {userBal}</p>
            {pageContents}
        </div>
    )
}