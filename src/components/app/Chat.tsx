import { useContext, useEffect, useState } from "react"
import Avatar from "../shared/Avatar"
import Button from "../shared/Button"
import Input from "../shared/Input"
import socket from "../../lib/socket"
import Form from "../shared/Form"
import Context from "../../Context"
import { useParams } from "react-router-dom"

interface MessageReceivedInterface {
    from: string,
    message: string
}

const Chat = () => {
    const [chats, setChats] = useState<any>([])
    const {session} = useContext(Context)
    const {id} = useParams()

    const messageHandler = (messageReceived: MessageReceivedInterface) => {
        setChats((prev:any) => [...prev, messageReceived])
    }

    useEffect(() => {
        socket.on("message", messageHandler) 
        return () => {
            socket.off("message", messageHandler)
        }
    }, [])


    const sendMessage = (values: any) => {
        const payload = {
            from: session,
            to: id,
            message: values.message
        }
        setChats((prev:any) => [...prev, payload])
        socket.emit("message", payload)
    }
    
    return (
        <div>
            <div className="h-[450px] overflow-auto space-y-12 pr-6 relative">
                {
                    chats.map((item:any, index:number) => (
                        <div className="space-y-12" key={index}>
                            {
                                (item.from.id === session.id) ?
                                <div className="flex gap-4 items-start">
                                    <div className="relative bg-violet-50 px-4 py-2 rounded-lg flex-1 text-blue-500 border border-violet-100">
                                        <h1 className="font-medium text-black">{session.fullname}</h1>
                                        <label>{item.message}</label>
                                        <i className="ri-arrow-right-s-fill absolute top-0 -right-5 text-4xl text-violet-50"></i>
                                    </div>
                                    <Avatar image={session.image || "/images/avt.avif"} size="md" />
                                </div> :
                                <div className="flex gap-4 items-start">
                                    <Avatar image={item.from.image || "/images/avt.avif"} size="md" />
                                    <div className="relative bg-rose-50 px-4 py-2 rounded-lg flex-1 text-pink-500 border border-rose-100">
                                        <h1 className="font-medium text-black capitalize">{item.from.fullname}</h1>
                                        <label>{item.message}</label>
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
                    <Form className="flex gap-4 flex-1" onValue={sendMessage}>
                        <Input name="message" placeholder="Type your message here" />
                        <Button type="secondary" icon="send-plane-fill">Send</Button>
                    </Form>
                    <button className="h-12 w-12 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white"><i className="ri-attachment-2"></i> </button>
                </div>
            </div>
        </div>
    )
}

export default Chat