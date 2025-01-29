import React, { useContext, useEffect, useRef, useState } from 'react';
import DrawerMUI from '../../../components/Sidebar/DrawerMUI';
import Navbar from '../../../components/Navbar/Navbar';
import { Container, Drawer, Card, Input, Button } from '@mui/material';
import "./singleUser.scss";
import { themeContext } from '../../../context/themeContext';
import useFetch from '../../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Public } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';

const SingleUser = () => {
    const { state } = useContext(themeContext);
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);
    const { userId } = useParams();
    const { data, loading } = useFetch(`/users/${userId}`);
    const fileInputRef = useRef(null);

    const removePasswordField = (data) => {
        const { password, ...rest } = data;
        console.log({ rest });
        return { rest, file: null };
    }
    const [userInfo, setUserInfo] = useState(removePasswordField(data));

    const handleImgInputClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fr = new FileReader();
        fr.readAsDataURL(file);

        // setUserInfo({ ...userInfo, file });
        // console.log(userInfo);
        fr.onload = () => {
            // console.log(fr.result);
            setUserInfo({ ...userInfo, file: fr.result, filename: file.name });
        }
    }

    useEffect(() => {
        setUserInfo(data);
    }, [data]);
    // console.log(data);

    //deleted Options
    // const handleOptionClick = (e) => {
    //     const mode = e.currentTarget.getAttribute("data-mode");
    //     setActive(mode);
    // }

    const handleReset = () => {
        setUserInfo(data);
    }

    const handleSubmit = async () => {
        Swal.fire({
            title: 'Confirm Changes',
            text: 'Are you sure you want to update your data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((res) => {
            if (res.isConfirmed) {
                const updateData = async () => {
                    const arr = userInfo.img.split("/");
                    const str = arr.splice(arr.indexOf('ReservationApp')).join("/");
                    const dotIndex = str.indexOf('.');
                    const public_id = str.substring(0, dotIndex);

                    const res = await axios.put(`${process.env.BACKEND_HOSTED_URL}/users/updateUser?id=${userInfo._id}&public_id=${public_id}`, userInfo);
                    console.log(res.data);
                    return res;
                }

                updateData().then((res) => {
                    Swal.fire(
                        'Updated!',
                        'Your data has been updated successfully.',
                        'success'
                    );
                });

            }
        });
    }

    const grid_container_props = {
        xs: 12,
        sm: 12,
        md: 7,
        lg: 5
    };

    return (
        <>
            {isLoggedIn ? (
                <CommonLayout>
                    <Grid container justifyContent="flex-start" className=''>
                        <Grid item {...grid_container_props} className='grid_container'>
                            <div className="profileContainer">
                                <div className="titleText">
                                    User Profile
                                </div>
                                <Grid container className='profile_content' >
                                    <Grid item xs={12} sm={12} md={3} lg={5} className="imgContainer">
                                        <div className="imgEdit">
                                            <img src={data.img} alt="No user image found" className='userImage' />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                            <EditIcon className='editIcon iconForImg' onClick={handleImgInputClick} />

                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={9} lg={7} className="userInfo" >
                                        <div className="username info-text">
                                            <PersonIcon className='icons' />
                                            <Input type='text' value={userInfo.username} onChange={(e) => { setUserInfo({ ...userInfo, username: e.target.value }) }} />
                                            <Tooltip title="This is editable Input. You may update your data.">
                                                <IconButton>
                                                    <EditIcon className='editIcon' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <div className="email info-text">
                                            <AlternateEmailIcon className='icons' />
                                            <Input type="email" value={userInfo.email} onChange={(e) => { setUserInfo({ ...userInfo, email: e.target.value }) }} />
                                            <Tooltip title="This is editable Input. You may update your data.">
                                                <IconButton>
                                                    <EditIcon className='editIcon' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <div className="phone info-text">
                                            <PhoneIcon className="icons" />
                                            <Input type='text' value={userInfo.phone} onChange={(e) => { setUserInfo({ ...userInfo, phone: e.target.value }) }} />
                                            <Tooltip title="This is editable Input. You may update your data.">
                                                <IconButton>
                                                    <EditIcon className='editIcon' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <div className="cityContainer info-text">
                                            <LocationCityIcon className='icons' />
                                            <Input type="text" value={userInfo.city} onChange={(e) => { setUserInfo({ ...userInfo, city: e.target.value }) }} />
                                            <Tooltip title="This is editable Input. You may update your data.">
                                                <IconButton>
                                                    <EditIcon className='editIcon' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <div className="countryContainer info-text">
                                            <Public className='icons' />
                                            <Input type="text" value={userInfo.country} onChange={(e) => { setUserInfo({ ...userInfo, country: e.target.value }) }} />
                                            <Tooltip title="This is editable Input. You may update your data.">
                                                <IconButton>
                                                    <EditIcon className='editIcon' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>

                                    </Grid>
                                </Grid>
                                <div className="buttonsContainer">
                                    <Button variant="contained" className="btn" color="primary" onClick={handleReset}>
                                        Reset
                                    </Button>
                                    <Button variant="contained" className="btn" color="primary" onClick={handleSubmit}>
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </CommonLayout>
            ) : <div>User not Logged In!</div>}
        </>

    );
};

export default SingleUser;