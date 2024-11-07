'use client';

import Button from "@/app/components/button";
import {register} from "@/scripts/users.ts";

export default function SignUp() {
    const handleSubmit = () => {
        const username = (document.getElementById('signup-username') as HTMLInputElement).value
        const email = (document.getElementById('signup-email') as HTMLInputElement).value
        const password = (document.getElementById('signup-password') as HTMLInputElement).value

        register(username, email, password).then(response => {
            console.log("Signed in with response:", response)
        })
    }

    return (
        <form id="signup-form" className="flex flex-col justify-center items-center">
            <input id="signup-username" type="text" placeholder="Username" className="hover:border-emerald-500"/>
            <input id="signup-email" type="text" placeholder="Email" className="hover:border-emerald-500"/>
            <input id="signup-password" type="password" placeholder="Password" className="hover:border-emerald-500"/>
            <Button onClick={handleSubmit} className="w-46 h-46" text="Create Account"/>
        </form>
    )
}