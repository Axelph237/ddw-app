'use client';

import LogIn from "@/app/login/LogInState.tsx";
import SignUp from "@/app/login/SignUpState.tsx";
import {useState} from "react";

export default function StateManager() {
    const [loggingIn, setLoggingIn] = useState<boolean>(false);

    const handleClick = () => {
        setLoggingIn(!loggingIn)
    }
    return (
        <div
            className=' font-[family-name:var(--font-geist-sans)] bg-gradient-to-t from-emerald-950 to-transparent w-screen h-screen flex flex-col items-center justify-center'>
            <h1 className="text-3xl font-[family-name:var(--font-geist-mono)]">{loggingIn ? "Log In" : "Sign Up"}</h1>
            {loggingIn ? <LogIn/> : <SignUp/>}
            <p className="underline cursor-pointer font-[family-name:var(--font-geist-mono)]" onClick={() => {
                handleClick()
            }}>{loggingIn ? "Sign Up" : "Log In"}</p>
        </div>
    )
}