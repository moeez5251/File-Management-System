"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Client, Account, ID } from 'appwrite';
import { Loader2 } from "lucide-react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const signup = () => {
    const [inputs, setinputs] = useState({
        name: "",
        email: ""
    })
    const [Truestate, setTruestate] = useState(false)
    const [opening, setopening] = useState(false)
    const [otpvalue, setotpvalue] = useState("")
    const client = new Client().setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
    const account = new Account(client);
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleinputchange = (e) => {
        setinputs({ ...inputs, [e.target.name]: e.target.value })
        if (isValidEmail(inputs.email)) {
            if (document.querySelector(".shadow-changer").classList.contains("shadow-red-300")) {
                document.querySelector(".shadow-changer").classList.remove("shadow-red-300")
            }
        }
        else {
            document.querySelector(".shadow-changer").classList.add("shadow-red-300")
        }
        if (inputs.name.trim() === "") {
            document.querySelector(".name-valid").classList.add("shadow-red-300")
        }
        else {
            if (document.querySelector(".name-valid").classList.contains("shadow-red-300")) {

                document.querySelector(".name-valid").classList.remove("shadow-red-300")
            }
        }
    }
    const handleclick = async () => {
        setopening(true)
        return
        if (!isValidEmail(inputs.email)) return
        if (inputs.name.trim() === "") return
        setTruestate(true)
        const sessionToken = await account.createEmailToken(
            ID.unique(),
            inputs.email
        );
        console.log("email token sent");
        // const userId = sessionToken.userId;
    }
    return (
        <div className='h-[100vh] flex overflow-y-hidden'>
            <div className='bg-[#fa7275] w-1/2 h-full flex  justify-end flex-col items-center gap-16'>
                <Image src="/logo.png" width={170} height={170} alt='Store It logo' />
                <div className='w-4/5 mx-auto text-white flex flex-col gap-6'>

                    <h1 className='font-extrabold text-5xl '>Manage Your Files the best way</h1>
                    <p className='text-lg'>Awesome, we've created the perfect place for you to store all your documents</p>
                </div>

                <Image src="/Dashboard.png" width={250} height={250} alt='Store It image' />
            </div>
            <div className='flex items-start px-12 relative top-10   justify-center flex-col w-1/2 gap-10  '>
                <h1 className='font-bold text-5xl text-gray-800'>Create Account</h1>
                <div className='w-[95%] shadow-2xl name-valid  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                    <Label htmlFor="email">Full Name</Label>
                    <input className="w-[95%] border-none outline-none placeholder:font-semibold" type="text" onChange={handleinputchange} name='name' id="email" value={inputs.name} placeholder="Enter your Full Name" />
                </div>
                <div className='w-[95%] shadow-2xl shadow-changer  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                    <Label htmlFor="email">Email</Label>
                    <input className="w-[95%] border-none outline-none placeholder:font-semibold" value={inputs.email} name='email' type="email" onChange={handleinputchange} id="email" placeholder="Enter your email" />
                </div>
                {
                    !Truestate &&
                    <Button onClick={handleclick} className="w-[95%]  bg-[#fa7275] text-base h-14 rounded-full cursor-pointer hover:bg-[#ff686c]">Create Account</Button>
                }
                {
                    Truestate &&
                    <Button onClick={handleclick} disabled className="w-[95%]  bg-[#fa7275] text-base h-14 rounded-full cursor-pointer hover:bg-[#ff686c] disabled:bg-[#ff686c]">Creating Account <Loader2 className="animate-spin" /> </Button>
                }

                <div className='text-center w-full'>Already have an account ? <Link className='text-[#fa7275]' href="/login">Login</Link></div>

            </div>

            <Dialog open={opening} onopenchange={setopening}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Verify Your Email Address</DialogTitle>
                    </DialogHeader>
                    <div className='text-center'>Email sent to <span className='text-[#fa7275]'>{inputs.email}</span></div>
                    <div className='mx-auto'>

                        <InputOTP maxLength={6} value={otpvalue} onChange={(value)=>{setotpvalue(value)}}>
                            <InputOTPGroup>
                                <InputOTPSlot className="text-xl text-[#fa7275]" index={0} />
                                <InputOTPSlot className="text-xl text-[#fa7275]" index={1} />
                                <InputOTPSlot className="text-xl text-[#fa7275]" index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot className="text-xl text-[#fa7275]" index={3} />
                                <InputOTPSlot className="text-xl text-[#fa7275]" index={4} />
                                <InputOTPSlot className="text-xl text-[#fa7275]" index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                </DialogContent>
            </Dialog>

        </div>
    )
}

export default signup