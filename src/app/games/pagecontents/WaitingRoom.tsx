import Button from "@/app/components/button.tsx";
import Loading from "@/app/games/pagecontents/Loading.tsx";

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
            <p className='text-3xl font-[family-name:var(--font-geist-mono)]'>{handleStart ? 'Start the game when ready!' : 'Waiting'}</p>
            {!handleStart && <Loading/>}
            {handleStart && <Button text={'Start Game'} onClick={handleStart} className='m-6'/>}
        </div>
    )
}

export default WaitingRoom