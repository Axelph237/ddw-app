'use client'

import {useEffect, useState} from "react";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import {createEntrant, getEntrant, getUserEntrant} from "@/scripts/entrants.ts";
import {Entrant} from "@/scripts/entrants.ts";
// Page content components
import Betting from "@/app/games/[gameId]/pagecontents/Betting.tsx";
import WaitingRoom from "@/app/games/[gameId]/pagecontents/WaitingRoom.tsx";
import CharacterCreation from "@/app/games/[gameId]/pagecontents/CharacterCreation.tsx";
import PostMatch from "@/app/games/[gameId]/pagecontents/PostMatch.tsx";
import {
    continueGame,
    getBalance,
    getCurrentMatch,
    getCurrentRound, getMatchData,
    getMatchResults,
    placeBet
} from "@/scripts/gameplay.ts";
import {startGame} from "@/scripts/game.ts";
import Loading from "@/app/games/[gameId]/pagecontents/Loading.tsx";
import GameComplete from "@/app/games/[gameId]/pagecontents/GameComplete.tsx";

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
export default function GameplayManager({game}:{game:{id: number, isAdmin: boolean, inLobby: boolean}}) {
    // ---- STATE VARIABLES ----
    // State for current page display
    const [currState, setCurrState] = useState<GameplayState | undefined>(undefined);
    const [loading, setLoading] = useState(false)
    // General error message display
    const [errMsg, setErrMsg] = useState('')
    const errDisplay = (errMsg != '' && <p className={'m-1'}>{errMsg}</p>)
    // User and game details
    const [prevMatch, setPrevMatch] = useState<number | null>(null)
    const [currMatch, setCurrMatch] = useState<number | null>(null)
    const [prevRound, setPrevRound] = useState<number | null>(null)
    const [currRound, setCurrRound] = useState<number | null>(null)
    const [prevEntrants, setPrevEntrants] = useState<{winner: Entrant, loser: Entrant} | null>(null)
    const [currEntrants, setCurrEntrants] = useState<{entrantOne: Entrant, entrantTwo: Entrant} | null>(null)
    const [prevBal, setPrevBal] = useState<number>(0)
    const [userBal, setUserBal] = useState<number>(0)

    // ---- STATE INITIALIZE ----
    // Get initial page content state
    function initState() {
        getCurrentRound(game.id).then(async (round) => {

            // No current round
            if (!round.round_id) {
                const userEntrant = await getUserEntrant(game.id)

                // Move to waiting room if already created a character
                // and character creation if not
                if (userEntrant.created) {
                    setCurrState(GameplayState.WaitingRoom)
                }
                else {
                    setCurrState(GameplayState.CharacterCreation)
                }
            }
            // Current round
            else {
                // Set round and match data
                const match = await getCurrentMatch(round.round_id)

                setCurrMatch(match.match_id)
                setCurrRound(round.round_id)
            }
        })
    }

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
        startGame(game.id).then(response => console.log('Game started with response:', response))
    }

    // Runs async continueGame function
    const handleContinue = () => {
        continueGame(game.id).then(response => console.log('Game continued with response:', response))
    }

    const handleNextMatch = () => {
        setPrevMatch(currMatch) // Move to next betting phase
    }

    const handleBet = (entrantId: number, amount: number) => {
        if (!currMatch) throw TypeError('Current match is null')

        const placementId = Math.floor(Math.random() * (10**9)) // Random number 1-1,000,000,000

        placeBet(placementId, {
            matchId: currMatch,
            entrantId: entrantId,
            amount: amount
        }).then(response => console.log('Bet placed with response:', response))
    }

    // ---- RERENDER EVENTS ----
    // Initializes component
    useEffect(() => {
        const updateDelay = 2000
        // round update tick
        // only handles round update
        const roundIntervalID = setInterval(() => {
            if (game.id) {
                getCurrentRound(game.id).then(response => {
                    // Exit if no update needed
                    if (response.round_id == currRound) return;

                    // Update round
                    if (response.round_id && response.round_id != currRound) {
                        setPrevRound(currRound) // Document last round
                        setCurrRound(response.round_id)
                    }
                    else setCurrRound(null)
                })
            }
        }, updateDelay)

        // match update tick
        // only handles match update
        const matchIntervalID = setInterval(() => {
            if (currRound) {
                getCurrentMatch(currRound).then(response => {
                    // Exit if no update needed
                    if (response.match_id == currRound) return;

                    // Update match
                    if (response.match_id && response.match_id != currMatch) {
                        setPrevMatch(currMatch) // Document last match
                        setCurrMatch(response.match_id)
                    }
                    else setCurrMatch(null)
                })
            }
        }, updateDelay)

        // Set initial balance
        getBalance(game.id).then(response => setUserBal(response.balance))

        initState()

        return () => {
            clearInterval(roundIntervalID)
            clearInterval(matchIntervalID)
        }
    }, [])

    // Triggers on round update
    useEffect(() => {
        // Game started
        if (prevRound == null && currRound != null) {

        }
        // Game ended
        else if (prevRound != null && currRound == null && prevMatch) {
            setLoading(true)

            getMatchResults(prevMatch).then(async response => {
                const winner = await getEntrant(response.winner)
                const loser = await getEntrant(response.loser)

                setPrevEntrants({winner, loser})
                setCurrEntrants(null)
                setLoading(false)
                setCurrState(GameplayState.Complete)
            })
        }
    }, [currRound])

    // Triggers on match updates
    // Handles state movement
    useEffect(() => { // On match update
        // Match in empty state
        if (!currMatch) {
            // State either character create or waiting room
            if (currState != GameplayState.Complete) {
                setLoading(true)
                getUserEntrant(game.id).then(async (response) => {
                    setLoading(false)
                    if (response.created) {
                        setCurrState(GameplayState.WaitingRoom)
                    }
                    else {
                        setCurrState(GameplayState.CharacterCreation)
                    }
                })
            }
            return
        }
        // Move to Betting
        else if (currMatch == prevMatch && currState !== GameplayState.Betting) {
            setLoading(true)

            getMatchData(currMatch).then(async (response) => {
                const entrantOne = await getEntrant(response.entrant_one)
                const entrantTwo = await getEntrant(response.entrant_two)

                setCurrEntrants({entrantOne, entrantTwo})
                setLoading(false)
                setCurrState(GameplayState.Betting)
            })
        }
        // Move to PostMatch if defined
        else if (prevMatch) {
            setLoading(true)

            getMatchResults(prevMatch).then(async (response) => {
                const winner = await getEntrant(response.winner)
                const loser = await getEntrant(response.loser)
                setPrevEntrants({winner, loser})

                const newBal = await getBalance(game.id)
                setPrevBal(userBal)
                setUserBal(newBal)

                setLoading(false)
                setCurrState(GameplayState.PostMatch)
            })
        }
    }, [currMatch])

    useEffect(() => {
        console.log('Current state:', currState)
    }, [currState])

    // ---- PAGE CONTENT LOGIC ----
    function getPageContents(state: GameplayState | undefined) {
        if (state === undefined) {
            return <Loading />
        }

        // Get specific page contents based on state
        let pageContents;
        switch (state) {
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
                pageContents = <Betting
                    entrantOne={currEntrants?.entrantOne}
                    entrantTwo={currEntrants?.entrantOne}
                    userBal={userBal}
                    matchId={42}
                    handleBet={handleBet}
                    handleContinue={game.isAdmin ? handleContinue : undefined}
                />
                break;
            case GameplayState.PostMatch:
                pageContents = <PostMatch // Make actual updated values
                    winner={prevEntrants?.winner}
                    loser={prevEntrants?.loser}
                    newBal={userBal}
                    prevBal={prevBal}
                    matchId={prevMatch}
                    handleContinue={game.isAdmin ? handleNextMatch : undefined}
                />
                break;
            case GameplayState.Complete:
                if (prevEntrants?.winner.id) {
                    pageContents = <GameComplete
                        entrantId={prevEntrants.winner.id}
                    />
                }
                break;
        }
        // Overwrite page if the state is loading
        if (loading) {
            pageContents = <Loading />
        }

        return pageContents
    }

    // ---- BODY ----
    return (
        <div className={'w-screen h-screen flex flex-col justify-center items-center'}>
            {/*<p className='absolute top-12 left-2'>User bal: {userBal}</p>*/}
            {getPageContents(currState)}
        </div>
    )
}
