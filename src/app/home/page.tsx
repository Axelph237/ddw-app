import Button from "@/app/components/button.tsx";

export default async function HomePage() {

    async function doNothing() {
        'use server'

        console.log('Herro! :3')
    }

    return (
        <div className='font-[family-name:var(--font-geist-sans)] bg-gradient-to-t from-transparent to-black to-80% w-screen h-screen flex flex-col items-center justify-center'>
            <h2 className='font-[family-name:var(--font-geist-sans)] text-2xl'>welcome to</h2>
            <h1 className='mb-3 mt-1 font-[family-name:var(--font-geist-mono)] text-4xl'>DOGGEE-DOG-WORLD</h1>
            <Button onClick={doNothing} text='Create Game' className='m-3'/>
            <Button onClick={doNothing} text='Join Game' className='m-3' />
        </div>
    )
}