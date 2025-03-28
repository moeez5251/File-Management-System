"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Client, Account, ID, Storage } from 'appwrite';
import { FileIcon, defaultStyles } from 'react-file-icon';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import CustomChart from '@/components/ui/customcchart';

const User = () => {
    const router = useRouter();
    const client = new Client().setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
    const account = new Account(client);
    const storage = new Storage(client);
    const [isValid, setIsValid] = useState(false);
    const [opening, setopening] = useState(false)
    const [files, setfiles] = useState([])
    const [file, setfile] = useState(null)
    const ref = useRef()
    const [accountinfo, setaccountinfo] = useState("")
    const [docfiles, setdocfiles] = useState([])
    const [docfilesize, setdocfilesize] = useState({
        size:""
    })
    useEffect(() => {
        (async function name() {
            const accountin = await account.get()
            setaccountinfo(accountin)
        }
            ())
        return () => {

        }
    }, [])
    const handleclick = () => {
        setopening(true)
    }
    const handlechange = (e) => {
        if (!e.target.files[0]) { return }
        if ((e.target.files[0].size / 1048576) > 5) {
            toast("File size should be less than 5mb")
            ref.current.value = ""
            return
        }
        setfile(e.target.files[0])
    }
    const handlelogout = async () => {
        const a = await account.deleteSessions();
        router.push("/login");
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

    const handlefilegetting = async () => {
        toast("Getting files...")
        try {
            const response = await storage.listFiles(
                process.env.NEXT_PUBLIC_BUCKET_ID // Bucket ID
            );
            setfiles(response.files)
            const documentMimeTypes = [
                "application/pdf", // PDF
                "application/msword", // Word (.doc)
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word (.docx)
                "application/vnd.ms-excel", // Excel (.xls)
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (.xlsx)
                "application/vnd.ms-powerpoint", // PowerPoint (.ppt)
                "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PowerPoint (.pptx)
                "text/plain", // Plain text (.txt)
                "application/rtf", // Rich Text Format (.rtf)
                "application/vnd.oasis.opendocument.text", // OpenDocument Text (.odt)
                "application/vnd.oasis.opendocument.spreadsheet" // OpenDocument Spreadsheet (.ods)
            ];
            const filteredfiles = response.files.filter(file => documentMimeTypes.includes(file.mimeType))
            setdocfiles(
                filteredfiles.filter(e => e.$permissions[0].match(/user:([a-zA-Z0-9]+)/)[1] === accountinfo.$id)
            )

        } catch (error) {
            toast("Failed to get files")
        }
    }

    useEffect(() => {
        if (file) {
            storage.createFile(
                process.env.NEXT_PUBLIC_BUCKET_ID,
                ID.unique(),
                file
            ).then(e => {
                toast("File uploaded successfully")
                setfile(null)
                ref.current.value = ""
                handlefilegetting()
            }).catch(e => {
                toast("File upload failed")
            })
        }
        return () => {

        }
    }, [file])
    useEffect(() => {
        if (docfiles.length > 0) {
            const totalsize = docfiles.reduce((total, file) => total + file.sizeOriginal, 0);
            setdocfilesize({
                size:formatFileSize(totalsize)
            })
        }
        return () => {

        }
    }, [docfiles])

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
        <div className='h-[100vh] '>
            <Toaster />
            <div className='flex items-center  justify-between mx-16 mt-5'>
                <img className='w-42 ' src="/User.png" alt="" />
                <div className='flex items-center gap-5'>

                    <Button onClick={handleclick} className="flex items-center bg-[#fa7275] px-10 py-7 cursor-pointer text-base rounded-full shadow-xl hover:bg-[#fa7290]">
                        <div>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                fill="none"
                                className="injected-svg"
                                color="#fff"
                                data-src="https://cdn.hugeicons.com/icons/upload-01-solid-sharp.svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#fff"
                                    fillRule="evenodd"
                                    d="M20 11.4c0-.43-.03-.852-.086-1.264l1.982-.272c.069.502.104 1.015.104 1.536C22 17.192 17.583 22 12 22S2 17.192 2 11.4c0-.521.036-1.034.104-1.536l1.982.272A9.314 9.314 0 0 0 4 11.4c0 4.811 3.642 8.6 8 8.6 4.358 0 8-3.789 8-8.6Z"
                                    clipRule="evenodd"
                                />
                                <path
                                    fill="#fff"
                                    fillRule="evenodd"
                                    d="m12 2 3.707 3.707-1.414 1.415L13 5.829v7.585h-2V5.83L9.707 7.122 8.293 5.707 12 2Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        Upload</Button>
                    <div onClick={handlelogout} className='cursor-pointer'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={28}
                            height={28}
                            fill="none"
                            className="injected-svg"
                            color="#e62911"
                            data-src="https://cdn.hugeicons.com/icons/logout-02-duotone-rounded.svg"
                        >
                            <path
                                fill="#e62911"
                                d="M10.337 3.234 11 3v18l-.663-.234c-2.578-.91-3.868-1.365-4.602-2.403C5 17.324 5 15.957 5 13.223v-2.445c0-2.735 0-4.102.735-5.14.734-1.039 2.024-1.494 4.602-2.404Z"
                                opacity={0.4}
                            />
                            <path
                                stroke="#e62911"
                                strokeLinecap="round"
                                strokeWidth={1.5}
                                d="m11 3-.663.234c-2.578.91-3.868 1.365-4.602 2.403C5 6.676 5 8.043 5 10.777v2.445c0 2.735 0 4.102.735 5.14.734 1.039 2.024 1.494 4.602 2.404L11 21"
                            />
                            <path
                                stroke="#e62911"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 12H11m10 0c0-.7-1.994-2.008-2.5-2.5M21 12c0 .7-1.994 2.008-2.5 2.5"
                            />
                        </svg>

                    </div>

                </div>

            </div>
            <Tabs defaultValue="dashboard" className="h-full w-[94%]   relative top-4  mt-6 mx-6  flex items-start flex-row ">
                <div className=' w-[25%]'>
                    <TabsList className="flex flex-col gap-2 h-fit bg-transparent">

                        <TabsTrigger
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none h-full outline-none px-12 text-base py-5 rounded-full data-[state=active]=shadow-2xl cursor-pointer" value="dashboard" >
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
                        <TabsTrigger onClick={handlefilegetting}
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none  h-full outline-none px-12 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="documents" >
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
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none w-full h-full outline-none px-8 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="Images" >
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
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none w-full h-full outline-none px-8 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="Media" >
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
                            className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none w-full h-full outline-none px-8 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" value="Other" >
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
                        <div className='w-[70%]' >
                            <img className='w-full h-full object-contain' src="/Dashboard.png" alt="Dashboard Image" />
                        </div>

                    </TabsList>
                </div>
                <div className='relative  w-full bg-[#f1f3f8] h-full rounded-4xl overflow-y-auto '>
                    <TabsContent className="flex p-8 gap-10 items-center flex-col justify-center" value="dashboard">
                        <div className='rounded-3xl px-3'>
                            <CustomChart />
                        </div>
                        <div className='grid grid-cols-2 gap-10'>
                            <div className='bg-white w-60 h-60 p-10 relative rounded-3xl'>
                                <img className='absolute top-0 left-0 w-20' src="/Docs.png" alt="Docs Logo" />
                                <span className='absolute top-4 right-4'>1 GB</span>
                                <div className='mt-10 mb-4 w-full text-center font-semibold'>Documents</div>
                                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                                <div className='w-full text-center my-5'>10:15,Friday</div>
                            </div>
                            <div className='bg-white w-60 h-60 p-10 relative rounded-3xl'>
                                <img className='absolute top-0 left-0 w-20' src="/Image.png" alt="Docs Logo" />
                                <span className='absolute top-4 right-4'>1 GB</span>
                                <div className='mt-10 mb-4 w-full text-center font-semibold'>Images</div>
                                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                                <div className='w-full text-center my-5'>10:15,Friday</div>
                            </div>
                            <div className='bg-white w-60 h-60 p-10 relative rounded-3xl'>
                                <img className='absolute top-0 left-0 w-20' src="/Video.png" alt="Docs Logo" />
                                <span className='absolute top-4 right-4'>1 GB</span>
                                <div className='mt-10 mb-4 w-full text-center font-semibold'>Videos</div>
                                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                                <div className='w-full text-center my-5'>10:15,Friday</div>
                            </div>
                            <div className='bg-white w-60 h-60 p-10 relative rounded-3xl'>
                                <img className='absolute top-0 left-0 w-20' src="/Other.png" alt="Docs Logo" />
                                <span className='absolute top-4 right-4'>1 GB</span>
                                <div className='mt-10 mb-4 w-full text-center font-semibold'>Others</div>
                                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                                <div className='w-full text-center my-5'>10:15,Friday</div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent className="p-8" value="documents">
                        <div className='flex  items-center justify-between'>
                            <h1 className='font-bold text-4xl text-[#333f4e]'>Documents</h1>
                            <div className='font-bold text-lg'>Total: <span>{docfilesize.size}</span> </div>
                        </div>
                        <div className='mt-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-y-10 gap-x-8'>
                            {
                                docfiles.map((e, key) =>
                                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                                        <div className='flex items-stretch justify-between'>

                                            <div className='bg-[#ffd0d1] h-14 p-3 rounded-full w-fit relative -top-2'>
                                                <div className="logo w-7 object-contain rounded-4xl">
                                                    <FileIcon extension={e.name.split(".")[1]} {...defaultStyles.docx} />
                                                   
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-8 items-end'>
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
                                                <span>{formatFileSize(e.sizeOriginal)}</span>
                                            </div>
                                        </div>
                                        <div
                                            className='font-semibold mt-4'>
                                            {e.name}
                                        </div>
                                        <div className='text-gray-400 text-sm mt-2.5'>{formatDate(e.$createdAt)}</div>
                                    </div>
                                )


                            }

                        </div>

                    </TabsContent>
                </div>
            </Tabs>
            <Dialog open={opening} onopenchange={setopening}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Choose or drop file here</DialogTitle>

                    </DialogHeader>
                    <DialogDescription>
                        <Input ref={ref} className=" h-40 shadow-md" onChange={handlechange} id="files" type="file" />
                    </DialogDescription>
                    <button onClick={() => { setopening(false); }} className='absolute top-3 cursor-pointer right-3 bg-gray-300  p-1 rounded-2xl z-40 '>
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


                </DialogContent>
            </Dialog>
        </div>

    )
}

export default User