'use client';

import {useState} from "react";
import Button from "@/app/components/button.tsx";
import { LoginData } from "./serverFunctions.ts"

export default function StateManager({ handleData }: Readonly<{ handleData: Function }>) {
    const [loggingIn, setLoggingIn] = useState<boolean>(false);

    const handleClick = () => {
        setLoggingIn(!loggingIn)
    }

    const handleSubmit = () => {
        const username: string | null = (document.querySelector('.username-input') as HTMLInputElement)?.value
        const email: string | null = (document.querySelector('.email-input') as HTMLInputElement)?.value
        const password = (document.querySelector('.password-input') as HTMLInputElement).value

        const data: LoginData = {username, email, password, action: loggingIn ? "login" : "register"}

        // Pass data up to parent
        handleData(data)
    }
    return (
        <div
            className=' font-[family-name:var(--font-geist-sans)] bg-gradient-to-t from-emerald-950 to-transparent w-screen h-screen flex flex-col items-center justify-center'>
            <h1 className="text-3xl font-[family-name:var(--font-geist-mono)]">{loggingIn ? "Log In" : "Sign Up"}</h1>
            <form id="loginpage-form" className="flex flex-col justify-center items-center">
                {loggingIn ? <LogInState/> : <SignUpState/>}
            </form>
            <Button onClick={handleSubmit} className="w-46 h-46" text="Enter the fight!"/>
            <p className="underline cursor-pointer font-[family-name:var(--font-geist-mono)]" onClick={() => {
                handleClick()
            }}>{loggingIn ? "Sign Up" : "Log In"}</p>
        </div>
    )
}

function LogInState() {
    return (
        <>
            <input id="login-email" type="text" placeholder="Email" className="email-input hover:border-emerald-500"/>
            <input id="login-password" type="password" placeholder="Password" className="password-input hover:border-emerald-500"/>
        </>
    )
}

function SignUpState() {
    return (
        <>
            <input id="signup-username" type="text" placeholder="Username" className="username-input hover:border-emerald-500"/>
            <input id="signup-email" type="text" placeholder="Email" className="email-input hover:border-emerald-500"/>
            <input id="signup-password" type="password" placeholder="Password" className="password-input hover:border-emerald-500"/>
        </>
    )
}