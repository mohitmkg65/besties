import { useContext, useEffect, useRef, useState, type ChangeEvent, type FC } from "react"
import Avatar from "../shared/Avatar"
import Button from "../shared/Button"
import Input from "../shared/Input"
import socket from "../../lib/socket"
import Form from "../shared/Form"
import Context from "../../Context"
import { useParams } from "react-router-dom"
import useSWR from "swr"
import Fetcher from "../../lib/Fetcher"
import CatchError from "../../lib/CatchError"
import { v4 as uuid } from "uuid"
import Httpinterceptor from "../../lib/Httpinterceptor"
import Card from "../shared/Card"
import SmallButton from "../shared/SmallButton"
import moment from "moment"

interface MessageReceivedInterface {
    from: string,
    message: string
}

interface AttachmentUiInterface {
    file : {
        path: string
        type: string
    }
}

const AttachmentUi:FC<AttachmentUiInterface> = ({file}) => {
    if(file.type.startsWith("video/"))
        return (
            <video className="w-full" controls src={file.path}></video>
        )
    
    if(file.type.startsWith("image/"))
        return (
            <img className="w-full" src={file.path} />
        )

    return (
        <Card>
            <i className="ri-file-line text-5xl"></i>
        </Card>
    )
}

const Chat = () => {
    const chatContainer = useRef<HTMLDivElement | null>(null)
    const [chats, setChats] = useState<any>([])
    const {session} = useContext(Context)
    const {id} = useParams()
    const {data} = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null)

    const messageHandler = (messageReceived: MessageReceivedInterface) => {
        setChats((prev:any) => [...prev, messageReceived])
    }

    const attachmentHandler = (x: any) => {
        console.log(x)
        // setChats((prev:any) => [...prev, x])
    }

    // Listening all sockets event
    useEffect(() => {
        socket.on("message", messageHandler) 
        socket.on("attachment", attachmentHandler)
        return () => {
            socket.off("message", messageHandler)
            socket.off("attachment", attachmentHandler)
        }
    }, [])
    
    // Setting old chats
    useEffect(() => {
        if(data){
            setChats(data.chats)
        }
    }, [data])

    // Setup scrollbar position
    useEffect(() => {
        const chatDiv = chatContainer.current
        if(chatDiv){
            chatDiv.scrollTop = chatDiv.scrollHeight
        }
    }, [chats])

    const sendMessage = (values: any) => {
        const payload = {
            from: session,
            to: id,
            message: values.message
        }
        setChats((prev:any) => [...prev, payload])
        socket.emit("message", payload)
    }

    const fileSharing = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const input = event.target
            if(!input.files)
                return
            const file = input.files[0]
            const ext = file.name.split(".").pop()
            const filename = `${uuid()}.${ext}`
            const path = `chats/${filename}`
            const payload = {
                path,
                type: file.type,
                status: "private"
            }
            const options = {
                headers: {
                    'Content-Type': file.type
                }
            }
            const {data} = await Httpinterceptor.post("/storage/upload", payload)
            await Httpinterceptor.put(data.url, file, options)
            
            socket.emit("attachment", {
                from: session,
                to: id,
                message: filename,
                file: {
                    path,
                    type: file.type
                }
            })
        } catch (error) {
            CatchError(error)
        }
    }

    const download = async (path: string) => {
        try {
            const filename:any = path.split("/").pop()
            const {data} = await Httpinterceptor.post("/storage/download", {path})
            const a = document.createElement("a")
            a.href = data.url
            a.download = filename
            a.click()
            a.remove()
        } catch (error) {
            CatchError(error)
        }
    }
    
    return (
        <div>
            <div className="h-[450px] overflow-auto space-y-12 pr-6 relative">
                {
                    chats.map((item:any, index:number) => (
                        <div className="space-y-12" key={index}>
                            {
                                ((item.from.id === session.id) || (item.from._id === session.id)) ?
                                <div className="flex gap-4 items-start">
                                    <div className="gap-3 flex flex-col relative bg-violet-50 px-4 py-2 rounded-lg flex-1 text-blue-500 border border-violet-100">
                                        <h1 className="font-medium text-black">{session.fullname}</h1>
                                        { item.file && <AttachmentUi file={item.file} /> }
                                        <label>{item.message}</label>
                                        {
                                            item.file &&
                                            <div>
                                                <SmallButton onClick={() => download(item.file.path)} type="danger" icon="download-line">download</SmallButton>
                                            </div>
                                        }
                                        <div className="text-gray-500 text-right text-xs">
                                            {moment().format('MMM DD, YYYY hh:mm:ss A')}
                                        </div>
                                        <i className="ri-arrow-right-s-fill absolute top-0 -right-5 text-4xl text-violet-50"></i>
                                    </div>
                                    <Avatar image={session.image || "/images/avt.avif"} size="md" />
                                </div> :
                                <div className="flex gap-4 items-start">
                                    <Avatar image={item.from.image || "/images/avt.avif"} size="md" />
                                    <div className="gap-3 flex flex-col relative bg-rose-50 px-4 py-2 rounded-lg flex-1 text-pink-500 border border-rose-100">
                                        <h1 className="font-medium text-black capitalize">{item.from.fullname}</h1>
                                        { item.file && <AttachmentUi file={item.file} /> }
                                        <label>{item.message}</label>
                                        {
                                            item.file &&
                                            <div>
                                                <SmallButton onClick={() => download(item.file.path)} type="success" icon="download-line">download</SmallButton>
                                            </div>
                                        }
                                        <div className="text-gray-500 text-right text-xs">
                                            {moment().format('MMM DD, YYYY hh:mm:ss A')}
                                        </div>
                                        <i className="ri-arrow-left-s-fill absolute top-0 -left-5 text-4xl text-rose-50"></i>
                                    </div>
                                </div>
                            }
                        </div>
                    ))
                }
            </div>

            <div className="p-3">
                <div className="flex tems-center gap-4">
                    <Form className="flex gap-4 flex-1" onValue={sendMessage} reset>
                        <Input name="message" placeholder="Type your message here" />
                        <Button type="secondary" icon="send-plane-fill">Send</Button>
                    </Form>
                    <button className="relative h-12 w-12 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white">
                        <i className="ri-attachment-2"></i> 
                        <input onChange={fileSharing} type="file" className="bg-rose-500 w-full h-full absolute top-0 left-0 rounded-full opacity-0" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat