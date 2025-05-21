import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"
import { useContext, useEffect, useState } from "react"
import Dashboard from "./Dashboard"
import Context from "../../Context"
import Httpinterceptor from "../../lib/Httpinterceptor"
import {v4 as uuid} from "uuid"
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/Fetcher"
import CatchError from "../../lib/CatchError"
import FreindSuggestion from "./FreindSuggestion"
import FreindRequest from "./FreindRequest"
const EightMinuteInMs = (5*60)*1000

const Layout = () => {
    const [leftAsideSize, setleftAsideSize] = useState(350)
    const rightAsideSize = 450
    const collapseSize = 140
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const {session, setSession} = useContext(Context)
    const {error} = useSWR('/auth/refresh-token', Fetcher, {
        refreshInterval: EightMinuteInMs,
        shouldRetryOnError: false
    })
    
    useEffect(() => {
        if(error){
            logout()
        }
    }, [error])

    const sectionDimension = {
        width: `calc(100% - ${leftAsideSize + rightAsideSize}px)`,
        marginLeft: leftAsideSize,
        transition: '0.3s'
    }
    const menus = [
        {
            href: "/app/dashboard",
            label: "Dashboard",
            icon: "ri-home-9-line"
        },
        {
            href: "/app/my-posts",
            label: "My Post",
            icon: "ri-chat-smile-3-line"
        },
        {
            href: "/app/freinds",
            label: "Freinds",
            icon: "ri-group-line"
        },
    ]

    const logout = async () => {
        try {
            await Httpinterceptor.post('/auth/logout')
            navigate('/login')
        } catch (error) {
            CatchError(error)
        }
    }

    const getPathname = (path: string) => {
        return path.split('/').pop()?.split('-').join(' ')
    }

    const uploadImage = () => {
        const input = document.createElement('input')
        input.type = "file"
        input.accept = "image/*"
        input.click()
        input.onchange = async () => {
            if(!input.files)
                return

            const file = input.files[0]
            const path = `profile-pictures/${uuid()}.png`
            const payload = {
                path,
                type: file.type,
                status: "public-read"
            }
            try {
                const options = {
                    headers: {
                        'Content-Type': file.type 
                    }
                }
                const { data } = await Httpinterceptor.post('/storage/upload', payload)
                await Httpinterceptor.put(data.url, file, options)
                const { data: user } = await Httpinterceptor.put('/auth/profile-picture', {path})
                setSession({...session, image: user.image})
                mutate('/auth/refresh-token')
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className="min-h-screen">
            <aside className="bg-white fixed top-0 left-0 h-full p-8 overflow-auto" style={{width: leftAsideSize, transition: '0.3s'}}>
                <div className="space-y-8 h-full rounded-2xl p-8 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
                    {
                        leftAsideSize === collapseSize ? 
                        <i className="ri-user-fill text-xl text-white animate__animated animate__fadeIn"></i> :
                        <div className="animate__animated animate__fadeIn">
                            {
                                session && 
                                <Avatar image={session.image || "/images/avt.avif"} size="lg" title={session.fullname} subtitle={session.email} titleColor="white" subtitleColor="#ddd" onClick={uploadImage}></Avatar>
                            }
                        </div>
                    }
                    <div>
                        {
                            menus.map((item, index) => (
                                <Link to={ item.href } className="flex items-center gap-3 text-gray-300 py-3 hover:text-white" key={ index }>
                                    <i className={`${item.icon} text-lg`} title={item.label}></i>
                                    <label className={`capitalize ${leftAsideSize === collapseSize ? 'hidden' : ''}`}>{ item.label }</label>
                                </Link>
                            ))
                        }
                        
                        <button onClick={logout} className="flex items-center gap-3 text-gray-300 py-3 hover:text-white">
                            <i className="ri-logout-circle-r-line text-xl" title="Logout"></i>
                            <label className={leftAsideSize === collapseSize ? 'hidden' : ''}>Logout</label>
                        </button>
                    </div>
                </div>
            </aside>

            <section className="py-8 px-1" style={sectionDimension}>
                <Card title={ <div className="flex gap-4 items-center">
                    <button className="bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={ () => setleftAsideSize(leftAsideSize === collapseSize ? 350 : collapseSize) }><i className="ri-arrow-left-line"></i></button>
                    <h1>{getPathname(pathname)}</h1>
                    </div>
                } divider>
                    {
                        pathname === '/app' ? <Dashboard /> : <Outlet />
                    }
                </Card>
            </section>

            <aside className="bg-white fixed top-0 right-0 h-full p-8 overflow-auto space-y-8" style={{width: rightAsideSize}}>
                <FreindSuggestion />
                <FreindRequest />

                <Card title="Freinds" divider>
                    <div className="space-y-4">
                        {
                            Array(20).fill(0).map((item, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between">
                                    <Avatar image="/images/avt.avif" size="md" title="Mohit Gupta" subtitle = { <small className={`${index%2 === 0 ? 'text-green-400' : 'text-zinc-400'} font-medium`}>{index%2 === 0 ? 'Online' : 'Offline'}</small> } />
                                    <div className="space-x-3">
                                        <Link to="/app/chat">
                                            <button className="text-blue-500 hover:text-blue-600" title="Chat">
                                                <i className="ri-chat-ai-line"></i>
                                            </button>
                                        </Link>
                                        <Link to="/app/audio-chat">
                                            <button className="text-green-400 hover:text-green-500" title="Call">
                                                <i className="ri-phone-line"></i>
                                            </button>
                                        </Link>
                                        <Link to="/app/video-chat">
                                            <button className="text-amber-500 hover:text-amber-600" title="Video call">
                                                <i className="ri-video-on-ai-line"></i>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Card>
            </aside>
        </div>
    )
}

export default Layout