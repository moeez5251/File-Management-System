"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function NotFound() {
    return (
        <>
        <div className='flex items-center justify-between mx-3 md:mx-16 mt-5'>
            <Image height={100} width={100} className='w-30 md:w-42 ' src="/User.png" alt="" />
            <div className='flex items-center gap-5'>

                <Button onClick={() => redirect("/login")}  className="flex items-center bg-[#fa7275] px-6 md:px-10 py-6 md:py-7 cursor-pointer text-base rounded-full shadow-xl hover:bg-[#fa7290]">

                    Login</Button>
            </div>
            </div>
            <div className='flex w-full items-center flex-col gap-6 justify-center my-44'>
                <div className='font-semibold text-3xl text-[#fa7275] text-center'>The Page You are requesting was not found</div>
                <p className='text-xl text-center'>Please go back to the <Link href="/" className='text-[#fa7275] font-semibold'>Home Page</Link></p>
            </div>
        </>
    )
}