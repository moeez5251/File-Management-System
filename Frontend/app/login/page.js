"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, Loader2, EyeOff } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from 'next/navigation'
const Login = () => {
    const [input, setinput] = useState({
        email: "",
        password: ""
    })
    const [Truestate, setTruestate] = useState(false)
    const [isvisible, setisvisible] = useState(false)
    const router = useRouter()
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const handleclick = async () => {
        if (!input.email || !input.password) {
            toast.error("Please fill all the fields")
            return
        }
        if (!isValidEmail(input.email)) {
            toast.error("Please enter a valid email")
            return
        }
        setTruestate(true)
        try {

            const api = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(input)
            })
            const data = await api.json()
            if (data.error) {
                toast.error(data.error)
                setTruestate(false)
                return
            }
             window.location.href = "/user";
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
            <div className='flex items-start px-4 sm:px-12 relative top-10  justify-center flex-col w-full sm:w-1/2 gap-10 '>
                <h1 className='font-bold text-5xl text-gray-800'>Login</h1>
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
                        Login
                    </Button>
                }
                {
                    Truestate &&
                    <Button disabled className="w-[95%] bg-[#fa7275] text-lg h-14 rounded-full cursor-pointer hover:bg-[#ff686c]"> Please wait
                        <Loader2 className="animate-spin" />
                    </Button>
                }

                <div className='text-center w-full'>New here ? Create an <Link prefetch href="/signup" className='text-[#fa7275]'>account</Link></div>
            </div>

        </div>
    )
}

export default Login