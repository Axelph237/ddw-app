'use client';

import Image from "next/image";
import Button from "@/app/components/button.tsx";
import steve from '@/public/steve_image.png'
import walter from '@/public/walter_image.png'
import './games/pagecontents/Betting.css'
import {redirect} from "next/navigation";

export default function Home() {
  const handleLogin = () => {
      redirect('/login')
  }

  return (
      <div className='font-[family-name:var(--font-geist-mono)]'>
            {/* Header */}
            <div
                className='absolute flex flex-row justify-around items-center top-0 left-0 w-screen h-16 p-2 border-b-white border-transparent border-b-white border-2'>
            <p className='text-white text-xl rounded p-1'>D0GG33-D0G-W0RLD</p>
            <Button text='Login' onClick={handleLogin}/>
            </div>
            <div className='h-16'></div> {/* Header ghost */}

          <div className='w-screen flex flex-col items-center justify-center p-6'>
              <h1 className='text-7xl'>Place Your BETS</h1>
          </div>
          {/* Entrant example div */}
          <div className='w-screen flex flex-row items-center justify-center p-6'>

              <div className='flex flex-col items-center justify-center'>
                  <div className='w-44 h-44 rounded-full overflow-hidden object-cover m-4'>
                      <Image src={walter} alt={'Walter White with a fork'}/>
                  </div>
                  <p className='entrant-name'>Walter White</p>
                  <p className='entrant-weapon'>With a fork</p>
              </div>

              <div className='flex flex-col items-center justify-center'>
                  <div className='w-44 h-44 rounded-full overflow-hidden object-cover m-4'>
                      <Image src={steve} alt={'Steve with a gun'}/>
                  </div>
                  <p className='entrant-name'>Steve</p>
                  <p className='entrant-weapon'>With a gun</p>
              </div>


          </div>
      </div>
  );
}
