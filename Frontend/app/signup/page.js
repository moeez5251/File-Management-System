"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, Loader2, EyeOff, Check, X } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
const SignUp = () => {
    const [input, setinput] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [Truestate, setTruestate] = useState(false)
    const [isvisible, setisvisible] = useState(false)
    const [dialog, setdialog] = useState(false)
    const router = useRouter()
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const handleclick = async () => {
        if (!input.email || !input.password || !input.name) {
            toast.error("Please fill all the fields")
            return
        }
        if (!isValidEmail(input.email)) {
            toast.error("Please enter a valid email")
            return
        }
        if(input.password.length < 6){
            toast.error("Password must be at least 6 characters long")
            return
        }
        setTruestate(true)
        try {

            const api = await fetch("/api/user/createuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input)
            })
            const data = await api.json()
            if (data.error) {
                toast.error(data.error)
                setTruestate(false)
                return
            }
            setdialog(true)
            setTruestate(false)
            setinput({
                name: "",
                email: "",
                password: ""
            })
            
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong")
            setTruestate(false)

        }
    }
    useEffect(() => {
        router.prefetch("/user")

        return () => {

        };
    }, [router])

    const oninputchange = (e) => {
        setinput({ ...input, [e.target.id]: e.target.value })
    }
    return (
        <div className='h-[100vh] flex flex-col items-center sm:flex-row sm:overflow-hidden'>
            <Toaster />
            <div className='bg-[#fa7275] w-full sm:w-1/2 py-3 h-full flex justify-end flex-col items-center gap-16'>
                <Image onClick={() => router.push("/")} className='cursor-pointer' src="/logo.png" width={170} height={170} alt='Store It logo' />
                <div className='w-4/5 mx-auto text-white flex flex-col gap-6'>

                    <h1 className='font-extrabold text-5xl '>Manage Your Files the best way</h1>
                    <p className='text-lg'>Awesome, we &apos;ve created the perfect place for you to store all your documents</p>
                </div>

                <Image src="/Dashboard.png" width={250} height={250} alt='Store It image' />
            </div>
            <div className='flex items-start px-4 sm:px-12 relative top-10  justify-center flex-col w-full sm:w-1/2 gap-6 '>
                <h1 className='font-bold text-5xl text-gray-800'>Sign Up</h1>
                <div className='w-[95%] shadow-xl shadow-changer  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                    <Label htmlFor="email">Name</Label>
                    <input onChange={oninputchange} value={input.name} className="w-[95%] border-none outline-none placeholder:font-semibold" type="email" id="name" placeholder="Enter your email" />
                </div>
                <div className='w-[95%] shadow-xl shadow-changer  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                    <Label htmlFor="email">Email</Label>
                    <input onChange={oninputchange} value={input.email} className="w-[95%] border-none outline-none placeholder:font-semibold" type="email" id="email" placeholder="Enter your email" />
                </div>
                <div className='w-[95%] shadow-xl shadow-changer  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                    <Label htmlFor="password">Password</Label>
                    <div className='flex items-center gap-4'>
                        <input onChange={oninputchange} value={input.password} className="w-[95%] border-none outline-none placeholder:font-semibold" type={isvisible ? "text" : "password"} id="password" placeholder="Enter your Password" />
                        {
                            !isvisible ?
                                <Eye onClick={() => setisvisible(true)} className='cursor-pointer' color='black' /> :
                                <EyeOff onClick={() => setisvisible(false)} className='cursor-pointer' color='black' />
                        }
                    </div>
                </div>
                {
                    !Truestate &&
                    <Button onClick={handleclick} className="w-[95%] bg-[#fa7275] text-lg h-14 rounded-full cursor-pointer hover:bg-[#ff686c]">
                        Create Account
                    </Button>
                }
                {
                    Truestate &&
                    <Button disabled className="w-[95%] bg-[#fa7275] text-lg h-14 rounded-full cursor-pointer hover:bg-[#ff686c]"> Please wait
                        <Loader2 className="animate-spin" />
                    </Button>
                }

                <div className='text-center w-full'>Want to share files without login ? <Link prefetch href="/shared" className='text-[#fa7275]'>Click here</Link></div>
            </div>
            <Dialog open={dialog} onOpenChange={setdialog}>
                <DialogContent className="w-full lg:w-1/3 rounded-3xl px-8 pt-10 pb-8 text-center">
                    <DialogHeader className="w-full">
                        <DialogTitle />
                    </DialogHeader>

                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                        </div>
                    </div>

                    <DialogDescription className="flex flex-col gap-2 mb-7" asChild>
                        <div>
                            <span className="text-xl font-semibold text-center text-foreground block">
                                Account Created Successfully
                            </span>
                            <span className="text-[15px] text-center text-muted-foreground block">
                                You can now log in to your account and get started
                            </span>
                        </div>
                    </DialogDescription>

                    <button onClick={() => router.push("/login")} className="w-full bg-[#fa7275] text-white rounded-xl py-3 text-[15px] font-medium hover:bg-[#e25558] transition-colors cursor-pointer">
                        Go to login
                    </button>

                    <button
                        onClick={() => setdialog(false)}
                        aria-label="Close"
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-gray-600  transition-colors flex items-center justify-center cursor-pointer z-10"
                    >
                        <X className="w-3.5 h-3.5 text-white" />
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    )

}

export default SignUp