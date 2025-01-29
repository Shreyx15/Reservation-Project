import { useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import GoogleIcon from '@mui/icons-material/Google';
import { handleGoogleLogin } from "../../Firebase";
import { Tooltip, Grid, TextField, Button } from "@mui/material";

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
            const res = await axios.post(`${process.env.BACKEND_HOSTED_URL}/auth/login`, credentials);
            console.log(res.data);
            const { data } = res;
            const payload = {
                user: data.user,
                token: data.token,
                isGoogleLogin: false
            };
            dispatch({ type: "LOGIN_SUCCESS", payload });
            navigate("/home");
        } catch (error) {
            console.error(error);
            dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
        }
    }


    const handleIconClick = async () => {
        try {
            const action = {
                type: "LOGIN_START"
            };
            dispatch(action);
            const firebase_res = await handleGoogleLogin();
            const { user, _tokenResponse } = firebase_res;
            const { idToken } = _tokenResponse;

            const body = {
                isGoogleLogin: true,
                user
            };

            const login_res = await axios.post(`${process.env.BACKEND_HOSTED_URL}/auth/login`, body);
            const { status, data } = login_res;
            if (status == 200) {
                action.type = "LOGIN_SUCCESS";
                action.payload = {
                    user,
                    token: idToken,
                    isGoogleLogin: true
                };

                dispatch(action);
                navigate("/home");
            }
        } catch (error) {
            console.error(error);
        }

        // console.log(res);
    }

    return (
        <Grid container justifyContent="center" alignItems="center" className="loginContainer-user">
            <Grid item xs={12} sm={10} md={3} lg={3} className="user-login" >
                <div className="user-login-title">
                    User Login
                </div>
                <div className="login-info-container">

                    <div className="gIconContainer">
                        Sign In With
                        <Tooltip title="Sign In with Google">
                            <GoogleIcon className='gIcon' onClick={handleIconClick} />
                        </Tooltip>
                    </div>
                    <hr className="style-two" />

                    <div container className="lContainer">
                        <Link to="/emailVerification" className="signUpText">Not A User? Register Here</Link>
                        <TextField type="text" id="username" placeholder="username" onChange={handleChange} className="lInput" />
                        <TextField type="text" id="password" placeholder="password" onChange={handleChange} className="lInput" />
                        <Button className="lButton" color='primary' variant="contained" onClick={handleClick}>Login</Button>
                        {error && <span>{error?.message}</span>}
                    </div>

                </div>

            </Grid>
        </Grid>

    );
};

export default Login;