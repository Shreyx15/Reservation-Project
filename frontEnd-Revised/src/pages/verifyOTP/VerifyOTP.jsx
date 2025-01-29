import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import "./verifyOTP.css";

const VerifyOTP = () => {
    const { state } = useLocation();
    const { email } = state;
    const [otp, setOtp] = useState();
    const navigate = useNavigate();
    // console.log(email);

    const verifyOTP = async () => {
        const res = await axios.post(`${process.env.BACKEND_HOSTED_URL}/auth/verifyOTP`, { email, otp });
        const { success } = res.data;

        if (!success) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'OTP Not Valid!'
            }).then((click) => {
                if (click.isConfirmed) {
                    navigate('/emailVerification');
                }
            });
        } else {
            navigate('/register', { state: { email } });
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" className='otp-container'>
            <Grid item xs={12} sm={10} md={8} lg={4} className='otp'>
                <div className="otp-title">OTP has been sent to your E-mail!</div>
                <TextField
                    type='text'
                    id="otp"
                    onChange={(e) => { setOtp(e.target.value) }}
                    placeholder="Enter OTP"
                />
                <Button variant='contained' color='primary' onClick={verifyOTP}>Verify OTP</Button>
            </Grid>
        </Grid>
    );
}

export default VerifyOTP;
