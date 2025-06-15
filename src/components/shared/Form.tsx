import type{  FC, FormEvent, ReactNode } from "react"

export type FormDataType = Record<string, string>

interface FormInterface {
    children: ReactNode
    className: string
    reset?: boolean
    onValue?: (value: FormDataType) => void
}

const Form:FC<FormInterface> = ({children, className, reset=false, onValue}) => {
    const handleForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const data:FormDataType = {}
        const formData = new FormData(form)
        formData.forEach((value, name) => {
            data[name] = value.toString()
        })
        if(onValue){
            onValue(data)
            reset && form.reset()
        }
            
    }
    return (
        <form action="" className={className} onSubmit={handleForm}>
            {children}
        </form>
    )
}

export default Form