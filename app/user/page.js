"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const User = () => {
    const router = useRouter();

    const [isValid, setIsValid] = useState(false);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (!cookieFallback || cookieFallback === '[]') {
            router.replace("/login");
        } else {
            setIsValid(true);
        }
    }, [router]);

    if (!isValid) return null;



    return (
        <div className='h-[100vh] overflow-y-hidden'>
            <div className='flex items-center  justify-between mx-16 mt-5'>
                <img className='w-42 ' src="/User.png" alt="" />

            </div>
            <Tabs defaultValue="dashboard" className="w-[25%] h-[fit]  relative top-4  mt-6 mx-4  ">
                <div className='flex w-full'>
                    <TabsList className="flex flex-col gap-5 h-fit bg-transparent">

                        <TabsTrigger
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:text-white border-none w-full h-full outline-none px-12 text-base py-5 rounded-full data-[state=active]=shadow-lg cursor-pointer" value="dashboard" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                className=" fill-[#C0C0C0]"
                                color="#fff"
                                data-src="https://cdn.hugeicons.com/icons/dashboard-square-edit-solid-standard.svg"
                                viewBox="0 0 24 24"
                            >
                                <path

                                    fillRule="evenodd"
                                    d="M18.97 1.47a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-.53.22H14a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 .22-.53l5.5-5.5ZM1.25 3c0-.966.784-1.75 1.75-1.75h6c.966 0 1.75.784 1.75 1.75v6A1.75 1.75 0 0 1 9 10.75H3A1.75 1.75 0 0 1 1.25 9V3ZM1.25 15c0-.966.784-1.75 1.75-1.75h6c.966 0 1.75.784 1.75 1.75v6A1.75 1.75 0 0 1 9 22.75H3A1.75 1.75 0 0 1 1.25 21v-6ZM13.25 15c0-.966.784-1.75 1.75-1.75h6c.966 0 1.75.784 1.75 1.75v6A1.75 1.75 0 0 1 21 22.75h-6A1.75 1.75 0 0 1 13.25 21v-6Z"
                                    clipRule="evenodd"
                                />
                            </svg>  Dashboard
                        </TabsTrigger>
                        <TabsTrigger
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:text-white border-none w-full h-full outline-none px-10 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="documents" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                className="injected-svg"
                                color="#fff"
                                data-src="https://cdn.hugeicons.com/icons/document-validation-stroke-standard.svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7.5 13h4M7.5 17h8M9 2H4.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"
                                />
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16.5 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
                                />
                                <path
                                    className=" fill-[#C0C0C0]"

                                    stroke="#fff"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M14.5 7 16 8.5l2.5-3"
                                />
                            </svg> Documents
                        </TabsTrigger>
                        <TabsTrigger
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:text-white border-none w-full h-full outline-none px-8 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="Images" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                className="injected-svg"
                                color="#fff"
                                data-src="https://cdn.hugeicons.com/icons/image-02-stroke-standard.svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21.5 19.5v-15a2 2 0 0 0-2-2h-15a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2Z"
                                />
                                <circle cx={16} cy={8} r={1.5} stroke="#fff" strokeWidth={1.5} />
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 21.5c-.5-2.5-1.907-4.718-3.806-6.166C8.85 13.547 6 13 2.5 13"
                                />
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M13.5 18c1.601-1.327 3.327-2.007 5.07-2a6.967 6.967 0 0 1 2.93.662"
                                />
                            </svg>  Images
                        </TabsTrigger>
                        <TabsTrigger
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:text-white border-none w-full h-full outline-none px-8 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="Media" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                className="injected-svg"
                                color="#fff"
                                data-src="https://cdn.hugeicons.com/icons/video-01-stroke-standard.svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M18 17.5v-11a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2Z"
                                />
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18 15l4 2.5v-11L18 9"
                                />
                            </svg>Media
                        </TabsTrigger>
                        <TabsTrigger
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:text-white border-none w-full h-full outline-none px-8 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="Other" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                className="injected-svg"
                                color="#fff"
                                data-src="https://cdn.hugeicons.com/icons/circle-arrow-reload-01-stroke-standard.svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                                />
                                <path
                                    stroke="#fff"
                                    className=" fill-[#C0C0C0]"

                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 11.5v-1a1 1 0 0 1 1-1h7l-1.5-2M16 12.5v1a1 1 0 0 1-1 1H8l1.5 2"
                                />
                            </svg> Others
                        </TabsTrigger>
                        <div className="flex w-full flex-col items-start justify-between rounded-md border px-4 py-2 sm:flex-row sm:items-center">
                            <p className="text-sm font-medium leading-none">
                                <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground">
                                </span>
                                <span className="text-muted-foreground">My Account</span>
                            </p>
                            <DropdownMenu open={open} onOpenChange={setOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="text-red-600">
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>


                    </TabsList>
                    <div className='relative left-[75%]  '>
                        <TabsContent value="dashboard">Account</TabsContent>
                        <TabsContent value="password">Password</TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>

    )
}

export default User