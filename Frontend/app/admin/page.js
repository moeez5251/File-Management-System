"use client"
import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Client, Account, ID, Storage, Permission, Role } from 'appwrite';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FileIcon, defaultStyles } from 'react-file-icon';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoFile from '@/components/nofile';
import { createSwapy } from 'swapy'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Label } from '@/components/ui/label';
const Shared = () => {
    const router = useRouter()
    const client = new Client().setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_SHARED);
    const storage = new Storage(client);
    const account = new Account(client);
    const [opening, setopening] = useState(false)
    const [files, setfiles] = useState([])
    const [file, setfile] = useState(null)
    const ref = useRef()
    const [upload, setupload] = useState(false)
    const [finger, setfinger] = useState("")
    const [renamedialog, setrenamedialog] = useState(false)
    const [renameinp, setRenameinp] = useState("")
    const [deletedialog, setdeletedialog] = useState(false)
    const [disabledbtn, setdisabledbtn] = useState(false)
    const [accountinfo, setaccountinfo] = useState("")
    const grabdetails = useRef("")

    const containerRef = useRef(null);

    const [input, setinput] = useState({
        email: "",
        password: "",
    })

    const handleclick = () => {
        setopening(true)
    }
    (async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setfinger(result.visitorId)
    })()
    const handlechange = (e) => {
        if (!e.target.files[0]) { return }
        if ((e.target.files[0].size / 1048576) > 50) {
            toast("File size should be less than 50 mb")
            ref.current.value = ""
            return
        }
        setfile(e.target.files[0])
    }
    const handlefilegetting = async () => {
        try {
            const allFiles = await storage.listFiles(
                process.env.NEXT_PUBLIC_SHARED_ID
            );
            setfiles(allFiles.files);

        } catch (error) {
            toast("Failed to get files");
        }
    };
    const handlerename = async () => {
        if (renameinp === "") {
            return
        }
        const renameid = sessionStorage.getItem("renameid")
        if (renameid) {

            await storage.updateFile(
                process.env.NEXT_PUBLIC_SHARED_ID,
                renameid,
                renameinp,
            );
        }
        setRenameinp("")
        setrenamedialog(false)
        sessionStorage.clear()
    }
    const handledeletefile = async () => {
        const fileid = sessionStorage.getItem("moveid")
        await storage.deleteFile(
            process.env.NEXT_PUBLIC_SHARED_ID,
            fileid
        )
        setdeletedialog(false)
        sessionStorage.clear()
        toast("File deleted successfully")
    }
    function formatDate(isoString) {
        const date = new Date(isoString);
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + " KB";
        } else if (bytes < 1024 * 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(2) + " MB";
        } else {
            return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
        }
    }
    const handleinpchange = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value })
    }
    const handlelogin = async () => {
        setdisabledbtn(true)
        try {

            const result = await account.createEmailPasswordSession(
                input.email,
                input.password
            );
            setaccountinfo(result)
            setdisabledbtn(false)
            setinput({ email: "", password: "" })
        }
        catch (e) {
            toast("Invalid credentials")
            setdisabledbtn(false)
            return
        }

    }
    const handledeleteallfiles = async () => {
        for (const file of files) {
            await storage.deleteFile(
                process.env.NEXT_PUBLIC_SHARED_ID,
                file.$id
            )
        }
        toast("All files deleted successfully")
        
    }
    useEffect(() => {
        if (file && finger) {
            setupload(true)
            storage.createFile(
                process.env.NEXT_PUBLIC_SHARED_ID,
                `${finger}-${Math.floor(Math.random() * 1000)}`,
                file,
                [
                    Permission.read(Role.any()),

                ],
            ).then(e => {
                setupload(false)
                toast("File uploaded successfully")
                setfile(null)
            }).catch(e => {
                console.log(e);
                toast("File upload failed")
                setupload(false)
                setfile(null)
            })
        }
        return () => {

        }
        // Disable the exhaustive-deps warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    useEffect(() => {
        if (containerRef.current && files.length > 0) {
            const swapy = createSwapy(containerRef.current, { animation: 'dynamic', });
            if (window.matchMedia("(max-width: 768px)").matches) {
                swapy.enable(false);
            } else {
                swapy.enable(true);
            }
            swapy.onSwapStart((event) => {
                document.querySelector(`div[data-swapy-item=${event.draggingItem}]`).classList.replace("cursor-grab", "cursor-grabbing");
                grabdetails.current = event.draggingItem

            })
            swapy.onSwapEnd((event) => {
                document.querySelector(`div[data-swapy-item=${grabdetails.current}]`).classList.replace("cursor-grabbing", "cursor-grab");
            })
            // Optional: cleanup
            return () => swapy.destroy();
        }
    }, [files]);
    useEffect(() => {
        if (finger) {

            handlefilegetting()
        }
        return () => {

        }
    }, [finger])
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 500,
            disable: "phone"

        });

        return () => {

        }
    }, [])
    useEffect(() => {
        if (!document.querySelector(".swapy")) { return }
        document.querySelector(".swapy").addEventListener("dragover", e => e.preventDefault())
        document.querySelector(".swapy").addEventListener("drop", e => {
            e.preventDefault()
            const file = e.dataTransfer.files[0];
            setfile(file)
        })
        return () => {
            setfile(null)

        }
    }, [])
    useEffect(() => {
        const unsubscribe = client.subscribe("files", (e) => {
            handlefilegetting();
        });

        return () => {
            unsubscribe();
        };
        // Disable the exhaustive-deps warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const session = await account.getSession("current");
                setaccountinfo(session);
            } catch (err) {
            }
        })();
    }, []);


    return (
        <>
            <Toaster />
            {
                accountinfo ?
                    <div className='w-full h-screen overflow-hidden'>

                        <div className='flex items-center justify-between mx-2 md:mx-8 mt-5'>
                            <div className='flex items-center bg-[#fa7275] px-2 md:px-6 py-4 rounded-full shadow-xl  text-white text-sm md:text-base'>
                                {formatFileSize(files.reduce((a, b) => a + b.sizeOriginal, 0))}/2 GB used
                            </div>
                            <div className='flex items-center gap-5'>

                                <Button onClick={() => { account.deleteSession("current"); setaccountinfo("") }} className="flex items-center bg-[#fa7275] px-6 md:px-10 py-6 md:py-7 cursor-pointer text-base rounded-full shadow-xl hover:bg-[#fa7290]">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                                    </div>
                                    Log Out</Button>

                            </div>
                        </div>

                        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mx-3 md:mx-8 mt-10 mb-20 bg-[#f1f3f8] px-3 py-6 rounded-3xl h-[80vh] overflow-y-auto overflow-x-hidden swapy relative'>
                            <div onClick={handledeleteallfiles} className='fixed bg-[#fa7275] hover:bg-[#ff686c] z-10 text-white px-4 py-2 rounded-lg right-3 md:right-8 bottom-2 cursor-pointer'>
                                Delete all files
                            </div>
                            {
                                files.length > 0 &&
                                files.map((e, key) =>
                                    <div data-aos-delay={key * 80} data-aos="zoom-in" key={key} data-swapy-slot={`slot-${key}`} >
                                        <div data-swapy-item={`item-${key}`} className='bg-white h-56 px-5 py-6 rounded-3xl cursor-grab'>
                                            <div className='flex items-stretch justify-between'>

                                                <div className='bg-[#ffe5e5] h-14 p-3 rounded-full w-fit relative -top-2'>
                                                    <div className="logo w-7 object-contain rounded-4xl">
                                                        <FileIcon
                                                            extension={e.name.split(".").pop() || "txt"}
                                                            {...defaultStyles[e.name.split(".").pop() || "txt"]}
                                                            color="#f3f4f6"
                                                            fold={true}
                                                            foldColor="#d1d5db"
                                                            glyphColor="#ef4444"
                                                            gradientColor="#ffffff"
                                                            gradientOpacity={0.3}
                                                            labelColor="#f87171"
                                                            labelTextColor="#ffffff"
                                                            className="shadow-md"
                                                        />

                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-8 items-end'>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>

                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={30}
                                                                height={30}
                                                                fill="none"
                                                                className="injected-svg cursor-pointer"
                                                                color="black"
                                                                data-src="https://cdn.hugeicons.com/icons/more-vertical-circle-01-stroke-standard.svg"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    stroke="black"
                                                                    strokeWidth={1.5}
                                                                    d="M14 4.55a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM14 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM14 19.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
                                                                />
                                                            </svg>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="px-5 py-3 rounded-xl shadow-xl w-80">
                                                            <DropdownMenuLabel className="text-lg font-semibold my-1">{e.name}</DropdownMenuLabel>

                                                            < DropdownMenuItem onClick={() => {
                                                                sessionStorage.setItem("renameid", e.$id)
                                                                setrenamedialog(true)
                                                                setRenameinp(e.name)
                                                            }
                                                            } data-id={e.$id} className="py-2">
                                                                <Image priority width={30} height={30} src="/Drop-Down/Rename.png" alt="Rename" /> Rename</DropdownMenuItem>



                                                            <DropdownMenuSeparator />


                                                            <DropdownMenuItem onClick={
                                                                () => {

                                                                    const result = storage.getFileDownload(
                                                                        process.env.NEXT_PUBLIC_SHARED_ID,
                                                                        e.$id
                                                                    )
                                                                    window.location.href = result
                                                                }
                                                            } data-id={e.$id} className="py-2">
                                                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                                                Download
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem onClick={() => {
                                                                sessionStorage.setItem("moveid", e.$id)
                                                                setdeletedialog(true)
                                                            }} data-id={e.$id} className="py-2">
                                                                <Image priority width={30} height={30} src="/Drop-Down/Trash.png" alt="Move to Trash" />
                                                                Move to Trash
                                                            </DropdownMenuItem>


                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <span>{formatFileSize(e.sizeOriginal)}</span>
                                                </div>

                                            </div>
                                            <div
                                                className='font-semibold mt-4'>
                                                {e.name}
                                            </div>
                                            <div className='text-gray-400 text-sm mt-2.5'>{formatDate(e.$createdAt)}</div>
                                        </div>
                                    </div>

                                )
                            }
                            {
                                files.length === 0 &&
                                <div className='w-full h-[80vh] flex items-center justify-center flex-col gap-5 absolute left-0'>

                                    <NoFile className="w-64 h-46 " />
                                </div>
                            }
                        </div>
                    </div>
                    :
                    <div className='h-screen'>
                        <div className='flex items-center justify-between mx-3 md:mx-8 mt-5'>
                            <Image onClick={() => router.push("/")} priority height={100} width={100} className='w-30 md:w-42 cursor-pointer ' src="/User.png" alt="" />

                        </div>
                        <div className='flex items-center px-4 sm:px-12 relative top-24  flex-col  gap-8 h-full'>
                            <div className='w-[95%] sm:w-[70%] border  flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                                <Label htmlFor="email">Email</Label>
                                <input value={input.email} name='email' onChange={handleinpchange} className=" border-none outline-none placeholder:font-semibold" type="email" id="email" placeholder="Enter your email" />
                            </div>

                            <div className='w-[95%] sm:w-[70%] border flex flex-col gap-4 px-4 py-4 rounded-2xl'>
                                <Label htmlFor="email">Password</Label>
                                <input value={input.password} name='password' onChange={handleinpchange} className=" border-none outline-none placeholder:font-semibold" type="password" id="password" placeholder="Enter your password" />
                            </div>
                            <Button onClick={handlelogin} disabled={disabledbtn} className=" bg-[#fa7275] text-lg h-14 rounded-full cursor-pointer hover:bg-[#ff686c] w-[95%] sm:w-1/3">
                                Login
                            </Button>
                        </div>
                    </div>
            }

            <Dialog open={opening} onOpenChange={setopening}>
                <DialogContent className="max-w-lg bg-white p-6 rounded-2xl shadow-xl fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-xl font-semibold">Choose or drop file here</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-center text-gray-500 mb-4">
                        Upload your file easily by dragging it into the area below or by clicking the button to browse.
                    </DialogDescription>
                    <form className="flex flex-col items-center justify-center w-full h-fit">
                        <label htmlFor="file" className="cursor-pointer bg-gray-100 p-10 rounded-2xl border-2 border-dashed border-gray-400 shadow-md w-full flex flex-col items-center gap-3 transition-all hover:bg-gray-200">
                            <svg className="h-12 fill-gray-500" viewBox="0 0 640 512">
                                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                            </svg>
                            <p className="text-gray-700 font-medium">Drag & Drop</p>
                            <p className="text-gray-500">or</p>
                            <span className="bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-gray-900">Browse file</span>
                        </label>
                        <Input
                            ref={ref}
                            onChange={handlechange}
                            type="file"
                            id="file"
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />

                    </form>
                    <button onClick={() => setopening(false)} className='absolute top-3 right-3 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition-all cursor-pointer z-10'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            fill="none"
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
                </DialogContent>
            </Dialog>

            <Dialog open={upload} onopenchange={setupload}>
                <DialogContent className="w-60 lg:w-80 rounded-3xl h-16 fixed left-[70%] md:left-[85%] top-[88%] overflow-hidden" >
                    <DialogHeader className="w-full">
                        <DialogTitle className="text-base font-semibold top-0">Uploading...</DialogTitle>
                        <span className='w-full h-0.5 bg-[#ea6365] absolute bottom-0.5 left-0 animate-line'></span>
                    </DialogHeader>
                    <DialogDescription className="top-0">
                    </DialogDescription>
                    <button className='absolute top-3  right-3 bg-white p-1 rounded-2xl z-40 pointer-events-none '>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
                            fill="none"
                            className="injected-svg"
                            color="white"
                            data-src="https://cdn.hugeicons.com/icons/multiplication-sign-solid-rounded.svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="white"
                                fillRule="evenodd"
                                d="M5.116 5.116a1.25 1.25 0 0 1 1.768 0L12 10.232l5.116-5.116a1.25 1.25 0 0 1 1.768 1.768L13.768 12l5.116 5.116a1.25 1.25 0 0 1-1.768 1.768L12 13.768l-5.116 5.116a1.25 1.25 0 0 1-1.768-1.768L10.232 12 5.116 6.884a1.25 1.25 0 0 1 0-1.768Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </DialogContent>
            </Dialog>

            <Dialog open={renamedialog} onopenchange={setrenamedialog}>
                <DialogContent className="w-80 rounded-3xl h-64" >
                    <DialogHeader className="w-full">
                        <DialogTitle className="text-center">Rename</DialogTitle>

                    </DialogHeader>
                    <DialogDescription className="flex flex-col gap-5">
                        <input onChange={(e) => { setRenameinp(e.target.value) }} value={renameinp} className=' w-full px-4 py-4 rounded-full shadow-2xl outline-none text-black' type="text" />
                        <Button onClick={handlerename} className="flex items-center bg-[#fa7275] w-full px-8 py-7 cursor-pointer text-base rounded-full shadow-xl hover:bg-[#fa7290]">Save</Button>
                    </DialogDescription>
                    <button onClick={() => { setrenamedialog(false) }} className='absolute top-3 cursor-pointer right-3 bg-gray-300  p-1 rounded-2xl z-40 '>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
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


                    <DialogFooter className="block text-center text-sm text-[#fa7275]">Don&apos;t edit file extension</DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deletedialog} onopenchange={setdeletedialog}>
                <DialogContent className="w-full lg:w-1/4 rounded-3xl " >
                    <DialogHeader className="w-full">
                        <DialogTitle className="text-center">Move to Trash</DialogTitle>

                    </DialogHeader>
                    <DialogDescription className="flex flex-col gap-5 my-3">
                        <span className='text-black text-base text-center'>
                            Do You really want to delete this file ?
                        </span>
                        <span className='flex w-full justify-around items-center'>

                            <Button onClick={() => { setdeletedialog(false) }} className="flex items-center border-none outline-none shadow-none bg-transparent text-black cursor-pointer text-lg hover:bg-transparent">cancel</Button>
                            <Button onClick={handledeletefile} className="flex items-center bg-[#fa7275] w-fit px-8 py-7 cursor-pointer text-base rounded-full shadow-xl hover:bg-[#fa7290]">Move</Button>
                        </span>
                    </DialogDescription>
                    <button onClick={() => { setdeletedialog(false) }} className='absolute top-3 cursor-pointer right-3 bg-gray-300  p-1 rounded-2xl z-40 '>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
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
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Shared
