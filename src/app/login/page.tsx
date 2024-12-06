import StateManager from "./StateManager";
import {login, register} from "@/scripts/user.ts";
import {redirect} from "next/navigation";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "DDW | Login",
};

export interface LoginData {
    action: string,
    password: string,
    username?: string,
    email?: string,
}

export default function LoginPage() {

    async function handleLogin(data: LoginData) {
        'use server'

        if (data.action === "login" && data.email) {
            const response = await login(data.email, data.password)

            console.log('Successfully logged in with response:', response)

            if (response) redirect('/home')
        }
        else if (data.action === "register" && data.username && data.email) {
            const response = await register(data.username, data.email, data.password)
            console.log('Successfully logged in with response:', response)
        }
    }

    return (
        <>
            <h1 className='absolute m-6 font-[family-name:var(--font-geist-mono)] text-4xl'>D0GG33-D0G-W0RLD</h1>
            <StateManager handleData={handleLogin} />
        </>
    );
}
