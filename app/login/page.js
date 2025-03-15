import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Login = () => {
    return (
        <div className='h-[100vh] flex overflow-hidden'>
            <div className='bg-[#fa7275] w-1/2 h-full flex  justify-end flex-col items-center gap-16'>
                <Image src="/logo.png" width={170} height={170} alt='Store It logo' />
                <div className='w-4/5 mx-auto text-white flex flex-col gap-6'>

                    <h1 className='font-extrabold text-5xl '>Manage Your Files the best way</h1>
                    <p className='text-lg'>Awesome, we've created the perfect place for you to store all your documents</p>
                </div>

                <Image src="/Dashboard.png" width={250} height={250} alt='Store It image' />
            </div>
            <div className='flex items-start px-12 relative top-10  justify-center flex-col w-1/2 gap-10 '>
                <h1 className='font-bold text-5xl text-gray-800'>Login</h1>
                <div className='w-[95%] shadow-2xl  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                    <Label htmlFor="email">Email</Label>
                    <input className="w-[95%] border-none outline-none placeholder:font-semibold" type="email" id="email" placeholder="Enter your email" />
                </div>
                <Button className="w-[95%] bg-[#fa7275] text-lg h-14 rounded-full cursor-pointer hover:bg-[#ff686c]">
                    Login
                </Button>
                <div className='text-center w-full'>Don't have an account ? <Link className='text-[#fa7275]' href="/signup">Create Account</Link></div>

            </div>
        </div>
    )
}

export default Login