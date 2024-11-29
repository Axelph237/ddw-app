import { setSession, clearSession } from "@/scripts/session";

const USERS_URL = process.env.NEXT_PUBLIC_API_URL + '/users';
export let SESSION_INFO: JSON | undefined = undefined;

// Registers the user, responding with a success message and uuid
export async function register(username: string, email: string, password: string) {
    try {
        const response = await fetch(USERS_URL + '/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password }),
        });
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        return await response.json();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Logs user in, returning their session token and uuid
export async function login(email: string, password: string) {
    try {
        const response = await fetch(USERS_URL + '/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        const sessionData = {
            accessToken: json.access_token,
            tokenType: json.token_type,
            userId: json.user_id
        };
        
        await setSession(sessionData);
        return json;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function logout() {
    await clearSession();
    window.location.href = '/login';
}