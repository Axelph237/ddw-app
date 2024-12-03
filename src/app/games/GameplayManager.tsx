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
    getBalance,
    placeBet
} from "@/scripts/gameplay.ts";
import {getCurrentGame, startGame} from "@/scripts/game.ts";
import Loading from "@/app/games/pagecontents/Loading.tsx";
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
    // const [prevMatch, setPrevMatch] = useState<number | null>(null)
    // const [currMatch, setCurrMatch] = useState<number | null>(null)
    // const [prevRound, setPrevRound] = useState<number | null>(null)
    // const [currRound, setCurrRound] = useState<number | null>(null)
    // const [prevEntrants, setPrevEntrants] = useState<{winner: Entrant, loser: Entrant} | null>(null)
    // const [currEntrants, setCurrEntrants] = useState<{entrantOne: Entrant, entrantTwo: Entrant} | null>(null)
    // const [prevBal, setPrevBal] = useState<number>(0)
    const [userBal, setUserBal] = useState<number>(0)

    // ---- STATE INITIALIZE ----
    // Get initial page content state
    // function initState() {
    //     console.log('Initializing state...')
    //     getCurrentRound(game.id).then(async (round) => {
    //         console.log('Initializing state: round:', round)
    //
    //         // No current round
    //         if (!round.round_id) {
    //             console.log('Initializing state: no round found')
    //             const userEntrant = await getUserEntrant(game.id)
    //
    //             // Move to waiting room if already created a character
    //             // and character creation if not
    //             if (userEntrant.created) {
    //                 setCurrState(GameplayState.WaitingRoom)
    //             }
    //             else {
    //                 setCurrState(GameplayState.CharacterCreation)
    //             }
    //         }
    //         // Current round
    //         else {
    //             console.log('Initializing state: round found! getting match...')
    //             // Set round and match data
    //             const match = await getCurrentMatch(round.round_id)
    //
    //             console.log('Initializing state: match:', match)
    //             setCurrMatch(match.match_id)
    //             setCurrRound(round.round_id)
    //         }
    //     })
    // }

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

    // const handleNewMatch = () => {
    //     continueGame(game.id).then(response => console.log('Game continued with response:', response))
    // }

    const handleBet = (matchId: number, entrantId: number, amount: number) => {
        const placementId = Math.floor(Math.random() * (10**9)) // Random number 1-1,000,000,000

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
        // round update tick
        // only handles round update
        // const roundIntervalID = setInterval(() => {
        //     if (game.id) {
        //         getCurrentRound(game.id).then(response => {
        //             // Exit if no update needed
        //             if (response.round_id == currRound) return;
        //
        //             // Update round
        //             if (response.round_id && response.round_id != currRound) {
        //                 setPrevRound(currRound) // Document last round
        //                 setCurrRound(response.round_id)
        //             }
        //             else setCurrRound(null)
        //         })
        //     }
        // }, updateDelay)
        //
        // // match update tick
        // // only handles match update
        // const matchIntervalID = setInterval(() => {
        //     if (currRound) {
        //         getCurrentMatch(currRound).then(response => {
        //             // Exit if no update needed
        //             if (response.match_id == currRound) return;
        //
        //             // Update match
        //             if (response.match_id && response.match_id != currMatch) {
        //                 setPrevMatch(currMatch) // Document last match
        //                 setCurrMatch(response.match_id)
        //             }
        //             else setCurrMatch(null)
        //         })
        //     }
        // }, updateDelay)

        const updateLoop = () => {
            console.log('Updating...')
            getCurrentGame().then(game => {
                if (!game) {
                    redirect('/home')
                }

                if (game.active_round) { // Game started
                    if (game.active_match) { // There is a running match
                        console.log('There is an active match')
                        stateToBetting(game.active_match,
                            {one: game.active_entrant_one, two: game.active_entrant_two})
                    }
                    else if (game.last_match) { // No running match, but previous match
                        console.log('There is not active match')
                        stateToPostMatch(game.last_match,
                            {victor: game.last_victor, loser: game.last_loser})
                    }
                    else { // No match has been started
                        // ... nothing ...
                    }
                }
                else { // Game not started
                    console.log('Game is in lobby')
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

    // Triggers on round update
    // useEffect(() => {
    //     // Game started
    //     if (prevRound == null && currRound != null) {
    //
    //     }
    //     // Game ended
    //     else if (prevRound != null && currRound == null && prevMatch) {
    //         setLoading(true)
    //
    //         getMatchResults(prevMatch).then(async response => {
    //             const winner = await getEntrant(response.winner)
    //             const loser = await getEntrant(response.loser)
    //
    //             setPrevEntrants({winner, loser})
    //             setCurrEntrants(null)
    //             setLoading(false)
    //             setCurrState(GameplayState.Complete)
    //         })
    //     }
    // }, [currRound])

    // Triggers on match updates
    // Handles state movement
    // useEffect(() => { // On match update
    //     // Match in empty state
    //     console.log('Match updated: currMatch: ' + currMatch + ' | prevMatch: ' + prevMatch)
    //     if (!currMatch) {
    //         console.log('Match updated: no match found')
    //         // State either character create or waiting room
    //         // if (currState != GameplayState.Complete) {
    //         //     setLoading(true)
    //         //     getUserEntrant(game.id).then(async (response) => {
    //         //         setLoading(false)
    //         //         if (response.created) {
    //         //             setCurrState(GameplayState.WaitingRoom)
    //         //         }
    //         //         else {
    //         //             setCurrState(GameplayState.CharacterCreation)
    //         //         }
    //         //     })
    //         // }
    //         return
    //     }
    //     // Move to Betting
    //     else if (currMatch == prevMatch && currState !== GameplayState.Betting) {
    //         console.log('Match updated: moving to betting')
    //         setLoading(true)
    //
    //         getMatchData(currMatch).then(async (response) => {
    //             const entrantOne = await getEntrant(response.entrant_one)
    //             const entrantTwo = await getEntrant(response.entrant_two)
    //
    //             setCurrEntrants({entrantOne, entrantTwo})
    //             setLoading(false)
    //             setCurrState(GameplayState.Betting)
    //         })
    //     }
    //     // Move to PostMatch if defined
    //     else if (prevMatch) {
    //         console.log('Match updated: moving to post match')
    //         setLoading(true)
    //
    //         getMatchResults(prevMatch).then(async (response) => {
    //             const winner = await getEntrant(response.winner)
    //             const loser = await getEntrant(response.loser)
    //             setPrevEntrants({winner, loser})
    //
    //             const newBal = await getBalance(game.id)
    //             setPrevBal(userBal)
    //             setUserBal(newBal)
    //
    //             setLoading(false)
    //             setCurrState(GameplayState.PostMatch)
    //         })
    //     }
    //     else {
    //         console.log('Match updated: all previous conditions failed')
    //     }
    // }, [currMatch])

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
                deltaBal={response.balance - userBal}
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

    // ---- PAGE CONTENT LOGIC ----
    // function getPageContents(state: GameplayState | undefined) {
    //     if (state === undefined) {
    //         return <Loading />
    //     }
    //
    //     // Get specific page contents based on state
    //     let pageContents;
    //     switch (state) {
    //         case GameplayState.CharacterCreation:
    //             pageContents = (
    //                 <>
    //                     <CharacterCreation // Make actual updated values
    //                         handleCreate={handleCharacterCreate}
    //                     />
    //                     {errDisplay}
    //                 </>
    //             )
    //             break;
    //         case GameplayState.WaitingRoom:
    //             pageContents = <WaitingRoom handleStart={game.isAdmin ? handleStart : undefined}/>
    //             break;
    //         case GameplayState.Betting:
    //             pageContents = <Betting
    //                 entrantOne={currEntrants?.entrantOne}
    //                 entrantTwo={currEntrants?.entrantOne}
    //                 userBal={userBal}
    //                 matchId={42}
    //                 handleBet={handleBet}
    //                 handleContinue={game.isAdmin ? handleContinue : undefined}
    //             />
    //             break;
    //         case GameplayState.PostMatch:
    //             pageContents = <PostMatch // Make actual updated values
    //                 winner={prevEntrants?.winner}
    //                 loser={prevEntrants?.loser}
    //                 newBal={userBal}
    //                 prevBal={prevBal}
    //                 matchId={prevMatch}
    //                 handleContinue={game.isAdmin ? handleNextMatch : undefined}
    //             />
    //             break;
    //         case GameplayState.Complete:
    //             if (prevEntrants?.winner.id) {
    //                 pageContents = <GameComplete
    //                     entrantId={prevEntrants.winner.id}
    //                 />
    //             }
    //             break;
    //     }
    //     // Overwrite page if the state is loading
    //     if (loading) {
    //         pageContents = <Loading />
    //     }
    //
    //     return pageContents
    // }

    // ---- BODY ----
    return (
        <div className={'w-screen h-screen flex flex-col justify-center items-center'}>
            {/*<p className='absolute top-12 left-2'>User bal: {userBal}</p>*/}
            {/*<div className={`${loading ? 'block' : 'hidden'} w-screen h-screen flex flex-col justify-center items-center`}>*/}
            {/*    <Loading />*/}
            {/*</div>*/}
            {pageContents}
        </div>
    )
}