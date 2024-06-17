import { Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./mailVerification.css";

const MailVerification = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleClick = async () => {

        try {
            const res = await axios.post('/auth/mailVerification', { email });
            const { data, status } = res;

            if (!data.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'E-mail already Exists! Please Enter valid Email.'
                }).then((click) => {
                    if (click.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                navigate('/verifyOTP', { state: { email } });
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
            console.error(error);
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" className='mail-verfification-container'>
            <Grid item xs={12} sm={10} md={5} lg={4} className='mail-verification'>
                <div className="mail-verification-title">Enter Your Email To Verify.</div>

                <TextField
                    type="text"
                    placeholder="E-Mail"
                    onChange={(e) => { setEmail(e.target.value) }}
                />

                <Button variant='contained' color='primary' onClick={handleClick}>Submit</Button>
            </Grid>
        </Grid>
    );
};

export default MailVerification;