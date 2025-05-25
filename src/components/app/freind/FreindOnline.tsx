import { useContext, useEffect, useState } from "react"
import Card from "../../shared/Card"
import socket from "../../../lib/socket"
import { Link } from "react-router-dom"
import Context from "../../../Context"

const FreindOnline = () => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const {session} = useContext(Context)
    console.log(onlineUsers)
    const onlineHandler = (users: any) => {
        setOnlineUsers(users)
    }

    useEffect(() => {
        socket.on("online", onlineHandler)
        socket.emit("get-online")
        return () => {
            socket.off("online", onlineHandler)
        }
    }, [])

    return (
        <Card title="Online feinds" divider>
            {
                session && onlineUsers.filter((item: any) => item.id !== session.id).map((item: any, index) => (
                    <div key={index} className="flex gap-3 mt-4">
                        <img src={item.image ? item.image : "/images/avt.avif"} alt="avt" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <h1 className="font-medium">{ item.fullname }</h1>
                            <div className="flex items-center gap-3">
                                <label className={"text-[10px] font-medium text-green-500 capitalize"}>online</label>
                                <Link to="/app/chat">
                                    <i className="ri-chat-ai-line text-rose-400"></i>
                                </Link>
                                <Link to="/app/audio-chat">
                                    <i className="ri-phone-line text-amber-400"></i>
                                </Link>
                                <Link to="/app/video-chat">
                                    <i className="ri-video-on-ai-line text-green-400"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            }
        </Card>
    )
} 

export default FreindOnline