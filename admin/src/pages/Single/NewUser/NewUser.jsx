import React, { useContext, useRef, useState } from 'react';
import DrawerMUI from '../../../components/Sidebar/DrawerMUI';
import Navbar from '../../../components/Navbar/Navbar';
import { Container, TextField, Button, Input, InputLabel, Tooltip, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { themeContext } from '../../../context/themeContext';
import "./newUser.scss";
import { Label, Mail } from '@mui/icons-material';
import axios, { formToJSON } from 'axios';
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import Grid from "@mui/material/Grid";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import useAuthCheck from '../../../hooks/useAuthCheck';
import { AuthContext } from '../../../context/AuthContext';

const NewUser = () => {
    const { state } = useContext(themeContext);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef();
    const [showError, setShowError] = useState(false);
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

    const { isLoggedIn } = useAuthCheck(authDispatch);


    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                setImage(reader.result);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user_response = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to submit the form?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, submit it!',
                cancelButtonText: 'No, cancel!',
            });

            if (user_response.isConfirmed) {

                const formData = new FormData(e.target);

                // console.log(fileInputRef.current.files[0]);
                // console.log(formData.get('username'));   

                formData.append('image', fileInputRef.current.files[0]);
                if (formData.get('password') != formData.get('confirmPassword')) {
                    setShowError(true);
                    return;
                }

                const res = await axios.post(`${process.env.BACKEND_HOSTED_URL}/users/register`, formData);
                console.log(res.data);


                if (res.status === 200 || Math.floor(res.status / 100) === 2) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'User Added Successfully!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
            }
        } catch (error) {
            console.error('An error occurred during form submission:', error);
        }

    }

    const handleClick = () => {
        fileInputRef.current.click();
        console.log(fileInputRef.current);
    }


    const ALT = "https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_1280.png";

    return (
        <>
            {isLoggedIn ? (
                <CommonLayout>

                    {showError &&
                        <div className="error">
                            Password not matching with confirm Password!
                            <CloseIcon className="closeIcon" onClick={() => { setShowError(false) }} />
                        </div>
                    }
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={12} md={8} lg={10} className='form-container'>
                            <div className="title">
                                Add New User
                            </div>
                            <form id="newUserForm" onSubmit={handleSubmit}>
                                <Grid container className='user-form' gap={6} justifyContent="center">
                                    <Grid item xs={12} sm={12} md={2} lg={2} className='img-container'>
                                        <div className="imgPreview">
                                            <img src={image ? image : ALT} alt="No image uploaded" className='userImg' />
                                            <Tooltip title="Upload Image">
                                                <AddPhotoAlternateIcon onClick={handleClick} className='addIcon' />
                                            </Tooltip>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={10} lg={9} className='user-info'>
                                        <Grid container gap={3} className='form-sides-container' >
                                            <Grid item xs={12} sm={5} md={5} lg={5} className='form-sides'>
                                                <TextField
                                                    type='text'
                                                    name="username"
                                                    label="Name"
                                                    placeholder='Name'
                                                />
                                                <TextField
                                                    type='text'
                                                    name="city"
                                                    label="City"
                                                    placeholder='City'
                                                />
                                                <TextField
                                                    type='number'
                                                    name="phone"
                                                    label="Phone Number"
                                                    placeholder='Phone Number'
                                                />
                                                <TextField
                                                    type='text'
                                                    name="country"
                                                    label="Country"
                                                    placeholder='Country'
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={5} md={5} lg={5} className='form-sides'>
                                                <TextField
                                                    type='text'
                                                    name="email"
                                                    label="E-mail"
                                                    placeholder='E-mail'
                                                />
                                                <TextField
                                                    type='password'
                                                    name="password"
                                                    label="Password"
                                                    placeholder='Password'
                                                />

                                                <TextField
                                                    type='text'
                                                    name="confirmPassword"
                                                    label="Confirm Password"
                                                    placeholder='Confirm Password'
                                                />

                                                <FormControlLabel
                                                    control={<Checkbox color="primary" name='isAdmin' />}
                                                    label="isAdmin"
                                                />
                                            </Grid>
                                        </Grid>
                                        <div className="btnContainer">
                                            <Button type="submit" color='primary' variant="contained" className='controlBtn'>Submit</Button>
                                            <Button type="button" color='primary' variant="contained" className='controlBtn' >Reset</Button>
                                        </div>
                                    </Grid>
                                </Grid>

                            </form>
                        </Grid>
                    </Grid>
                </CommonLayout>
            ) : <div>User not Logged In!</div>}

        </>
    );
};

export default NewUser;