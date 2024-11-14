import StateManager from "./StateManager";
import {login, register} from "@/scripts/user.ts";

export interface LoginData {
    action: string,
    password: string,
    username?: string,
    email?: string,
}

export default function LoginPage() {

    async function handleLogin(data: LoginData) {
        if (data.action === "login") {
            if (data.email)
                login(data.email, data.password).then(response => console.log("Logged in with response:", response))
        }
        else if (data.action === "register") {
            if (data.username && data.email)
                register(data.username, data.email, data.password).then(response => {
                    console.log("Signed in with response:", response);
                    login(data.email, data.password).then(response => console.log("Logged in with response:", response));
                })
        }
    }

    return (
        <>
            <h1 className='absolute m-6 font-[family-name:var(--font-geist-mono)] text-4xl'>D0GG33-D0G-W0RLD</h1>
            <StateManager handleData={handleLogin} />
        </>
    );
}
