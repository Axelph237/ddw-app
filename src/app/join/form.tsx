import Button from "@/app/components/button.tsx";

export default function JoinForm() {

    async function handleSubmit() {
        console.log('Submission successful! (but I forgor :<)')
    }

    return (
        <form id='join-game-form'>
            <input id="signup-username" type="text" placeholder="Username" className="hover:border-emerald-500"/>
            <input id="signup-email" type="text" placeholder="Email" className="hover:border-emerald-500"/>
            <input id="signup-password" type="password" placeholder="Password" className="hover:border-emerald-500"/>
            <Button onClick={handleSubmit} className="w-46 h-46" text="Create Account"/>
        </form>
    )
}