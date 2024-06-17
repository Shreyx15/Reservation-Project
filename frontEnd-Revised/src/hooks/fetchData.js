import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../Firebase";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { isGoogleLogin, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const config = {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                };

                let updatedUrl = url;
                if (updatedUrl.includes('?')) {
                    updatedUrl += `&isGoogleLogin=${isGoogleLogin}`;
                } else {
                    updatedUrl += `?isGoogleLogin=${isGoogleLogin}`;
                }

                const res = await axios.get(updatedUrl, config);
                setData(res.data);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        }
        fetchData();
    }, [url, token]);

    const reFetch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(url, { withCredentials: true });
            setData(res.data);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    }


    return { data, error, loading, reFetch };

}
export default useFetch;