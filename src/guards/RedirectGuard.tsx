import { useContext, useEffect } from "react"
import Httpinterceptor from "../lib/Httpinterceptor"
import Context from "../Context"
import { Navigate, Outlet } from "react-router-dom"
import { Skeleton } from "antd"

const RedirectGuard = () => {
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
        return <Outlet  />

    return <Navigate to="/app" />
}

export default RedirectGuard