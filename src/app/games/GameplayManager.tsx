'use client'

import {ReactElement, useEffect, useState} from "react";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import {createEntrant, getEntrant, getUserEntrant} from "@/scripts/entrants.ts";
import {Entrant} from "@/scripts/entrants.ts";
// Page content components
import Betting from "@/app/games/pagecontents/Betting.tsx";
import WaitingRoom from "@/app/games/pagecontents/WaitingRoom.tsx";
import CharacterCreation from "@/app/games/pagecontents/CharacterCreation.tsx";
import PostMatch from "@/app/games/pagecontents/PostMatch.tsx";
import {
    continueGame,
    getBalance, getBet,
    placeBet
} from "@/scripts/gameplay.ts";
import {getCurrentGame, startGame} from "@/scripts/game.ts";
import GameComplete from "@/app/games/pagecontents/GameComplete.tsx";
import {redirect} from "next/navigation";

enum GameplayState {
    CharacterCreation, // On join, before game start
    WaitingRoom, // After character create, before game start
    Betting, // During match
    PostMatch,
    Complete
}

/**
 * Manages what screen to render to the user if they are in a game.
 */
export default function GameplayManager({game}:{game:{id: number, isAdmin: boolean}}) {
    // ---- STATE VARIABLES ----
    // State for current page display
    const [currState, setCurrState] = useState<GameplayState | undefined>();
    const [pageContents, setPageContents] = useState<ReactElement | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    // General error message display
    const [errMsg, setErrMsg] = useState('')
    const errDisplay = (errMsg != '' && <p className={'m-1'}>{errMsg}</p>)
    // User and game details
    const [userBal, setUserBal] = useState<number>(0)

    // ---- HANDLERS ----
    // Run async function for character creation
    // Handles errors from character creation and sets errMsg accordingly
    const handleCharacterCreate = (entrant: Entrant) => {
        createEntrant(entrant)
            .then(response => {
                console.log('Create entrant response:', response)
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

    // Runs async startGame function
    const handleStart = () => {
        startGame(game.id).then(async (response) => {
            console.log('Game started with response:', response)

            const continueResponse = await continueGame(game.id)
            console.log('First match started with response:', continueResponse)
        })
    }

    // Runs async continueGame function
    const handleContinue = () => {
        continueGame(game.id).then(response => console.log('Game continued with response:', response))
    }

    const handleBet = (matchId: number, entrantId: number, amount: number) => {
        const placementId = Math.floor(Math.random() * (10**9)) // Random number 1-1,000,000,000

        console.log(`Submitting bet: entrantId: ${entrantId} | matchId: ${matchId} | amount: ${amount} | placementId: ${placementId}`)
        placeBet(placementId, {
            matchId: matchId,
            entrantId: entrantId,
            amount: amount
        }).then(response => console.log('Bet placed with response:', response))
    }

    // ---- RERENDER EVENTS ----
    // Initializes component
    useEffect(() => {
        const updateDelay = 2000

        const updateLoop = () => {
            // console.log('Updating...')
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

                setTimeout(updateLoop, updateDelay)
            })
        }

        // Set initial balance
        getBalance(game.id).then(response => setUserBal(response.balance))

        // initState()
        updateLoop()

        return () => {
            // clearInterval(roundIntervalID)
            // clearInterval(matchIntervalID)
        }
    }, [])

    useEffect(() => {
        console.log('Current state:', currState)
    }, [currState])

    // ---- STATE UPDATE FUNCTIONS ----
    // Moves to lobby states
    function stateToLobby() {
        console.log('Changing state to: Lobby')
        if (!loading) {
            setLoading(true)
        }

        getUserEntrant(game.id).then(userEntrant => {

            let pageElem: ReactElement;
            if (userEntrant.created && pageContents?.type !== WaitingRoom) {
                pageElem = <WaitingRoom handleStart={game.isAdmin ? handleStart : undefined}/>
                setCurrState(GameplayState.WaitingRoom)
            }
            else if (pageContents?.type !== CharacterCreation) {
                pageElem = <CharacterCreation handleCreate={handleCharacterCreate}/>
                setCurrState(GameplayState.CharacterCreation)
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
            console.log('Not updating state')
            return
        }

        console.log('Changing state to: Betting')
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

            setUserBal(response.balance)
            setPageContents(pageElem)
            setCurrState(GameplayState.Betting)
            if (loading) {
                setLoading(false)
            }
        })
    }

    // Moves to post match, getting necessary data
    function stateToPostMatch(matchId: number, entrants: {victor: number, loser: number}) {
        if (pageContents?.type === PostMatch) {
            console.log('Not updating state')
            return
        }

        console.log('Changing state to: PostMatch')
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
                handleContinue={game.isAdmin ? handleContinue : undefined}
            />

            setUserBal(response.balance)
            setPageContents(pageElem)
            setCurrState(GameplayState.PostMatch)
            if (loading) {
                setLoading(false)
            }
        })
    }

    function stateToGameComplete(entrant: number) {
        if (pageContents?.type === GameComplete) {
            console.log('Not updating state')
            return
        }

        const pageElem = <GameComplete entrantId={entrant} />

        setPageContents(pageElem)
        setCurrState(GameplayState.Complete)
    }

    // ---- BODY ----
    return (
        <div className={'w-screen h-screen flex flex-col justify-center items-center'}>
            {/*<p className='absolute top-12 left-2'>User bal: {userBal}</p>*/}
            {pageContents}
        </div>
    )
}