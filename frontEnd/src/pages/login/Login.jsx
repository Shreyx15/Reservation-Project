import { useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined
    });

    const { loading, error, user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    }

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await axios.post("/auth/login", credentials);
            console.log(res.data);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            navigate("/home");
        } catch (error) {
            console.error(error);
            dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
        }
    }

    return (
        <div className="login">
            <div className="lContainer">
                <input type="text" id="username" placeholder="username" onChange={handleChange} className="lInput" />
                <input type="text" id="password" placeholder="password" onChange={handleChange} className="lInput" />
                <button className="lButton" onClick={handleClick}>Login</button>
                {error && <span>{error?.message}</span>}
            </div>
        </div>
    );
};

export default Login;