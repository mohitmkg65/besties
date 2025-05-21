import CatchError from "./CatchError"
import Httpinterceptor from "./Httpinterceptor"

const Fetcher = async (url: string) => {
    try {
        const { data } = await Httpinterceptor.get(url)
        return data
    } catch (error) {
        CatchError(error, 'bottom-center')
    }
}

export default Fetcher