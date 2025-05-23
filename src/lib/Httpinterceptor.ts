const env = import.meta.env
import axios from "axios";

const Httpinterceptor = axios.create({
    baseURL: env.VITE_SERVER,
    withCredentials: true
})

export default Httpinterceptor