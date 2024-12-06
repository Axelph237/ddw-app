import {Entrant} from "@/scripts/entrants.ts";
import {useRef, useState} from "react";
import Limitedinput, {LimitedInputHandle} from "@/app/components/limitedinput.tsx";
import Button from "@/app/components/button.tsx";
import Loading from "@/app/games/pagecontents/Loading.tsx";
import {dispatchError} from "@/app/components/erroralert/erroralert.tsx";

/**
 * Page content when user is creating a character
 *
 * @param handleCreate - the function to call to handle character creation
 * @constructor
 */
const CharacterCreation = ({
                               handleCreate
                           }: {
    handleCreate: (entrant: Entrant, onErr: () => void) => void,
}) => {
    const [uploaded, setUploaded] = useState(false)
    const nameInputRef = useRef<LimitedInputHandle>(null)
    const weaponInputRef = useRef<LimitedInputHandle>(null)

    const handleClick = () => {
        const nameInput = nameInputRef.current
        const weaponInput = weaponInputRef.current

        if (!nameInput || !weaponInput) return // Return if elements are lost

        if (nameInput.validInput && weaponInput.validInput && nameInput.value.length > 0 && weaponInput.value.length > 0)  {
            setUploaded(true)
            handleCreate({name: nameInput.value, weapon: weaponInput.value}, () => setUploaded(false));
        }
        else if (!nameInput.validInput || !weaponInput.validInput) {
            dispatchError('Woahhh slow down! Those are some pretty big pieces of text.')
        }
        else {
            dispatchError('An empty entrant is no entrant :/')
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            {uploaded
                ? <>
                    <p className='text-3xl font-[family-name:var(--font-geist-mono)]'>Uploading Character</p>
                    <Loading />
                </>
                : <>
                    <h1 className="text-3xl font-[family-name:var(--font-geist-mono)]">Name Your Challenger!</h1>

                    <Limitedinput maxChars={50} id='character-name' type='text' placeholder='Character New Name'
                                  ref={nameInputRef}/>
                    <Limitedinput maxChars={50} id='character-weapon' type='text' placeholder='Character Weapon'
                                  ref={weaponInputRef}/>

                    {/* Character Creation Button*/}
                    <Button text={'Create Entrant'} onClick={handleClick}/>
                    {/*<p className='h-0'>{errMsg}</p>*/}
                </>

            }
        </div>
    )
}

export default CharacterCreation