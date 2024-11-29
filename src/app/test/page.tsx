import Button from "@/app/components/button.tsx";
import {createEntrant} from "@/scripts/entrants.ts";


export default async function TestPage() { 'use server'
    const NAME = 'dummy'
    const WEAPON = 'nothing'

    const handleCreate = async () => { 'use server'
        const response = await createEntrant({name: NAME, weapon: WEAPON})

        if (response) {
            console.log('Entrant created with data:', response.body)
        }
        console.log('Entrant creation FAILED')
    }

    return (
        <div className={'flex flex-col items-center justify-center h-screen w-screen'}>
            <TestClient/>
            <Button onClick={handleCreate} text={'Create dummy entrant'}/>
        </div>
    )
}

function TestClient() { 'use client'



    return (
        <></>
    )
}