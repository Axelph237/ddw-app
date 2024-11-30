import Button from "@/app/components/button.tsx";
import {createEntrant} from "@/scripts/entrants.ts";


export default async function TestPage() { 'use server'

    const handleCreate = async () => { 'use server'
        const name = 'Hitler'
        const weapon = 'dummy'

        const response = await createEntrant({name, weapon})

        if (!response) {
            return // Early failure if undefined response
        }

        const body = await response.json()

        if (response.ok) {
            console.log('Entrant created with returning data:', body)
        }
        else if (body.detail.toString().toLowerCase().includes('inappropriate')) {
            // Inappropriate words were passed to character creation
            console.log('Why you putting naughty words in there?')
        }
        else if (body.detail.toString().toLowerCase().includes('failed to create')) {
            // User likely already made an entrant
            console.log('You probably already made something!')
        }
        else {
            console.log('Entrant creation failed with details:', body.detail)
        }
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