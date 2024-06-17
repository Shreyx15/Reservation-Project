import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const useAuthCheck = (authDispatch) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const checkAuthentication = async () => {
            const handleTokenExpired = async () => {
                let timerInterval;
                Swal.fire({
                    icon: 'warning',
                    title: "Token Expired!",
                    html: "Redirecting to Login Page in <b></b> Seconds.",
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const b = Swal.getHtmlContainer().querySelector("b");
                        let timer = 5;
                        timerInterval = setInterval(() => {
                            b.textContent = timer--;
                        }, 1000);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                }).then((result) => {
                    const action = {
                        type: 'LOGOUT'
                    };
                    authDispatch(action);
                    window.location.href = "http://localhost:3000/login";
                });
            };


            const res = await axios.post("/auth/checkAuthentication", { token });
            const { data, status } = res;

            if (status == 200 && data.isLoggedIn) {
                setIsLoggedIn(true);
                console.log(data);
            } else if (!data.isLoggedIn) {
                setIsLoggedIn(false);
                handleTokenExpired();
            }
        }

        checkAuthentication();
        const intervalId = setInterval(checkAuthentication, 60000);
        return () => clearInterval(intervalId);

    }, []);

    return { isLoggedIn };
}

export default useAuthCheck;