const USERS_URL = process.env.NEXT_PUBLIC_API_URL + '/users'

export async function register(username: string, email: string, password: string) {
    try {
        const response = await fetch(USERS_URL + '/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"  // Tells the server to expect JSON
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        console.log(error)
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await fetch(USERS_URL + '/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"  // Tells the server to expect JSON
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        console.log(error)
    }
}