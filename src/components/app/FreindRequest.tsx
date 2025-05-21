import useSWR, { mutate } from "swr"
import Card from "../shared/Card"
import Fetcher from "../../lib/Fetcher"
import { Empty, Skeleton } from "antd"
import Error from "../shared/Error"
import CatchError from "../../lib/CatchError"
import Httpinterceptor from "../../lib/Httpinterceptor"
import { useState } from "react"
import SmallButton from "../shared/SmallButton"
import moment from "moment"
import { toast } from "react-toastify"

interface LoadingInterface {
    state: boolean
    index: null | number
}

const FreindRequest = () => {
    const [loading, setLoading] = useState<LoadingInterface>({state: false, index: 0})
    const {data, error, isLoading} = useSWR("/freind/request", Fetcher)
    
    const acceptFreindRequest = async (id: string, index: number) => {
        try {
            setLoading({state:true, index})
            await Httpinterceptor.put(`/freind/${id}`, {status: "accepted"})
            toast.success("Freind request accepted !")
            mutate("/freind/request")
            mutate("/freind")
        } catch (error) {
            CatchError(error)
        }
        finally {
            setLoading({state: false, index: 0})
        }
    }

    return (
        <div className="h-[400px] overflow-auto">
            <Card title="Freind's request" divider>
                { isLoading && <Skeleton active />}

                { error && <Error message={error.message}/> }

                {    
                    data && 
                    <div className="space-y-8">
                        {
                            data.map((item: any, index: number) => (
                                <div className="space-y-4" key={index}>
                                    <div className="flex gap-4 items-center">
                                        <img src={item.user.image || "/images/avt.avif"} alt="avt" className="w-12 h-12 rounded object-cover" />
                                        <div>
                                            <h1 className="text-black font-medium capitalize">{ item.user.fullname }</h1>
                                            <small className="text-gray-400">{ moment(item.createdAt).format('DD MMM, YYYY') }</small>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-[50%]">
                                        <SmallButton onClick={()=>acceptFreindRequest(item._id, index)} type="danger" icon="check-double-line mr-1" loading={loading.state && loading.index === index}>Accept</SmallButton>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }

                {
                    (data && data.length === 0) &&
                    <Empty />
                }
            </Card>
        </div>
    )
}

export default FreindRequest