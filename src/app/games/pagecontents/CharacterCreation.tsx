import {Entrant} from "@/scripts/entrants.ts";
import {useRef, useState} from "react";
import Limitedinput, {LimitedInputHandle} from "@/app/components/limitedinput.tsx";
import Button from "@/app/components/button.tsx";

/**
 * Page content when user is creating a character
 *
 * @param handleCreate - the function to call to handle character creation
 * @constructor
 */
const CharacterCreation = ({
                               handleCreate
                           }: {
    handleCreate: (entrant: Entrant) => void
}) => {
    const [errMsg, setErrMsg] = useState('');
    const nameInputRef = useRef<LimitedInputHandle>(null)
    const weaponInputRef = useRef<LimitedInputHandle>(null)

    const handleClick = () => {
        const nameInput = nameInputRef.current
        const weaponInput = weaponInputRef.current

        if (!nameInput || !weaponInput) return // Return if elements are lost

        console.log('Creating character', nameInput.value, weaponInput.value)
        console.log('Name valid?:', nameInput.validInput)
        console.log('Weapon valid?:', weaponInput.validInput)

        if (nameInput.validInput && weaponInput.validInput && nameInput.value.length > 0 && weaponInput.value.length > 0)  {
            handleCreate({name: nameInput.value, weapon: weaponInput.value});
        }
        else if (!nameInput.validInput || !weaponInput.validInput) {
            setErrMsg('Woahhh slow down! Those are some pretty big pieces of text.')
        }
        else {
            setErrMsg('An empty entrant is no entrant :/')
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1 className="text-3xl font-[family-name:var(--font-geist-mono)]">Name Your Challenger!</h1>

            <Limitedinput maxChars={50} id='character-name' type='text' placeholder='Character New Name' ref={nameInputRef}/>
            <Limitedinput maxChars={50} id='character-weapon' type='text' placeholder='Character Weepon' ref={weaponInputRef}/>

            {/* Character Creation Button*/}
            <Button text={'Create Entrant'} onClick={handleClick}/>
            <p className='h-0'>{errMsg}</p>
        </div>
    )
}

export default CharacterCreation