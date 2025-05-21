import type { FC, ReactNode } from "react"

interface AvatarInterface {
  title?: string | null
  subtitle?: ReactNode
  image?: string
  titleColor?: string
  subtitleColor?: string
  size?: "lg" | "md"
  uniqueKey?: string | number
  onClick?: ()=>void
}

const Avatar: FC<AvatarInterface> = ({uniqueKey=0, size="lg", title, subtitle="Subtitle missing", image, titleColor="#000000", subtitleColor="#f5f5f5", onClick}) => {
  return (
    <div className="flex gap-3 items-center" key={uniqueKey}>
      { image && <img onClick={onClick} src={image} className={`${size === "lg" ? "w-12 h-12" : "w-8 h-8"} rounded-full object-cover`} /> }
      {
        (title && subtitle) &&
        <div className="flex flex-col">
          <h1 className={`${size === "lg" ? "text-lg/6" : "text-sm"} font-medium`} style={{color: titleColor}}> {title} </h1>
          <div style={{color: subtitleColor}}> {subtitle} </div>
        </div>
      }
    </div>
  )
}

export default Avatar