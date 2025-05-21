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

const FreindSuggestion = () => {
    const [loading, setLoading] = useState<LoadingInterface>({state: false, index: 0})
    const {data, error, isLoading} = useSWR("/freind/suggestion", Fetcher)

    const sendFreindRequest = async (id: string, index: number) => {
        try {
            setLoading({state:true, index})
            await Httpinterceptor.post('/freind', {freind: id})
            toast.success("Freind request sent !")
            mutate("/freind/suggestion")
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
            <Card title="Add new freinds" divider>
                { isLoading && <Skeleton active />}

                { error && <Error message={error.message}/> }

                {    
                    data && 
                    <div className="space-y-8">
                        {
                            data.map((item: any, index: number) => (
                                <div className="space-y-4" key={index}>
                                    <div className="flex gap-4 items-center">
                                        <img src={item.image || "/images/avt.avif"} alt="avt" className="w-12 h-12 rounded object-cover" />
                                        <div>
                                            <h1 className="text-black font-medium capitalize">{ item.fullname }</h1>
                                            <small className="text-gray-400">{ moment(item.createdAt).format('DD MMM, YYYY') }</small>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-[50%]">
                                        <SmallButton onClick={()=>sendFreindRequest(item._id, index)} type="secondary" icon="user-add-line mr-1" loading={loading.state && loading.index === index}>Add Freind</SmallButton>
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

export default FreindSuggestion