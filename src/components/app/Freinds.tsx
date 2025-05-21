import useSWR, { mutate } from "swr"
import Card from "../shared/Card"
import Fetcher from "../../lib/Fetcher"
import { Empty, Skeleton } from "antd"
import Error from "../shared/Error"
import CatchError from "../../lib/CatchError"
import Httpinterceptor from "../../lib/Httpinterceptor"
import { toast } from "react-toastify"

const Freinds = () => {
    const {data, error, isLoading} = useSWR("/freind", Fetcher)

    if(isLoading)
        return <Skeleton active />

    if(error)
        return <Error message={error.messge}/>

    const unfreind = async (id: string) => {
        try {
            Httpinterceptor.delete(`/freind/${id}`)
            // toast.success("Unfreind successfully !")
            mutate("/freind/suggestion")
            mutate("/freind")
        } catch (error) {
            CatchError(error)
        }
    }

    return (
        <div className="grid grid-cols-3 gap-8">
            {
                data.map((item: any, index: number) => (
                    <Card uniqueKey={index} >
                        <div className="flex flex-col items-center gap-3">
                            <img src={item.freind.image || "/images/avt.avif"} alt="avt" className="w-16 h-16 rounded-full object-cover" />
                            <h1 className="text-base font-medium text-black">{ item.freind.fullname }</h1>
                            {
                                item.status === 'accepted' ?
                                <button onClick={() => unfreind(item._id)} className="bg-rose-400 text-white rounded px-2 py-1 text-xs hover:bg-rose-500 mt-1 font-medium"><i className="ri-user-minus-line mr-1"></i>Unfreind</button> :
                                <button className="bg-green-400 text-white rounded px-2 py-1 text-xs hover:bg-gray-400 mt-1 font-medium"><i className="ri-check-double-line mr-1"></i>Request sent</button>
                            }
                        </div>
                    </Card>
                ))
            }

            {
                (data && data.length === 0) &&
                <Empty />
            }
        </div>
    )
}

export default Freinds