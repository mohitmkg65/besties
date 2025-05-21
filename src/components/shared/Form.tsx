import type{  FC, FormEvent, ReactNode } from "react"

export type FormDataType = Record<string, string>

interface FormInterface {
    children: ReactNode
    className: string
    onValue?: (value: FormDataType) => void
}

const Form:FC<FormInterface> = ({children, className, onValue}) => {
    const handleForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const data:FormDataType = {}
        const formData = new FormData(form)
        formData.forEach((value, name) => {
            data[name] = value.toString()
        })
        if(onValue)
            onValue(data)
            
    }
    return (
        <form action="" className={className} onSubmit={handleForm}>
            {children}
        </form>
    )
}

export default Form