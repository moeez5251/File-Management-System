import { Client, Storage } from 'appwrite';
import { DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileIcon, defaultStyles } from 'react-file-icon';
const Slug = async ({ params }) => {
    const { slug } = await params;
    let filefound = false
    let downloadUrl = ""
    let file = ""
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

    const storage = new Storage(client);
    try {
        file = await storage.getFile(
            process.env.NEXT_PUBLIC_BUCKET_ID,
            slug
        );
        downloadUrl = storage.getFileDownload(
            process.env.NEXT_PUBLIC_BUCKET_ID,
            slug
        )
        filefound = true

    }
    catch (e) {

    }
    function formatDate(isoString) {
        const date = new Date(isoString);
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }
    return (
        <>
            <div className='flex items-center justify-between mx-3 md:mx-16 mt-5'>
                <Link href="/" className='flex items-center gap-5'>
                    <Image priority height={100} width={100} className='w-30 md:w-42 cursor-pointer ' src="/User.png" alt="" />
                </Link>
                <div className='flex items-center gap-5'>

                    <Link prefetch={true} href="/login" className="bg-[#fa7275] px-7 py-4 rounded-full text-white text-base">

                        Login</Link>
                </div>

            </div>
            {
                filefound &&
                <div className="flex flex-col items-center gap-11 relative top-40 min-h-screen ">
                    <span className='flex items-center border-1 px-4 py-3 gap-5 rounded-2xl w-[90%] sm:w-1/2 '>
                        <span className="w-10 object-contain rounded-4xl">

                            <FileIcon
                                extension={file.name ? file.name.split(".").pop() : "txt"}
                                {...defaultStyles[file.name ? file.name.split(".").pop() : "txt"]}
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
                            <span className='font-semibold text-black'>{file.name}</span>
                            <span>{formatDate(file.$updatedAt)} </span>
                        </span>
                    </span>
                    <a
                        href={downloadUrl}
                        target="_self"
                        rel="noopener noreferrer"
                        className="bg-[#fa7275] text-white px-6 py-3 text-lg  shadow hover:[#fa7280] flex items-center justify-center gap-2 transition w-[90%] sm:w-1/2 rounded-full"
                    >
                        Download
                        <DownloadIcon />
                    </a>
                </div>
            }
            {
                !filefound &&
                <div className='flex w-full items-center flex-col gap-6 justify-center my-44'>
                    <div className='font-semibold text-3xl text-[#fa7275] text-center'>The file You are requesting was not found</div>
                    <p className='text-xl text-center'>Please go back to the <Link href="/" className='text-[#fa7275] font-semibold'>Home Page</Link></p>
                </div>
            }
        </>
    )
};
export default Slug;
