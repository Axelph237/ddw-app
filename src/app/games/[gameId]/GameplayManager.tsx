'use client'

import {useEffect, useState} from "react";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import {createEntrant, getEntrant} from "@/scripts/entrants.ts";
import {Entrant} from "@/scripts/entrants.ts";
// Page content components
import Betting from "@/app/games/[gameId]/pagecontents/Betting.tsx";
import WaitingRoom from "@/app/games/[gameId]/pagecontents/WaitingRoom.tsx";
import CharacterCreation from "@/app/games/[gameId]/pagecontents/CharacterCreation.tsx";
import PostMatch from "@/app/games/[gameId]/pagecontents/PostMatch.tsx";
import {getBalance, getCurrentMatch, getCurrentRound, getMatchEntrants} from "@/scripts/gameplay.ts";

enum GameplayState {
    CharacterCreation, // On join, before game start
    WaitingRoom, // After character create, before game start
    Betting, // During match
    PostMatch
}

/**
 * Manages what screen to render to the user if they are in a game.
 */
export default function GameplayManager({game}:{game:{id: number, isAdmin: boolean, inLobby: boolean}}) {
    // State for current page display
    const [currState, setCurrState] = useState(GameplayState.CharacterCreation);
    // General error message display
    const [errMsg, setErrMsg] = useState('')
    const errDisplay = (errMsg != '' && <p className={'m-1'}>{errMsg}</p>)
    // User and game details
    const [currMatch, setCurrMatch] = useState<number | null>(null)
    const [currRound, setCurrRound] = useState<number | null>(null)
    const [currEntrants, setCurrEntrants] = useState<{entrantOne: Entrant, entrantTwo: Entrant} | null>(null)
    const [userBal, setUserBal] = useState<number>(0);

    const handleCharacterCreate = (entrant: Entrant) => {
        createEntrant(entrant)
            .then(response => {
                if (!response.detail || response.detail.toString().toLowerCase().includes('no row')) {
                    // Successful creation or user already has entrant
                    setCurrState(GameplayState.WaitingRoom)
                }
                else if (response.detail.toString().toLowerCase().includes('inappropriate')) {
                    // Inappropriate words were passed to character creation
                    console.log('Why you putting naughty words in there?')
                    setErrMsg('Try to do something a bit more appropriate please 😁')
                }
                else {
                    // General catch
                    console.log('Entrant creation failed with details:', response.detail)
                    setErrMsg('Uncaught error: ' + response.detail.toString())
                }
            })
    }

    const handleStart = () => {
        /*
         * Start game *then* set state over to Betting
         */
    }

    const handleContinue = () => {
        /*
         * Continue game *then* return to Betting
         */
    }

    useEffect(() => {
        getBalance(game.id).then(response => setUserBal(response.balance))

        const updateDelay = 1000
        // round update tick
        setInterval(() => {
            if (game.id) {
                getCurrentRound(game.id).then(response => {
                    // Update round
                    if (response.round_id) setCurrRound(response.round_id)
                    else setCurrRound(null)
                })
            }
        }, updateDelay)

        // match update tick
        setInterval(() => {
            if (currRound) {
                // Update match
                getCurrentMatch(game.id).then(response => {
                    if (response.match_id) setCurrRound(response.match_id)
                    else setCurrMatch(null)
                })
            }
        }, updateDelay)
    })

    useEffect(() => {
        // On round update
    }, [currRound])

    useEffect(() => { // On match update
        if (currMatch) {
            getMatchEntrants(currMatch).then(async (response) => {
                const entrantOne = await getEntrant(response.entrant1_id)
                const entrantTwo = await getEntrant(response.entrant2_id)

                setCurrEntrants({entrantOne, entrantTwo})
                setCurrState(GameplayState.Betting)
            })
        }
    }, [currMatch])

    // Get specific page contents based on state
    let pageContents;
    switch (currState) {
        case GameplayState.CharacterCreation:
            pageContents = (
                <>
                    <CharacterCreation // Make actual updated values
                        handleCreate={handleCharacterCreate}
                    />
                    {errDisplay}
                </>
            )
            break;
        case GameplayState.WaitingRoom:
            pageContents = <WaitingRoom handleStart={game.isAdmin ? handleStart : undefined}/>
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
                handleContinue={game.isAdmin ? handleContinue : undefined}
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

