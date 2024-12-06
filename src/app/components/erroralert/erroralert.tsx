'use client'

import {useEffect, useState} from "react";
import './erroralert.css'



export default function ErrorAlert() {
    const [msg, setMsg] = useState('');
    const [opened, setOpened] = useState<boolean>(false);

    const handleError = (e: Event) => {
        // Ensure that msg is correct event type
        // before accessing details
        if (e instanceof CustomEvent) {
            setMsg(e.detail.msg)
            setOpened(true)
        }
    }

    const handleClick = () => {
        setOpened(false)
    }

    useEffect(() => {
        window.addEventListener("alert-error", handleError)

        return () => {
            window.removeEventListener("alert-error", handleError)
        }
    }, [])

    return (
        <div className='alert-container'>
            <div
                className={`${opened ? 'opened' : 'closed'} alert-box gradient w-96 h-64 rounded-3xl grid grid-cols-2 grid-rows-4 p-4 mt-4`}>
                {/* Text section */}
                <div className='alert-text row-span-3 col-span-2 mb-4'>{msg}</div>
                {/* Okay button */}
                <div className='row-span-1 col-span-2 flex flex-row items-center justify-center'>
                    <div className='alert-button pt-2 pb-2 pl-4 pr-4 w-fit rounded-full' onClick={handleClick}>Okay</div>
                </div>
            </div>
        </div>
    )
}

export function dispatchError(msg: string) {
    // Creates new alert-error
    const error = new CustomEvent("alert-error", {
        detail: {
            msg: msg

        }
    });

    // Dispatches the event
    dispatchEvent(error)
}