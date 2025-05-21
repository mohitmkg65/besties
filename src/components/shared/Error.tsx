import type { FC } from "react"

interface Errorinterface {
    message: string
}
const Error:FC<Errorinterface> = ({message}) => {
    return (
        <div className="animate__animated animate__fadeIn flex items-start p-4 bg-red-100 text-red-700 border border-red-300 rounded-xl space-x-3">
            <i className="ri-error-warning-fill text-2xl text-red-600"></i>
            <div>
                <h3 className="font-semibold text-base">Something went wrong</h3>
                {message && <p className="text-sm mt-1">{message}</p>}
            </div>
        </div>
    );
}

export default Error
