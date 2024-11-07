'use client';
import {FormEventHandler} from "react";
import Button from "@/app/components/button";

export default function SignUp() {
    const handleSubmit = () => {

    }

    return (
        <form id="signup-form" className="flex flex-col justify-center items-center" onSubmit={handleSubmit}>
            <input id="signup-username" type="text" placeholder="Username" className="hover:border-emerald-500"/>
            <input id="signup-email" type="text" placeholder="Email" className="hover:border-emerald-500"/>
            <input id="signup-password" type="text" placeholder="Password" className="hover:border-emerald-500"/>
            <Button onClick={() => console.log("Clicked!")} className="w-46 h-46" text="Create Account"/>
        </form>
    )
}