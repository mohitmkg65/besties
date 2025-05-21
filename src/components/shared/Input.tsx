import type { FC } from 'react'

interface InputInterface {
  name: string
  type?: string
  placeholder?: string
  uniqueKey?: string | number
}

const Input: FC<InputInterface> = ({uniqueKey=0, name, placeholder, type="text"}) => {
  return (
    <input key={uniqueKey} className='border border-gray-300 rounded px-3 py-2 w-full' type={type} name={name} placeholder={placeholder} />
  )
}

export default Input