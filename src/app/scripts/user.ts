'use server'

import { setSession, clearSession } from "@/scripts/session";
import fetchWithAuth from "@/scripts/fetchWithAuth.ts";
import {redirect} from "next/navigation";

const USERS_URL = process.env.NEXT_PUBLIC_API_URL + '/users';

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

// Logs user in, returning their session token and uuid
export async function login(email: string, password: string) {
    try {
        console.log('Attempting login on URL:', USERS_URL)
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
    redirect('/login')
}

/**
 * Gets the current user's details
 */
export async function getMe() {
    try {
        const response = await fetchWithAuth(USERS_URL + '/me', {
            method: 'GET',
        });

        return await response.json();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}