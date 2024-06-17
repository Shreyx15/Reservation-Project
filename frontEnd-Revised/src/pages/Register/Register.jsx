import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import "./register.css";

const Register = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    const { email } = state;

    const [credentials, setCredentials] = useState({
        username: undefined,
        email,
        password: undefined,
        phone: undefined
    });

    const handleChange = (e) => {
        const id = e.target.id;

        setCredentials({
            ...credentials,
            [id.substring(0, id.length - 4)]: e.target.value
        });
    }

    const handleUserRegister = async () => {
        const user_response = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to submit the form?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'No, cancel!',
        });


        if (user_response.isConfirmed) {
            try {
                const res = await axios.post('/auth/register', credentials);

                const { data, status } = res;

                if (status == 200 || Math.floor(status / 100) == 2) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'User Registration Completed!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/login');
                        }
                    });
                }

            } catch (error) {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again later.'
                }).then((click) => {
                    if (click.isConfirmed) {
                        window.location.reload();
                    }
                });

            }

        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" className='user-reg-container'>
            <Grid item xs={12} sm={10} md={4} lg={3} className='user-register'>
                <div className="register-title">
                    Register Here
                </div>

                <div className="reg-info-container">

                    <TextField
                        type="text"
                        id="username-reg"
                        placeholder="Username"
                        onChange={handleChange}
                    />

                    <TextField
                        type="text"
                        id="password-reg"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <TextField
                        type="text"
                        id="phone-reg"
                        placeholder="Phone"
                        onChange={handleChange}
                    />

                </div>

                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleUserRegister}
                >
                    Submit
                </Button>
            </Grid>
        </Grid>
    );
};

export default Register;