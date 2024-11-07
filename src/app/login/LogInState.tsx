'use client';

import Button from "@/app/components/button";
import {login} from "@/scripts/user.ts";

export default function LogIn() {
    const handleSubmit = () => {
        const email = (document.getElementById('login-email') as HTMLInputElement).value
        const password = (document.getElementById('login-password') as HTMLInputElement).value

        login(email, password).then(response => {
            console.log("Logged in with response:", response)
        })
    }

    return (
        <form id="login-form" className="flex flex-col justify-center items-center">
            <input id="login-email" type="text" placeholder="Email" className="hover:border-emerald-500"/>
            <input id="login-password" type="password" placeholder="Password" className="hover:border-emerald-500"/>
            <Button onClick={handleSubmit} className="w-46 h-46" text="Enter the fight!"/>
        </form>
    )
}