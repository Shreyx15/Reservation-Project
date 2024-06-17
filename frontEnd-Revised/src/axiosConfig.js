import axios from "axios";

const token = localStorage.getItem("token");
const isGoogleLogin = localStorage.getItem("isGoogleLogin");
console.log(token + "from the axios config");
const axiosInstance = axios.create({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

export { axiosInstance as axios };

