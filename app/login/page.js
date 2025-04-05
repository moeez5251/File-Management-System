"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Client, Account, ID } from 'appwrite';
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
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from 'next/navigation'
const Login = () => {
    const [input, setinput] = useState("")
    const [Truestate, setTruestate] = useState(false)
    const [verifystate, setverifystate] = useState(false)
    const [opening, setopening] = useState(false)
    const [otpvalue, setotpvalue] = useState("")
    const [userid, setuserid] = useState("")
    const router = useRouter()
    const client = new Client().setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
    const account = new Account(client);
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const handleclick = async () => {
        if (!isValidEmail(input)) {
            return
        }
        setTruestate(true)
        setopening(true)
        await account.createEmailToken(
            ID.unique(),
            input
        ).then(e => {
            setopening(true)
            const userId = e.userId;
            setuserid(userId)

        }).catch(e => {
            setTruestate(false)
            setverifystate(false)
            return
        })
    }

    const handleverify = async (e) => {
        if (e.length < 6) {
            return
        }
        await account.createSession(
            userid,
            e
        ).then(e => {
            router.push("/user")
        }).catch(e => {
            console.log(e);
            toast("Invalid OTP")
            setTruestate(false)
            setverifystate(false)
        })

    }
    return (
        <div className='h-[100vh] flex flex-col items-center sm:flex-row sm:overflow-hidden'>
            <Toaster />
            <div className='bg-[#fa7275] w-full sm:w-1/2 py-3 h-full flex justify-end flex-col items-center gap-16'>
                <Image src="/logo.png" width={170} height={170} alt='Store It logo' />
                <div className='w-4/5 mx-auto text-white flex flex-col gap-6'>

                    <h1 className='font-extrabold text-5xl '>Manage Your Files the best way</h1>
                    <p className='text-lg'>Awesome, we &apos;ve created the perfect place for you to store all your documents</p>
                </div>

                <Image src="/Dashboard.png" width={250} height={250} alt='Store It image' />
            </div>
            <div className='flex items-start px-12 relative top-10  justify-center flex-col w-full sm:w-1/2 gap-10 '>
                <h1 className='font-bold text-5xl text-gray-800'>Login</h1>
                <div className='w-[95%] shadow-2xl shadow-changer  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                    <Label htmlFor="email">Email</Label>
                    <input value={input} onChange={(e) => {
                        setinput(e.target.value)
                        if (isValidEmail(input)) {
                            if (document.querySelector(".shadow-changer").classList.contains("shadow-red-300")) {
                                document.querySelector(".shadow-changer").classList.remove("shadow-red-300")
                            }
                        }
                        else {
                            document.querySelector(".shadow-changer").classList.add("shadow-red-300")
                        }
                    }} className="w-[95%] border-none outline-none placeholder:font-semibold" type="email" id="email" placeholder="Enter your email" />
                </div>
                {
                    !Truestate &&
                    <Button onClick={handleclick} className="w-[95%] bg-[#fa7275] text-lg h-14 rounded-full cursor-pointer hover:bg-[#ff686c]">
                        Login
                    </Button>
                }
                {
                    Truestate &&
                    <Button disabled className="w-[95%] bg-[#fa7275] text-lg h-14 rounded-full cursor-pointer hover:bg-[#ff686c]"> Please wait
                        <Loader2 className="animate-spin" />
                    </Button>
                }
                <div className='text-center w-full'>Don&apos;t have an account ? <Link className='text-[#fa7275]' href="/signup">Create Account</Link></div>

            </div>
            <Dialog open={opening} onopenchange={setopening}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Verify Your Email Address</DialogTitle>

                    </DialogHeader>
                    <DialogDescription></DialogDescription>
                    <button onClick={() => { setopening(false); setTruestate(false) }} className='absolute top-3 cursor-pointer right-3 bg-gray-300  p-1 rounded-2xl z-40 '>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            fill="none"
                            className="injected-svg"
                            color="black"
                            data-src="https://cdn.hugeicons.com/icons/multiplication-sign-solid-rounded.svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="black"
                                fillRule="evenodd"
                                d="M5.116 5.116a1.25 1.25 0 0 1 1.768 0L12 10.232l5.116-5.116a1.25 1.25 0 0 1 1.768 1.768L13.768 12l5.116 5.116a1.25 1.25 0 0 1-1.768 1.768L12 13.768l-5.116 5.116a1.25 1.25 0 0 1-1.768-1.768L10.232 12 5.116 6.884a1.25 1.25 0 0 1 0-1.768Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <div className='text-center'>Email sent to <span className='text-[#fa7275]'>{input}</span></div>
                    <div className='mx-auto'>

                        <InputOTP maxLength={6} value={otpvalue} onChange={async (value) => {
                            setotpvalue(value)
                            if (value.length === 6) {
                                setverifystate(true)
                                handleverify(value)
                            }
                        }}>
                            <InputOTPGroup>
                                <InputOTPSlot autoFocus={true} className="text-xl text-[#fa7275]" index={0} />
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
                        {
                            !verifystate &&
                            <Button onClick={handleverify} className="w-[95%] btn-verify bg-[#fa7275] text-base h-10 mt-8 rounded-full cursor-pointer hover:bg-[#ff686c]">Verify</Button>
                        }
                        {
                            verifystate &&
                            <Button disabled className="w-[95%]  pointer-events-none btn-verify bg-[#fa7275] text-base h-10 mt-8 rounded-full cursor-pointer hover:bg-[#ff686c]">Verifying
                                <Loader2 className="animate-spin" />
                            </Button>
                        }
                    </div>

                    <DialogFooter className="text-center block my-3 ">Didn&apos;t receive code? <span onClick={handleclick} className='text-[#fa7275] cursor-pointer'>Click to resend.</span></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Login