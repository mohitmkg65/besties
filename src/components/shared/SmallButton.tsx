import type { FC } from 'react'
import 'remixicon/fonts/remixicon.css'

const SmallButtonModel = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded",
    secondary: "bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1.5 rounded",
    danger: "bg-rose-500 hover:bg-rose-600 text-white text-sm px-3 py-1.5 rounded",
    warning: "bg-amber-500 hover:bg-amber-600 text-white text-sm px-3 py-1.5 rounded",
    dark: "bg-zinc-500 hover:bg-zinc-600 text-white text-sm px-3 py-1.5 rounded",
    success: "bg-green-400 hover:bg-green-500 text-white text-sm px-3 py-1.5 rounded",
    info: "bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3 py-1.5 rounded"
}

interface SmallButtonInterface {
    children?: string
    type?: "primary" | "secondary" | "danger" | "warning" | "dark" | "success" | "info"
    onClick?: ()=>void
    icon?: string
    uniqueKey?: string | number
    loading?: boolean
}

const SmallButton: FC<SmallButtonInterface> = ({uniqueKey=0, children="Submit", type="primary", onClick, icon, loading})=>{
    if(loading)
    return (
        <button disabled className="text-gray-400"><i className="fa fa-spinner fa-spin me-2"></i>Processing...</button>
    )

    return (
        <button key={uniqueKey} className={SmallButtonModel[type]} onClick={onClick}>
            { icon && <i className={`ri-${icon} mr-1`}></i> }
            {children}
        </button>
    )
}

export default SmallButton