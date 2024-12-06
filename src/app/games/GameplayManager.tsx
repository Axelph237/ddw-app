'use client'

import {ReactElement, useEffect, useState} from "react";
import {createEntrant, getEntrant, getUserEntrant} from "@/scripts/entrants.ts";
import {Entrant} from "@/scripts/entrants.ts";
// Page content components
import Betting from "@/app/games/pagecontents/Betting.tsx";
import WaitingRoom from "@/app/games/pagecontents/WaitingRoom.tsx";
import CharacterCreation from "@/app/games/pagecontents/CharacterCreation.tsx";
import PostMatch from "@/app/games/pagecontents/PostMatch.tsx";
import {
    continueGame,
    getBalance,
    placeBet
} from "@/scripts/gameplay.ts";
import {getCurrentGame, startGame} from "@/scripts/game.ts";
import {redirect} from "next/navigation";
import Loading from "@/app/games/pagecontents/Loading.tsx";
import {dispatchError} from "@/app/components/erroralert/erroralert.tsx";

/**
 * Manages what screen to render to the user if they are in a game.
 */
export default function GameplayManager({game}:{game:{id: number, isAdmin: boolean}}) {
    // ---- STATE VARIABLES ----
    // State for current page display
    const [pageContents, setPageContents] = useState<ReactElement | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    // General error message display
    // User and game details
    const [userBal, setUserBal] = useState<number>(0)

    // ---- HANDLERS ----
    // Run async function for character creation
    // Handles errors from character creation and sets errMsg accordingly
    const handleCharacterCreate = (entrant: Entrant, onErr: () => void) => {
        createEntrant(entrant)
            .then(response => {
                console.log('Create entrant response:', response)
                if (!response.detail || response.detail.toString().toLowerCase().includes('no row')) {
                    // Successful creation or user already has entrant
                }
                else if (response.detail.toString().toLowerCase().includes('inappropriate')) {
                    // Inappropriate words were passed to character creation
                    console.log('Why you putting naughty words in there?')
                    dispatchError('Try to do something a bit more appropriate please 😁', onErr)
                }
                else {
                    // General catch
                    console.log('Entrant creation failed with details:', response.detail)
                    dispatchError('Uncaught error: ' + response.detail.toString(), onErr)
                }
            })
    }

    // Runs async startGame function
    const handleStart = () => {
        startGame(game.id)
            .then(async (response) => {
                console.log('Game started with response:', response)

                const continueResponse = await continueGame(game.id)
                console.log('First match started with response:', continueResponse)
            })
            .catch(error => {
                dispatchError(error)
            })
    }

    // Runs async continueGame function
    const handleContinue = () => {
        continueGame(game.id)
            .then(response => console.log('Game continued with response:', response))
            .catch(error => dispatchError(error))
    }

    const handleBet = (matchId: number, entrantId: number, amount: number) => {
        const placementId = Math.floor(Math.random() * (10**9)) // Random number 1-1,000,000,000

        console.log(`Submitting bet: entrantId: ${entrantId} | matchId: ${matchId} | amount: ${amount} | placementId: ${placementId}`)
        placeBet(placementId, {
            matchId: matchId,
            entrantId: entrantId,
            amount: amount
        })
            .then(response => console.log('Bet placed with response:', response))
            .catch(error => console.log('Error placing bet:', error))
    }

    // ---- RERENDER EVENTS ----
    // Initializes component
    useEffect(() => {
        const minUpdateDelay = 500

        const updateLoop = () => {
            getBalance(game.id).then(response => setUserBal(response.balance))

            const start = performance.now()

            getCurrentGame().then(game => {
                if (!game) {
                    redirect('/home')
                }

                if (game.active_round) { // Game started
                    if (game.active_match) { // There is a running match
                        // console.log('There is an active match')
                        stateToBetting(game.active_match,
                            {one: game.active_entrant_one, two: game.active_entrant_two})
                    }
                    else if (game.last_match) { // No running match, but previous match
                        // console.log('There is not active match')
                        stateToPostMatch(game.last_match,
                            {victor: game.last_victor, loser: game.last_loser})
                    }
                    else { // No match has been started
                        // ... nothing ...
                    }
                }
                else { // Game not started
                    // console.log('Game is in lobby')
                    stateToLobby()
                }
                const end = performance.now();
                const elapsedTime = end - start
                // Run update immediately if elapsedTime > minUpdateDelay
                setTimeout(updateLoop, Math.max(minUpdateDelay - elapsedTime, 0))
            })
        }

        // initState()
        updateLoop()

        return () => {
            // clearInterval(roundIntervalID)
            // clearInterval(matchIntervalID)
        }
    }, [])

    // ---- STATE UPDATE FUNCTIONS ----
    // Moves to lobby states
    function stateToLobby() {
        if (!loading) {
            setLoading(true)
        }

        getUserEntrant(game.id).then(userEntrant => {

            let pageElem: ReactElement;
            if (userEntrant.created && pageContents?.type !== WaitingRoom) {
                pageElem = <WaitingRoom handleStart={game.isAdmin ? handleStart : undefined}/>
            }
            else if (pageContents?.type !== CharacterCreation) {
                pageElem = <CharacterCreation handleCreate={handleCharacterCreate} />
            }
            else return;

            setPageContents(pageElem)

            if (loading) {
                setLoading(false)
            }
        })
    }

    // Moves to betting, getting necessary data
    function stateToBetting(matchId: number, entrants: {one: number, two: number}) {
        if (pageContents?.type === Betting) {
            return
        }

        if (!loading) {
            setLoading(true)
        }

        getBalance(game.id).then(async response => { // Get entrant one
            const entrantOne = await getEntrant(entrants.one)
            const entrantTwo = await getEntrant(entrants.two)

            const pageElem = <Betting
                entrantOne={entrantOne}
                entrantTwo={entrantTwo}
                userBal={response.balance}
                matchId={matchId}
                handleBet={handleBet}
                handleContinue={game.isAdmin ? handleContinue : undefined}
            />

            setPageContents(pageElem)
            if (loading) {
                setLoading(false)
            }
        })
    }

    // Moves to post match, getting necessary data
    function stateToPostMatch(matchId: number, entrants: {victor: number, loser: number}) {
        if (pageContents?.type === PostMatch) {
            return
        }

        if (!loading) {
            setLoading(true)
        }

        getBalance(game.id).then(async response => {
            const victor = await getEntrant(entrants.victor)
            const loser = await getEntrant(entrants.loser)

            const pageElem = <PostMatch // Make actual updated values
                winner={victor}
                loser={loser}
                newBal={response.balance}
                matchId={matchId}
                isAdmin={game.isAdmin}
                gameId={game.id}
            />

            setPageContents(pageElem)
            if (loading) {
                setLoading(false)
            }
        })
    }

    // ---- BODY ----
    return (
        <div className={'w-screen h-screen flex flex-col justify-center items-center'}>
            <p className='absolute top-24 left-2 p-2'>User bal: {userBal}</p>
            {pageContents ? pageContents : <Loading />}
        </div>
    )
}