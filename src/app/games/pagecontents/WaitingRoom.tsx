import Button from "@/app/components/button.tsx";

/**
 * Page content when user is waiting for game to start. Displays 'Start Game' button when the user is the game admin.
 *
 * @param handleStart - the function to call on game start
 * @constructor
 */
const WaitingRoom = ({
                         handleStart
                     }: {
    handleStart?: () => void,
}) => {

    return (
        <div className='flex flex-col items-center justify-center'>
            {/*<JumpyDog/>*/}
            <p>Waiting...</p>
            {handleStart && <Button text={'Start Game'} onClick={handleStart} className='m-6'/>}
        </div>
    )
}

export default WaitingRoom