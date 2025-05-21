import { useContext, useEffect } from "react"
import Httpinterceptor from "../lib/Httpinterceptor"
import Context from "../Context"
import { Navigate, Outlet } from "react-router-dom"
import { Skeleton } from "antd"

const AuthGuard = () => {
    const {session, setSession} = useContext(Context)

    useEffect(() => {
        getSession()
    }, [])

    const getSession = async () => {
        try {
            const { data } = await Httpinterceptor.get("/auth/session") 
            setSession(data)
        } catch (error) {
            setSession(false)
        }
    }

    if(session === null)
        return <Skeleton active />
        
    if(session === false)
        return <Navigate to="/login" />

    return (
        <div><Outlet /></div>
    )
}

export default AuthGuard