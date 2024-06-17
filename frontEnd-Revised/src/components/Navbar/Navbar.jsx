import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { handleFirebaseLogout } from "../../Firebase";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
    const auth = useContext(AuthContext);
    const { user, isGoogleLogin } = useContext(AuthContext);
    const [displayOptions, setDisplayOptions] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await Swal.fire({
                icon: 'warning',
                title: 'Confirm Logout?',
                text: 'Are you sure you want to logout?',
                showCancelButton: true,
                confirmButtonText: 'Yes, Logout',
                cancelButtonText: 'Cancel',
            });

            if (response.isConfirmed) {
                if (auth.isGoogleLogin) {
                    await handleFirebaseLogout(auth.dispatch);
                    navigate("/login");
                    return;
                }

                const res = await axios.post("/auth/logout", { isGoogleLogin: auth.isGoogleLogin });
                const { status } = res;

                if (status == 200) {
                    console.log(res);
                    const action = {
                        type: "LOGOUT"
                    }
                    auth.dispatch(action);
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error(error);
        }

    }
    return (
        <div className="navbar">
            <div className="navContainer">
                <span className="logo">Booking App</span>
                <div className="navItems">
                    {localStorage.getItem("user") ?
                        <div className="mini-profile">

                            <img src={user?.img ? user.img : 'https://res.cloudinary.com/drq6qjbpg/image/upload/v1705511744/ReservationApp/Users/user_placeholder.webp'} alt="No Image Uploaded" srcset="" className="mini-profile-img" onClick={() => { setDisplayOptions(!displayOptions) }} />
                        </div> :
                        <>
                            <button className="navButton">Register</button>
                            <button className="navButton">Login</button>
                        </>
                    }
                    {displayOptions &&
                        <div className="profile-options">
                            <div className="p-option">
                                <Link to="/updateProfile" className="p-link"><p>My Profie</p></Link>
                            </div>
                            <div className="p-option">
                                <Link to="/myBookings" className="p-link"><p>My Bookings</p></Link>
                            </div>
                            <div className="p-option">
                                <p className="p-link" onClick={handleLogout}><p>LogOut</p></p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}


export default Navbar;