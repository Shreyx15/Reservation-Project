import { useContext, useEffect, useState } from "react";
import { axios } from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { verifyFirebaseToken } from "../Firebase";
import { useNavigate } from "react-router-dom";


const useAuthCheck = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isGoogleLogin, dispatch, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const checkAuthentication = async () => {
            const handleTokenExpired = () => {
                let timerInterval;
                Swal.fire({
                    icon: 'warning',
                    title: 'Token is Expired or Invalid!',
                    html: "Redirecting to Login Page in <b></b> Seconds.",
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const b = Swal.getHtmlContainer().querySelector('b');
                        let timer = 5;

                        timerInterval = setInterval(() => {
                            b.textContent = timer--;
                        }, 1000);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                })
                    .then((result) => {
                        const action = {
                            type: 'LOGOUT'
                        };
                        dispatch(action);
                        navigate('/login');
                    });
            }

            if (isGoogleLogin) {
                const isLoggedIn = await verifyFirebaseToken();
                setIsLoggedIn(isLoggedIn);

                if (!isLoggedIn) {
                    handleTokenExpired();
                }
            } else {
                const res = await axios.post('/auth/checkAuthentication', { token, isGoogleLogin });
                const { data, status } = res;

                if (status !== 200 || status === 401) {
                    setIsLoggedIn(false);
                    navigate('/login');
                } else if (status == 200 && data.isLoggedIn) {
                    setIsLoggedIn(true);
                } else if (status === 200 && data.token && !data.isLoggedIn) {
                    setIsLoggedIn(false);
                    handleTokenExpired();
                }
            }

        }
        checkAuthentication();
        const intervalId = setInterval(checkAuthentication, 10000);

        return () => clearInterval(intervalId);

    }, [token]);


    return { isLoggedIn };
}

export default useAuthCheck;