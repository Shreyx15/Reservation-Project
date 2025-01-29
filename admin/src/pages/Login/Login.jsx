import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { TextField, Button } from '@mui/material';
import './login.scss';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const form = document.getElementById('login');
        const action = {
            type: "LOGIN_START"
        };

        dispatch(action);

        const formData = new FormData(form);

        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            const res = await axios.post(`${process.env.BACKEND_HOSTED_URL}/auth/login`, formData, { headers });
            const { data, status } = res;
            if (status == 200 || Math.floor(status / 100) == 2) {
                const { user, token } = data;

                const action = {
                    type: "LOGIN_SUCCESS",
                    payload: {
                        user,
                        token
                    }
                };

                dispatch(action);
                navigate('/');

            }

        } catch (error) {
            console.error(error);
        }
    }


    return (
        <Grid container className='custom_login_container' justifyContent='center' alignItems='center'>
            <Grid item xs={12} sm={10} md={5} lg={3} className='login_container'>
                <div className="loginTitle">
                    Login
                </div>
                <form id="login">
                    <TextField
                        type='text'
                        name="username"
                        label="Username"
                    />
                    <TextField
                        type='text'
                        name="password"
                        label="Password"
                    />
                    <Button type="submit" variant='contained' color='primary' onClick={handleLogin}>
                        Login
                    </Button>
                </form>
            </Grid>
        </Grid>
    );
}

export default Login;
