import { Input, InputLabel, TextField, Tooltip, Card, Button } from '@mui/material';
import './updateUser.css';
import Grid from '@mui/material/Grid';
import Navbar from "../../components/Navbar/Navbar";
import EditIcon from '@mui/icons-material/Edit';
import Edit from '@mui/icons-material/Edit';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Cloudinary } from "@cloudinary/url-gen";
import CloudinaryUploadWidget from '../../components/CloudinaryUploadWidget/CloudinaryUploadWidget';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateUserProfile = () => {
    const { user: userFromAuth } = useContext(AuthContext);
    const user = localStorage.getItem("user");
    const [formData, setFormData] = useState({});
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fr = new FileReader();
        fr.readAsDataURL(file);

        fr.onload = () => {
            document.getElementsByClassName("editProfile-img")[0].src = fr.result;
            setFormData({ ...formData, file: fr.result, filename: file.name });
        }
    }

    const handleSubmit = async () => {
        const confirmation = await Swal.fire({
            icon: 'warning',
            title: 'Confirm Submit?',
            text: 'Are you sure you want to Submit the changes?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Submit',
            cancelButtonText: 'Cancel',
        });

        if (confirmation.isConfirmed) {
            try {
                const submit_data = new FormData();

                for (let [key, value] of Object.entries(formData)) {
                    submit_data.set(key, value);
                }

                let public_id;
                if (userFromAuth?.img && formData.file && formData.filename) {
                    const arr = userFromAuth.img.split("/");
                    const str = arr.splice(arr.indexOf('ReservationApp')).join("/");
                    const dotIndex = str.indexOf('.');
                    public_id = str.substring(0, dotIndex);
                }

                const res = await axios.put(`/users/updateUser?id=${userFromAuth?._id}${public_id ? '&public_id=' + public_id : ''}`, submit_data);
                const { data, status } = res;

                if (status == 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'User details updated!',
                        text: 'You have successfully applied changes.',
                        confirmButtonText: 'Okay!'
                    }).then((resRedirect) => {
                        if (resRedirect.isConfirmed) {
                            navigate("/updateProfile", { replace: true });
                        }
                    });
                }
            } catch (error) {
                throw new Error(error.message);
            }
        }
    }

    const handleValChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    }

    const handleIconClick = () => {
        fileInputRef.current.click();
    }

    return (
        <div>
            <Navbar />
            {/* <div className="titleContaineruser-Edit">
            </div> */}
            <div className='profileContainer'>
                <Grid container className='updateUserProfile' justifyContent="space-between" flexDirection="row" gap={1}>
                    <div className="title-text-editUser">Edit Your Profile</div>
                    <Grid item xs={12} sm={2} md={2} lg={4} className='editProfileImgInputContainer common-div'>
                        <input type="file" onChange={handleFileChange} ref={fileInputRef} hidden />
                        <div className="editProfile-img-container">
                            <img src={userFromAuth?.img ? userFromAuth.img : 'https://res.cloudinary.com/drq6qjbpg/image/upload/v1705511744/ReservationApp/Users/user_placeholder.webp'} className="editProfile-img" alt="No Image Uploaded" />
                            <Tooltip title="Update Image">
                                <EditIcon className="editProfile-edit-icon" onClick={handleIconClick} id="upload-button" />
                            </Tooltip>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={10} md={10} lg={7} className='editProfileForm common-div'>
                        <Grid container gap={1} alignItems="center">
                            <Grid item xs={12} sm={2} md={2} lg={3}>
                                <InputLabel htmlFor="username"><b>Username: </b></InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={8}>
                                <TextField
                                    type='text'
                                    name="username"
                                    id="username"
                                    value={formData.username !== undefined && formData.username !== null ? formData.username : userFromAuth?.username}
                                    onChange={(e) => { handleValChange("username", e.target.value) }}
                                    fullWidth
                                />
                            </Grid>

                        </Grid>
                        <Grid container gap={1} alignItems="center">
                            <Grid item xs={12} sm={2} md={2} lg={3}>
                                <InputLabel htmlFor="email"><b>E-Mail: </b></InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={8}>
                                <TextField
                                    type='email'
                                    name="email"
                                    id="email"
                                    value={formData.email !== undefined && formData.email !== null ? formData.email : userFromAuth?.email}
                                    onChange={(e) => { handleValChange("email", e.target.value) }}
                                    fullWidth
                                />
                            </Grid>

                        </Grid>


                        {/* <Grid container gap={1} alignItems="center">
                            <Grid item xs={12} sm={2} md={2} lg={3}>
                                <InputLabel htmlFor="password"><b>password: </b></InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={8}>
                                <TextField
                                    type='password'
                                    name="password"
                                    id="password"
                                    value={formData.password !== undefined && formData.password !== null ? formData.password : userFromAuth?.password}
                                    onChange={(e) => { handleValChange("password", e.target.value) }}
                                    fullWidth
                                />
                            </Grid>

                        </Grid> */}


                        <Grid container gap={1} alignItems="center">
                            <Grid item xs={12} sm={2} md={2} lg={3}>
                                <InputLabel htmlFor="city"><b>City: </b></InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={8}>
                                <TextField
                                    type='text'
                                    name="city"
                                    id="city"
                                    value={formData.city !== undefined && formData.city !== null ? formData.city : userFromAuth?.city}
                                    onChange={(e) => { handleValChange("city", e.target.value) }}
                                    fullWidth
                                />
                            </Grid>

                        </Grid>

                        <Grid container gap={1} alignItems="center">
                            <Grid item xs={12} sm={2} md={2} lg={3}>
                                <InputLabel htmlFor="phone"><b>Phone: </b></InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={8}>
                                <TextField
                                    type='tel'
                                    name="phone"
                                    id="phone"
                                    value={formData.phone !== undefined && formData.phone !== null ? formData.phone : userFromAuth?.phone}
                                    onChange={(e) => { handleValChange("phone", e.target.value) }}
                                    fullWidth
                                />
                            </Grid>

                        </Grid>


                        <Grid container gap={1} alignItems="center">
                            <Grid item xs={12} sm={2} md={2} lg={3}>
                                <InputLabel htmlFor="country"><b>Country: </b></InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={8}>
                                <TextField
                                    type='text'
                                    name="country"
                                    id="country"
                                    value={formData.country !== undefined && formData.country !== null ? formData.country : userFromAuth?.country}
                                    onChange={(e) => { handleValChange("country", e.target.value) }}
                                    fullWidth
                                />
                            </Grid>

                        </Grid>

                        <Button variant="contained" onClick={handleSubmit} className='submitBtn-edit-user'>Update Changes</Button>

                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default UpdateUserProfile;