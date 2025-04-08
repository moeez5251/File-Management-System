"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Client, Storage } from 'appwrite';
import { FileIcon, defaultStyles } from 'react-file-icon';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
const User = () => {
  const router = useRouter();
  const client = new Client().setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
  const storage = new Storage(client);
  const [files, setfiles] = useState([])
  const [docfiles, setdocfiles] = useState([])
  const [share, setShare] = useState(false)
  const [sharedet, setSharedet] = useState("")
  const [docfilesize, setdocfilesize] = useState({
    size: "",
    lastupdated: ""
  })
  const [Details, setDetails] = useState(false)
  const [Det, setDet] = useState("")
  const [imagefiles, setimagefiles] = useState([])
  const [imgsize, setimgsize] = useState({
    size: "0 B",
    lastupdated: ""
  })
  const [mediafiles, setmediafiles] = useState([])
  const [mediasize, setMediasize] = useState({
    size: "0 B",
    lastupdated: ""
  })
  const [other, setOther] = useState([])
  const [othersize, setothersize] = useState({
    size: "0 B",
    lastupdated: ""
  })
  const handleclick = () => {
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
        filteredfiles)
      const imageMimeTypes = [
        "image/jpeg", // JPEG (.jpg, .jpeg)
        "image/png", // PNG (.png)
        "image/gif", // GIF (.gif)
        "image/bmp", // Bitmap (.bmp)
        "image/webp", // WebP (.webp)
        "image/tiff", // TIFF (.tiff)
        "image/svg+xml", // SVG (.svg)
        "image/vnd.adobe.photoshop", // Photoshop (.psd)
        "image/x-icon", // Icon (.ico)
        "image/heif", // HEIF (.heif)
        "image/heic", // HEIC (.heic)
      ];
      const filteredimagefiles = response.files.filter(file => imageMimeTypes.includes(file.mimeType))
      setimagefiles(
        filteredimagefiles)
      const mediaMimeTypes = [
        "audio/mpeg", // MP3 (.mp3)
        "audio/wav", // WAV (.wav)
        "audio/ogg", // OGG (.ogg)
        "audio/flac", // FLAC (.flac)
        "audio/aac", // AAC (.aac)
        "audio/webm", // WebM (.webm)
        "video/mp4", // MP4 (.mp4)
        "video/webm", // WebM (.webm)
        "video/ogg", // OGG (.ogv)
        "video/x-msvideo", // AVI (.avi)
        "video/quicktime", // MOV (.mov)
        "video/x-matroska", // MKV (.mkv)
        "video/3gpp", // 3GP (.3gp)
        "video/flv", // FLV (.flv)
      ];
      const filteredmediafiles = response.files.filter(file => mediaMimeTypes.includes(file.mimeType))
      setmediafiles(
        filteredmediafiles)
      const otherFiles = response.files.filter(file => {
        return !documentMimeTypes.includes(file.mimeType) &&
          !imageMimeTypes.includes(file.mimeType) &&
          !mediaMimeTypes.includes(file.mimeType);
      });
      setOther(otherFiles);

    } catch (error) {
      toast("Failed to get files")
    }
  }
  useEffect(() => {
    if (docfiles.length === 0 && imagefiles.length === 0 && mediafiles.length === 0 && other.length === 0) {
      handlefilegetting()
    }
    if (docfiles.length > 0) {
      const totalsize = docfiles.reduce((total, file) => total + file.sizeOriginal, 0);
      const lastupdated = docfiles.reduce((last, file) => new Date(file.$updatedAt) > last ? new Date(file.$updatedAt) : last, new Date(0));
      setdocfilesize({
        size: formatFileSize(totalsize),
        lastupdated: formatDate(lastupdated)
      })
    }
    if (imagefiles.length > 0) {
      const totalsize = imagefiles.reduce((total, file) => total + file.sizeOriginal, 0);
      const lastupdated = imagefiles.reduce((last, file) => new Date(file.$updatedAt) > last ? new Date(file.$updatedAt) : last, new Date(0));
      setimgsize({
        size: formatFileSize(totalsize),
        lastupdated: formatDate(lastupdated)
      })
    }
    if (mediafiles.length > 0) {
      const totalsize = mediafiles.reduce((total, file) => total + file.sizeOriginal, 0);
      const lastupdated = mediafiles.reduce((last, file) => new Date(file.$updatedAt) > last ? new Date(file.$updatedAt) : last, new Date(0));
      setMediasize({
        size: formatFileSize(totalsize),
        lastupdated: formatDate(lastupdated)
      })
    }
    if (other.length > 0) {
      const totalsize = other.reduce((total, file) => total + file.sizeOriginal, 0);
      const lastupdated = other.reduce((last, file) => new Date(file.$updatedAt) > last ? new Date(file.$updatedAt) : last, new Date(0));
      setothersize({
        size: formatFileSize(totalsize),
        lastupdated: formatDate(lastupdated)
      })
    }
    return () => {

    }
    // Disable the exhaustive-deps warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docfiles, imagefiles, mediafiles, other])
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


  const handlesidebar = () => {

    document.querySelector(".sidebar").classList.toggle("left-0");
  }


  return (
    <div className='h-[100vh] '>
      <Toaster />
      <div className='flex items-center justify-between mx-3 md:mx-16 mt-5'>
        <Image priority height={100} width={100} className='w-30 md:w-42 ' src="/User.png" alt="" />
        <div className='flex items-center gap-5'>

          <Button onClick={handleclick} className="flex items-center bg-[#fa7275] px-6 md:px-10 py-6 md:py-7 cursor-pointer text-base rounded-full shadow-xl hover:bg-[#fa7290]">

            Login</Button>
        </div>
      </div>
      <Tabs defaultValue="dashboard" className="h-full w-[94%] relative top-4  mt-6 lg:mx-6  lg:flex lg:items-start block mx-auto flex-row ">
        <div className='sidebar w-[25%] absolute -left-full z-50 transition-all lg:relative lg:left-0'>
          <TabsList className="flex flex-col gap-2 h-fit bg-white py-3 lg:bg-transparent">

            <TabsTrigger onClick={handlefilegetting}
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
            <TabsTrigger onClick={handlefilegetting}
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
            <TabsTrigger onClick={handlefilegetting}
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
              className="bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none w-full h-full outline-none px-8 text-base py-5 rounded-full data-[state=active]=shadow-lg  cursor-pointer" onClick={handlefilegetting} value="Other" >
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
            <div className='w-[90%]' >
              <Image priority width={100} height={100} className='w-full h-full object-contain' src="/Dashboard.png" alt="Dashboard Image" />
            </div>

          </TabsList>
        </div>
        <div className='relative lg:w-full bg-[#f1f3f8] h-full rounded-4xl overflow-y-auto '>
          <TabsContent className="flex p-5 md:p-8 gap-6 md:gap-10 items-center flex-col justify-center" value="dashboard">

            <div className='grid grid-cols-1 justify-items-center md:grid-cols-2 gap-10'>
              <div className='bg-white w-76 md:w-60 h-60 p-10 relative rounded-3xl'>
                <Image priority width={100} height={100} className='absolute top-0 left-0 w-20' src="/Docs.png" alt="Docs Logo" />
                <span className='absolute top-4 right-4'>{docfilesize.size.trim() === "" ? "0 B" : docfilesize.size}</span>
                <div className='mt-10 mb-4 w-full text-center font-semibold'>Documents</div>
                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                <div className='w-full text-center my-5'>{docfilesize.lastupdated.trim() === "" ? "" : docfilesize.lastupdated}</div>
              </div>
              <div className='bg-white w-80 md:w-60 h-60 p-10 relative rounded-3xl'>
                <Image priority width={100} height={100} className='absolute top-0 left-0 w-20' src="/Image.png" alt="Docs Logo" />
                <span className='absolute top-4 right-4'>{imgsize.size.trim() === "" ? "0 B" : imgsize.size}</span>
                <div className='mt-10 mb-4 w-full text-center font-semibold'>Images</div>
                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                <div className='w-full text-center my-5'>{imgsize.lastupdated.trim() === "" ? "" : imgsize.lastupdated}</div>
              </div>
              <div className='bg-white w-80 md:w-60 h-60 p-10 relative rounded-3xl'>
                <Image priority width={100} height={100} className='absolute top-0 left-0 w-20' src="/Video.png" alt="Docs Logo" />
                <span className='absolute top-4 right-4'>{mediasize.size.trim() === "" ? "0 B" : mediasize.size}</span>
                <div className='mt-10 mb-4 w-full text-center font-semibold'>Videos</div>
                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                <div className='w-full text-center my-5'>{mediasize.lastupdated.trim() === "" ? "" : mediasize.lastupdated}</div>
              </div>
              <div className='bg-white w-80 md:w-60 h-60 p-10 relative rounded-3xl'>
                <Image priority width={100} height={100} className='absolute top-0 left-0 w-20' src="/Other.png" alt="Docs Logo" />
                <span className='absolute top-4 right-4'>{othersize.size.trim() === "" ? "0 B" : othersize.size}</span>
                <div className='mt-10 mb-4 w-full text-center font-semibold'>Others</div>
                <div className='w-full h-[2px] bg-gray-200 my-5'></div>
                <div className='w-full text-gray-400 text-center font-medium'>Last Update</div>
                <div className='w-full text-center my-5'>{othersize.lastupdated.trim() === "" ? "" : othersize.lastupdated}</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent className="p-5 md:p-8" value="documents">
            <Tabs defaultValue="grid">
              <div className='flex  items-center gap-2 md:gap-0 justify-between'>
                <h1 className='font-bold text-2xl md:text-4xl text-[#333f4e]'>Documents</h1>
                <div className='block'>
                  <TabsList className="sm:flex hidden gap-5 bg-transparent" >

                    <TabsTrigger value="grid" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5 '>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className='size-6  fill-[#dcdfc8]'
                        data-src="https://cdn.hugeicons.com/icons/grid-view-bulk-rounded.svg"
                      >
                        <path
                          d="M18.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                          opacity={0.4}
                        />
                        <path
                          d="M6.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.104 3.104 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074ZM18.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                        />
                        <path
                          d="M6.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074Z"
                          opacity={0.4}
                        />
                      </svg>

                    </TabsTrigger>
                    <TabsTrigger value="list" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className="size-6  fill-[#dcdfc8]"
                        data-src="https://cdn.hugeicons.com/icons/list-view-solid-standard.svg"
                      >
                        <path
                          d="M2 4.75C2 3.784 2.784 3 3.75 3h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 5.75v-1ZM2 11.25c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1A1.75 1.75 0 0 1 19.75 14h-16A1.75 1.75 0 0 1 2 12.25v-1ZM2 17.75c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 18.75v-1Z"
                        />
                      </svg>
                    </TabsTrigger>
                  </TabsList>

                </div>
                <div className='font-bold text-sm text-right md:text-lg'>Total: <span>{docfilesize.size}</span> </div>
              </div>
              <TabsContent value="grid" className='mt-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-y-10 gap-x-8'>
                {
                  docfiles.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>

                        <div className='bg-[#ffe5e5] h-14 p-3 rounded-full w-fit relative -top-2'>
                          <div className="logo w-7 object-contain rounded-4xl">
                            <FileIcon
                              extension={e.name.split(".").pop() || "txt"}
                              {...defaultStyles[e.name.split(".").pop() || "txt"]}
                              color="#EAEAEA"
                              fold={true}
                              foldColor="#C0C0C0"
                              glyphColor="#2563EB"
                              gradientColor="#FFFFFF"
                              gradientOpacity={0.7}
                              labelColor="#EF4444"
                              labelTextColor="#FFFFFF"
                              radius={8}

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
                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
              <TabsContent value="list" className='mt-8 grid grid-cols-[repeat(1,1fr)]  gap-y-10 gap-x-8'>
                {
                  docfiles.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>

                        <div className='bg-[#ffe5e5] h-14 p-3 rounded-full w-fit relative -top-2'>
                          <div className="logo w-7 object-contain rounded-4xl">
                            <FileIcon
                              extension={e.name.split(".").pop() || "txt"}
                              {...defaultStyles[e.name.split(".").pop() || "txt"]}
                              color="#EAEAEA"
                              fold={true}
                              foldColor="#C0C0C0"
                              glyphColor="#2563EB"
                              gradientColor="#FFFFFF"
                              gradientOpacity={0.7}
                              labelColor="#EF4444"
                              labelTextColor="#FFFFFF"
                              radius={8}

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

                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
            </Tabs>

          </TabsContent>
          <TabsContent className="p-5 md:p-8" value="Images">
            <Tabs defaultValue="grid">
              <div className='flex  items-center justify-between'>
                <h1 className='font-bold text-2xl md:text-4xl text-[#333f4e]'>Images</h1>
                <div className='block'>
                  <TabsList className="sm:flex hidden gap-5 bg-transparent" >

                    <TabsTrigger value="grid" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5 '>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className='size-6  fill-[#dcdfc8]'
                        data-src="https://cdn.hugeicons.com/icons/grid-view-bulk-rounded.svg"
                      >
                        <path
                          d="M18.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                          opacity={0.4}
                        />
                        <path
                          d="M6.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.104 3.104 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074ZM18.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                        />
                        <path
                          d="M6.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074Z"
                          opacity={0.4}
                        />
                      </svg>

                    </TabsTrigger>
                    <TabsTrigger value="list" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className="size-6  fill-[#dcdfc8]"
                        data-src="https://cdn.hugeicons.com/icons/list-view-solid-standard.svg"
                      >
                        <path
                          d="M2 4.75C2 3.784 2.784 3 3.75 3h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 5.75v-1ZM2 11.25c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1A1.75 1.75 0 0 1 19.75 14h-16A1.75 1.75 0 0 1 2 12.25v-1ZM2 17.75c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 18.75v-1Z"
                        />
                      </svg>
                    </TabsTrigger>
                  </TabsList>

                </div>
                <div className='font-bold text-sm text-right md:text-lg'>Total: <span>{imgsize.size}</span> </div>
              </div>
              <TabsContent value="grid" className='mt-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-y-10 gap-x-8'>
                {
                  imagefiles.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>


                        <div className="logo w-16 h-16 object-contain">
                          <Image priority
                            width={100}
                            height={100}
                            src={storage.getFileView(process.env.NEXT_PUBLIC_BUCKET_ID, e.$id)}
                            alt="File Preview"
                            className="w-full h-full rounded-full"
                          />


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
                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
              <TabsContent value="list" className='mt-8 grid grid-cols-[repeat(1,1fr)]  gap-y-10 gap-x-8'>
                {
                  imagefiles.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>


                        <div className="logo w-14 h-14 object-contain">
                          <Image priority
                            src={storage.getFileView(process.env.NEXT_PUBLIC_BUCKET_ID, e.$id)}
                            width={100}
                            height={100}
                            alt="File Preview"
                            className="w-full h-full rounded-full"
                          />


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
                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent className="p-5 md:p-8" value="Media">
            <Tabs defaultValue="grid">
              <div className='flex  items-center justify-between'>
                <h1 className='font-bold text-2xl md:text-4xl text-[#333f4e]'>Media</h1>
                <div className='block'>
                  <TabsList className="sm:flex hidden gap-5 bg-transparent" >

                    <TabsTrigger value="grid" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5 '>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className='size-6  fill-[#dcdfc8]'
                        data-src="https://cdn.hugeicons.com/icons/grid-view-bulk-rounded.svg"
                      >
                        <path
                          d="M18.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                          opacity={0.4}
                        />
                        <path
                          d="M6.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.104 3.104 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074ZM18.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                        />
                        <path
                          d="M6.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074Z"
                          opacity={0.4}
                        />
                      </svg>

                    </TabsTrigger>
                    <TabsTrigger value="list" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className="size-6  fill-[#dcdfc8]"
                        data-src="https://cdn.hugeicons.com/icons/list-view-solid-standard.svg"
                      >
                        <path
                          d="M2 4.75C2 3.784 2.784 3 3.75 3h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 5.75v-1ZM2 11.25c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1A1.75 1.75 0 0 1 19.75 14h-16A1.75 1.75 0 0 1 2 12.25v-1ZM2 17.75c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 18.75v-1Z"
                        />
                      </svg>
                    </TabsTrigger>
                  </TabsList>

                </div>
                <div className='font-bold text-sm text-right md:text-lg'>Total: <span>{mediasize.size}</span> </div>
              </div>
              <TabsContent value="grid" className='mt-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-y-10 gap-x-8'>
                {
                  mediafiles.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>

                        <div className='bg-[#ffe5e5] h-14 p-3 rounded-full w-fit relative -top-2'>
                          <div className="logo w-7 object-contain rounded-4xl">
                            <FileIcon
                              extension={e.name.split(".").pop() || "txt"}
                              {...defaultStyles[e.name.split(".").pop() || "txt"]}
                              color="#EAEAEA"
                              fold={true}
                              foldColor="#C0C0C0"
                              glyphColor="#2563EB"
                              gradientColor="#FFFFFF"
                              gradientOpacity={0.7}
                              labelColor="#EF4444"
                              labelTextColor="#FFFFFF"
                              radius={8}

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

                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
              <TabsContent value="list" className='mt-8 grid grid-cols-[repeat(1,1fr)]  gap-y-10 gap-x-8'>
                {
                  mediafiles.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>

                        <div className='bg-[#ffe5e5] h-14 p-3 rounded-full w-fit relative -top-2'>
                          <div className="logo w-7 object-contain rounded-4xl">
                            <FileIcon
                              extension={e.name.split(".").pop() || "txt"}
                              {...defaultStyles[e.name.split(".").pop() || "txt"]}
                              color="#EAEAEA"
                              fold={true}
                              foldColor="#C0C0C0"
                              glyphColor="#2563EB"
                              gradientColor="#FFFFFF"
                              gradientOpacity={0.7}
                              labelColor="#EF4444"
                              labelTextColor="#FFFFFF"
                              radius={8}

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
                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
            </Tabs>

          </TabsContent>
          <TabsContent className="p-5 md:p-8" value="Other">
            <Tabs defaultValue="grid">
              <div className='flex  items-center justify-between'>
                <h1 className='font-bold text-2xl md:text-4xl text-[#333f4e]'>Others</h1>
                <div className='block'>
                  <TabsList className="sm:flex hidden gap-5 bg-transparent" >

                    <TabsTrigger value="grid" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5 '>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className='size-6  fill-[#dcdfc8]'
                        data-src="https://cdn.hugeicons.com/icons/grid-view-bulk-rounded.svg"
                      >
                        <path
                          d="M18.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                          opacity={0.4}
                        />
                        <path
                          d="M6.037 1.25c.739 0 1.346 0 1.838.047.51.048.973.153 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.104 3.104 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.074c0-.739 0-1.346.047-1.838.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.257.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074ZM18.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.258-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.152-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.073Z"
                        />
                        <path
                          d="M6.037 13.25c.739 0 1.346 0 1.838.047.51.048.973.152 1.393.41.418.256.769.607 1.025 1.025.258.42.362.883.41 1.393.047.492.047 1.1.047 1.838v.074c0 .739 0 1.346-.047 1.838-.048.51-.152.973-.41 1.393a3.103 3.103 0 0 1-1.025 1.025c-.42.258-.883.362-1.393.41-.492.047-1.1.047-1.838.047h-.074c-.739 0-1.346 0-1.838-.047-.51-.048-.973-.152-1.393-.41a3.103 3.103 0 0 1-1.025-1.025c-.257-.42-.362-.883-.41-1.393-.047-.492-.047-1.1-.047-1.838v-.073c0-.74 0-1.347.047-1.839.048-.51.153-.973.41-1.393a3.103 3.103 0 0 1 1.025-1.025c.42-.258.883-.362 1.393-.41.492-.047 1.1-.047 1.838-.047h.074Z"
                          opacity={0.4}
                        />
                      </svg>

                    </TabsTrigger>
                    <TabsTrigger value="list" className='bg-white data-[state=active]:bg-[#fa7275] data-[state=active]:drop-shadow-lg data-[state=active]:text-white border-none outline-none rounded-lg data-[state=active]=shadow-2xl cursor-pointer px-3 py-5'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        className="size-6  fill-[#dcdfc8]"
                        data-src="https://cdn.hugeicons.com/icons/list-view-solid-standard.svg"
                      >
                        <path
                          d="M2 4.75C2 3.784 2.784 3 3.75 3h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 5.75v-1ZM2 11.25c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1A1.75 1.75 0 0 1 19.75 14h-16A1.75 1.75 0 0 1 2 12.25v-1ZM2 17.75c0-.966.784-1.75 1.75-1.75h16c.966 0 1.75.784 1.75 1.75v1a1.75 1.75 0 0 1-1.75 1.75h-16A1.75 1.75 0 0 1 2 18.75v-1Z"
                        />
                      </svg>
                    </TabsTrigger>
                  </TabsList>

                </div>
                <div className='font-bold text-sm text-right md:text-lg'>Total: <span>{othersize.size}</span> </div>
              </div>
              <TabsContent value="grid" className='mt-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-y-10 gap-x-8'>
                {
                  other.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>

                        <div className='bg-[#ffe5e5] h-14 p-3 rounded-full w-fit relative -top-2'>
                          <div className="logo w-7 object-contain rounded-4xl">
                            <FileIcon
                              extension={e.name.split(".").pop() || "txt"}
                              {...defaultStyles[e.name.split(".").pop() || "txt"]}
                              color="#EAEAEA"
                              fold={true}
                              foldColor="#C0C0C0"
                              glyphColor="#2563EB"
                              gradientColor="#FFFFFF"
                              gradientOpacity={0.7}
                              labelColor="#EF4444"
                              labelTextColor="#FFFFFF"
                              radius={8}

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

                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
              <TabsContent value="list" className='mt-8 grid grid-cols-[repeat(1,1fr)]  gap-y-10 gap-x-8'>
                {
                  other.map((e, key) =>
                    <div key={key} className='bg-white h-56 px-5 py-6 rounded-3xl'>
                      <div className='flex items-stretch justify-between'>

                        <div className='bg-[#ffe5e5] h-14 p-3 rounded-full w-fit relative -top-2'>
                          <div className="logo w-7 object-contain rounded-4xl">
                            <FileIcon
                              extension={e.name.split(".").pop() || "txt"}
                              {...defaultStyles[e.name.split(".").pop() || "txt"]}
                              color="#EAEAEA"
                              fold={true}
                              foldColor="#C0C0C0"
                              glyphColor="#2563EB"
                              gradientColor="#FFFFFF"
                              gradientOpacity={0.7}
                              labelColor="#EF4444"
                              labelTextColor="#FFFFFF"
                              radius={8}

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

                              <DropdownMenuItem onClick={
                                () => {
                                  setDet(e)
                                  setDetails(true)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Details.png" alt="Details" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  setShare(true)
                                  setSharedet(e)
                                }
                              } className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Share.png" alt="Share" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={
                                () => {
                                  const result = storage.getFileDownload(
                                    process.env.NEXT_PUBLIC_BUCKET_ID,
                                    e.$id
                                  )
                                  window.location.href = result
                                }
                              } data-id={e.$id} className="py-2">
                                <Image priority width={30} height={30} src="/Drop-Down/Download.png" alt="Download" />
                                Download
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
                  )


                }

              </TabsContent>
            </Tabs>
          </TabsContent>
        </div>
      </Tabs>
      <Dialog open={Details} onopenchange={setDetails}>
        <DialogContent className="w-full lg:w-1/4 rounded-3xl " >
          <DialogHeader className="w-full">
            <DialogTitle className="text-center">Details</DialogTitle>

          </DialogHeader>
          <DialogDescription className="flex flex-col gap-5 my-3">
            <span className='flex items-center border-1 px-4 py-3 gap-5 rounded-2xl'>
              <span className="w-10 object-contain rounded-4xl">

                <FileIcon
                  extension={Det.name ? Det.name.split(".").pop() : "txt"}
                  {...defaultStyles[Det.name ? Det.name.split(".").pop() : "txt"]}
                  color="#EAEAEA"
                  fold={true}
                  foldColor="#C0C0C0"
                  glyphColor="#2563EB"
                  gradientColor="#FFFFFF"
                  gradientOpacity={0.7}
                  labelColor="#EF4444"
                  labelTextColor="#FFFFFF"
                  radius={8}

                />
              </span>
              <span className='flex flex-col gap-2'>
                <span className='font-semibold text-black'>{Det.name}</span>
                <span>{formatDate(Det.$updatedAt)} </span>
              </span>
            </span>
            <span className='flex flex-row  gap-10 my-5'>
              <span className='flex flex-col gap-3'>
                <span>Format:</span>
                <span>Dimension:</span>
                <span>Last modified:</span>
              </span>
              <span className='flex gap-3 flex-col'>
                <span className='text-black font-semibold'>{Det.name ? Det.name.split(".").pop() : ""}</span>
                <span className='text-black font-semibold'>{formatFileSize(Det.sizeOriginal)}</span>
                <span className='text-black font-semibold'>{formatDate(Det.$updatedAt)}</span>
              </span>


            </span>
          </DialogDescription>
          <button onClick={() => { setDetails(false) }} className='absolute top-3 cursor-pointer right-3 bg-gray-300  p-1 rounded-2xl z-40 '>
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

      <div onClick={handlesidebar} className='bg-[#fa7275] block lg:hidden w-fit fixed bottom-5 left-4 z-100 rounded-md p-3'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          fill="none"
          className="injected-svg"
          color="#fff"
          data-src="https://cdn.hugeicons.com/icons/circle-arrow-left-02-solid-sharp.svg"
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75 1.25 17.937 1.25 12 6.063 1.25 12 1.25Zm-1 14.28L7.47 12 11 8.468l1.06 1.06-1.72 1.72h6.19v1.5h-6.189l1.72 1.72-1.06 1.06Z"
            clipRule="evenodd"
          />
        </svg>

      </div>
      <Dialog open={share} onopenchange={setShare}>
        <DialogContent className="w-full lg:w-1/4 rounded-3xl " >
          <DialogHeader className="w-full">
            <DialogTitle className="text-center">Share a file</DialogTitle>

          </DialogHeader>
          <DialogDescription className="flex flex-col gap-5 my-3">
            <span className='flex items-center border-1 px-4 py-3 gap-5 rounded-2xl'>
              <span className="w-10 object-contain rounded-4xl">

                <FileIcon
                  extension={sharedet.name ? sharedet.name.split(".").pop() : "txt"}
                  {...defaultStyles[sharedet.name ? sharedet.name.split(".").pop() : "txt"]}
                  color="#EAEAEA"
                  fold={true}
                  foldColor="#C0C0C0"
                  glyphColor="#2563EB"
                  gradientColor="#FFFFFF"
                  gradientOpacity={0.7}
                  labelColor="#EF4444"
                  labelTextColor="#FFFFFF"
                  radius={8}

                />
              </span>
              <span className='flex flex-col gap-2'>
                <span className='font-semibold text-black'>{sharedet.name}</span>
                <span>{formatDate(sharedet.$updatedAt)} </span>
              </span>
            </span>
            <span className='flex  items-center justify-center gap-2'>
              <Input className="text-black input-share" value={"https://xfms.netlify.app/share/" + sharedet.$id} type="text" readOnly />
              <Button onClick={() => {
                navigator.clipboard.writeText(document.querySelector(".input-share").value)
                toast("Copied to clipboard")
              }} className="cursor-pointer ">
                <Copy />
              </Button>
            </span>
          </DialogDescription>
          <button onClick={() => { setShare(false) }} className='absolute top-3 cursor-pointer right-3 bg-gray-300  p-1 rounded-2xl z-40 '>
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
    </div>

  )
}

export default User