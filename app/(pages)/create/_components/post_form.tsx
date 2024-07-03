// import currentUser from "@/lib/user";
import { computeSHA256 } from "@/app/utils/SHA256";
import { getSignedURL } from "@/server/actions";
import { CircleUserRound, Paperclip, X } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CreatePostModalProps {
    setModalOpen: (value: string | null) => void;
}

type PostType = {
    file_url: string | undefined;
    text: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({setModalOpen}) => {
    
    const [file, setFile] = useState<File | null>(null)
    const [user, setUser] = useState<User | undefined>(undefined)
    const [postCreator, setPostCreator] = useState()
    const { data: session, status } = useSession();
    const [postForm, setPostForm] = useState<PostType>({
        file_url: undefined,
        text: ''
    })

    // const getUser = async () => {
    //     const getUser: User | undefined  = await currentUser();
    //     if(getUser){
    //         setPostForm(prevForm => ({...prevForm, userId: getUser.id}))
    //         setUser(getUser)
    //     }
    //     console.log('user:', getUser)
    // }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFile(file)

        if(postForm.file_url){
            URL.revokeObjectURL(postForm.file_url)
        }

        if(file) {
            const url = URL.createObjectURL(file)
            setPostForm(prevForm => ({...prevForm, file_url: url}))
        } else {
            setPostForm(prevForm => ({...prevForm, file_url: undefined}))
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            console.error("No file selected");
            return;
        }
      
        try {
            const checksum = await computeSHA256(file)
            const signedUrlResult = await getSignedURL(file.type, file.size, checksum)
   
            if (signedUrlResult.succes) {
                const url = signedUrlResult.succes.url
                const name = signedUrlResult.succes.name
                const image_url = `https://voy-now-bucket.s3.amazonaws.com/${name}`
                
                // S3 Bucket Image Upload
                const s3ImageUpload = await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                })

                //Form Submission
                const postRequest = await fetch('/api/posts', {
                    method: 'POST',
                    body: JSON.stringify({user_id: session?.user?.id, description: postForm.text , media_url: image_url})
                })
                const { success } = await postRequest.json();
                if(success){
                    toast.success('Post created!')
                } else {
                    toast.error('Error Submiting the post')
                }     
            } else {
                throw new Error(signedUrlResult.failure)
            }
        } catch {
            console.log("Not running")
        } finally {
            setModalOpen(null)
            // setLoading(false)
        }
    };

    // useEffect(() => {
    //     getUser()
    // },[])

    return (
        <div className="flex absolute top-0 left-0 w-full h-full items-center justify-center bg-black/40">
            <div className="flex flex-col w-[40%] bg-zdark rounded-lg relative overflow-hidden">
                <div className="flex justify-center items-center relative w-full bg-white/10">
                    <h1 className="font-bold text-lg text-zdgreen py-3">Create a Post</h1>
                    <button 
                        className="absolute top-2 right-2 p-1 text-zdark hover:text-red-700 font-bold" 
                        onClick={() => setModalOpen(null)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <form className="flex flex-col h-full justify-between space-y-4 p-4" onSubmit={handleSubmit}>
                    <div className="pb-2 border-b-2 border-white/10">
                        { session?.user?.image ? (
                            <div className="flex items-center space-x-2 h-8 relative">
                                <Image src={session?.user?.image} alt="User profile" width={32} height={32} className="rounded-full"/>
                                <h2 className="text-sm font-semibold text-white">{session.user.name}</h2>
                            </div>
                        ):(
                            <div className="flex items-center space-x-2 h-8 relative">
                                <CircleUserRound size={32} className="text-slate-400 bg-slate-200 rounded-full"/>
                                <h2 className="text-sm font-semibold">{session?.user?.name}</h2>
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <h2 className="font-semibold text-white">What do you want to share</h2>
                        <textarea 
                            className="w-full h-20 rounded-md border-2 border-white/10 bg-zdark text-white outline-none"
                            value={postForm.text}
                            onChange={(e) => setPostForm({...postForm, text: e.target.value})}
                        />
                    </div>
                    {postForm.file_url !== undefined ? (
                        <div className="bg-slate-200 overflow-y-auto hover:cursor-pointer rounded-md relative">
                            <div className="h-60 w-full relative overflow-auto">
                                <Image src={postForm.file_url} alt="Post Media" width={600} height={600}/>
                            </div>
                        </div>
                    ):(
                        <div className="flex items-center justify-end">
                            <label className="hover:cursor-pointer">
                                <Paperclip size={24} className="text-white/40"/>
                                <input
                                    className="bg-transparent flex-1 border-none outline-none hidden"
                                    name="media"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    )}   
                    <button type="submit" className="w-full bg-zdgreen text-zwteen rounded-md font-bold py-2">Create Post</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePostModal;