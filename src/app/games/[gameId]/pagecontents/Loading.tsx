import {useEffect} from "react";
import lottie from "lottie-web";
import load from '@/public/load.json'


export default function Loading() {
    useEffect(() => {
        const loadElem = document.querySelector("#load-icon")

        if (!loadElem) throw ReferenceError('Could not find load element');

        lottie.loadAnimation({
            animationData: load,
            autoplay: true,
            container: loadElem,
            loop: true,
        });
    }, []);
    return (
        <div className='flex flex-row items-center justify-center w-screen h-screen'>
            <div className='w-64 h-64' id='load-icon'></div>
        </div>
    )
}