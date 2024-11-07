'use client';
import {FormEventHandler} from "react";
import Button from "@/app/components/button";

export default function LogIn() {
    const handleSubmit = () => {

    }

    return (
        <form id="login-form" className="flex flex-col justify-center items-center" onSubmit={handleSubmit}>
            <input id="login-username" type="text" placeholder="Username" className="hover:border-emerald-500"/>
            <input id="login-password" type="text" placeholder="Password" className="hover:border-emerald-500"/>
            <Button onClick={() => console.log("Clicked!")} className="w-46 h-46" text="Enter the fight!"/>
        </form>
    )
}