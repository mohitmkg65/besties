import axios from "axios";

const Httpinterceptor = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
})

export default Httpinterceptor