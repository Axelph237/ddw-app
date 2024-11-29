'use client'

import {useRef, useState} from "react";
import Button from "@/app/components/button.tsx";
// import JumpyDog from "@/app/components/jumpy/JumpyDog.tsx";
import Limitedinput, {LimitedInputHandle} from "@/app/components/limitedinput.tsx";
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
export default function GameplayManager() {
    const [currState, setCurrState] = useState(GameplayState.PostMatch);
    const [userBal, setUserBal] = useState<number>(4000);

    const handleCharacterCreate = (entrant: Entrant) => {
        setCurrState(GameplayState.WaitingRoom);

        createEntrant(entrant).then(response => {
            console.log('Character created with response:', response)
        })
    }

    let pageContents;
    switch (currState) {
        case GameplayState.CharacterCreation:
            pageContents = <CharacterCreation // Make actual updated values
                handleCreate={handleCharacterCreate}
            />
            break;
        case GameplayState.WaitingRoom:
            pageContents = <WaitingRoom // Make actual updated values
                handleStart={() => console.log('Did nothing :D')}
            />
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
                story={'In the center of the Squarish Undersea arena, Spongeborg squared off against his opponent: Adam Sandler, wielding the mighty Philosophy. The audience, a mix of sea creatures and strange mechanical beings, watched in hushed anticipation.\n' +
                    '\n' +
                    'Adam Sandler raised his weapon, a glowing tome filled with endless words of abstract thought. He swung it high, chanting in a low, serious voice, "To be or not to be, that is the question!" The very air around them shimmered with confusion as deep, existential questions filled the space, disorienting Spongeborg.\n' +
                    '\n' +
                    'But Spongeborg wasn’t fooled. With a quick, robotic flick, he activated his Absorb-O-Matic—a feature that turned the confusing waves of philosophical musings into pure, focused energy. The words of Philosophy were absorbed by his sponge-like body, growing brighter and more powerful as he did so.\n' +
                    '\n' +
                    'With a mechanical grin, Spongeborg rushed forward, his limbs extending like spring-loaded fists. “Your philosophy is weak, Adam,” he said, as he swiped a large metal hand through the air.\n' +
                    '\n' +
                    'Adam Sandler, now surrounded by a whirlwind of abstract thought, attempted to dodge, but his weapon was too slow. He stumbled, trying to focus on his own deep questions, but it was too late.\n' +
                    '\n' +
                    'With a final move, Spongeborg launched himself at Adam, delivering a swift, spinning Spin-Turn-Punch. Adam staggered back, his glowing Philosophy tome falling from his grasp, and with a dramatic tumble, he collapsed into the sand.\n' +
                    '\n' +
                    'Spongeborg stood victorious, his mechanical body humming with the power of a thousand absorbed philosophies. “Sometimes, the simplest answer is the best,” he said, brushing off his sponge-like surface.\n' +
                    '\n' +
                    'And so, the battle ended, with Spatubob—Spongeborg’s trusty sidekick—cheering from the sidelines.'}
                handleContinue={() => ''} // Make only visible when someone is admin
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