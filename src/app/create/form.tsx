import Button from "@/app/components/button.tsx";

export default function CreateForm() {

    async function handleSubmit() {
        console.log('Creation received! (but nothing was done :3)')
    }

    return (
        <form id='create-game-form'>
            <input id="signup-username" type="text" placeholder="Username" className="hover:border-emerald-500"/>
            <input id="signup-email" type="text" placeholder="Email" className="hover:border-emerald-500"/>
            <input id="signup-password" type="password" placeholder="Password" className="hover:border-emerald-500"/>
            <Button onClick={handleSubmit} className="w-46 h-46" text="Create Account"/>
        </form>
    )
}