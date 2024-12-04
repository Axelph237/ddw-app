'use client'

// import Button from "@/app/components/button.tsx";
// import {createEntrant} from "@/scripts/entrants.ts";
// import './shimmer-text.css'
import Loading from "@/app/games/pagecontents/Loading.tsx";


export default function TestPage() {


    return (
        <div className={'flex flex-col items-center justify-center h-screen w-screen'}>
            <TestClient/>
        </div>
    )
}

function TestClient() {



    return (
        <>
            <p className='text-3xl text-white'>Waiting</p>
            <Loading/>
        </>
    )
}