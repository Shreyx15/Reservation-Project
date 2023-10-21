import { useContext } from "react";
import "./Navbar.css";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <div className="navbar">
            <div className="navContainer">
                <span className="logo">Booking App</span>
                <div className="navItems">
                    {localStorage.getItem("user") ?
                        <div>
                            {user.username}
                        </div> :
                        <>
                            <button className="navButton">Register</button>
                            <button className="navButton">Login</button>
                        </>
                    }

                </div>
            </div>
        </div>
    );
}


export default Navbar;