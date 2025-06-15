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
import FriedSuggestion from "./freind/FreindSuggestion"
import FreindRequest from "./freind/FreindRequest"
import { useMediaQuery } from 'react-responsive'
import IconButton from "../shared/IconButton"
import Logo from "../shared/Logo"
import FreindOnline from "./freind/FreindOnline"
const EightMinuteInMs = (5*60)*1000


const Layout = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const [leftAsideSize, setleftAsideSize] = useState(0)
    const [collapseSize, setCollapseSize] = useState(0)
    const rightAsideSize = 450
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const {session, setSession} = useContext(Context)
    const {error} = useSWR('/auth/refresh-token', Fetcher, {
        refreshInterval: EightMinuteInMs,
        shouldRetryOnError: false
    })

    const friendsUiBlacklist = ["/app/freinds", "/app/chat", "/app/audio-chat", "/app/video-chat"]
    const isBlacklisted = friendsUiBlacklist.some((path)=>pathname === path)
    
    useEffect(() => {
        if(error){
            logout()
        }
    }, [error])

    useEffect(()=>{
        setleftAsideSize(isMobile ? 0 : 350)
        setCollapseSize(isMobile ? 0 : 140)
    }, [isMobile])

    const sectionDimension = {
        width: isMobile ? '100%' : `calc(100% - ${leftAsideSize}px)`,
        marginLeft: isMobile ? 0 : leftAsideSize,
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
            <nav className="lg:hidden flex justify-between items-center bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 sticky top-0 left-0 z-[20000] w-full py-4 px-6">
                <Logo />
                <div className="flex gap-4">
                    <IconButton onClick={logout} icon="logout-circle-line" type="success" />
                    <Link to="/app/friends">
                        <IconButton icon="chat-ai-line" type="danger" />
                    </Link>
                    <IconButton  onClick={()=>setleftAsideSize(leftAsideSize === 250 ? collapseSize : 250)} icon="menu-3-line" type="warning" />
                </div>
            </nav>

            <aside className="bg-white fixed top-0 left-0 h-full lg:p-8 overflow-auto z-[20000]" style={{width: leftAsideSize, transition: '0.3s'}}>
                <div className="space-y-8 h-full lg:rounded-2xl p-8 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
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

            <section className="lg:py-8 lg:px-1 p-6 flex flex-1 lg:flex-row flex-col gap-6" style={sectionDimension}>
                {/* {
                    !isBlacklisted &&
                    <FreindRequest />
                } */}
                <div className="">
                    <Card title={ <div className="flex gap-4 items-center">
                        <button className="lg:block hidden bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={ () => setleftAsideSize(leftAsideSize === collapseSize ? 350 : collapseSize) }><i className="ri-arrow-left-line"></i></button>
                        <h1>{getPathname(pathname)}</h1>
                        </div>
                    } divider>
                        {
                            pathname === '/app' ? <Dashboard /> : <Outlet />
                        }
                    </Card>
                </div>
                {/* {
                    !isBlacklisted &&
                    <FriedSuggestion />
                } */}
                <aside className="bg-white lg:w-[300px] lg:pr-6">
                    <FreindOnline />
                </aside>
            </section>

        </div>
    )
}

export default Layout