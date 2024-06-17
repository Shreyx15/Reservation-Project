import React, { useContext, useEffect, useRef, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { Grid, Tooltip, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Input, OutlinedInput, FilledInput, TextField } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import "./singleHotel.scss";
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';

const SingleHotel = () => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);
    const { hotelId } = useParams();
    const { data, loading } = useFetch(`/hotels/find/${hotelId}`);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState(new FormData());
    const [index, setIndex] = useState(0);
    const [length, setLength] = useState(0);
    const [sliderOpen, setSliderOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dataObj, setDataOj] = useState({});

    console.log(index, length);

    useEffect(() => {
        console.log(data['photos']);
        const len = data['photos']?.length;
        if (len) {
            setIndex(Math.floor(len / 2));
            setLength(len);
        }
    }, [data, data['photos']]);


    const handleClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
    }

    const handleImageMove = (dir) => {
        setIndex(dir === 'r' ? index + 1 : index - 1);
    }

    const handleOpen = () => {
        setSliderOpen(true);

        const target = document.getElementsByClassName('imgSliderContainer')[0];
        target.style.backgroundColor = "rgba(0, 0, 0, 0.62)";
    }

    const handleClose = () => {
        setSliderOpen(false);
    }

    const handleImageDelete = async () => {
        const response = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this image!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        })

        if (response.isConfirmed) {
            // const url = "https://res.cloudinary.com/drq6qjbpg/image/upload/v1708708132/ReservationApp/Hotels/Mumbai/Taj%20Mahal%20Palace/Hotel_photo5.jpg";
            const arr = data['photos'][index].split("/");
            const resIndex = arr.indexOf("ReservationApp");
            const public_id = arr.splice(resIndex).join('/').slice(0, -4);
            console.log(public_id + "\n");
            console.log(arr[6]);
            const res = await axios.delete(`/hotels/deleteImage?id=${data._id}&public_id=${public_id}&image_id=${arr[6]}`);

            if (res.status == 200 || res.status / 100 == 2) {
                Swal.fire(
                    'Deleted!',
                    'Your image has been deleted.',
                    'success'
                ).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        }
    }

    const handleReset = () => {
        window.location.reload();
    }
    const handleSubmit = (e) => {
        for (const key in dataObj) {
            formData.append(key, dataObj[key]);
        }

        const updateDetails = async () => {
            const response = await Swal.fire({
                title: 'Confirm changes?',
                text: 'You have unsaved changes. Do you want to save them?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Save Changes',
                cancelButtonText: 'Discard Changes',
            })

            if (response.isConfirmed) {
                const res = await axios.put(`/hotels/update/${data._id}?CITY=${data.city}&NAME=${data.name}`, formData);

                if (res.status === 200 || res.status / 100 === 2) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: 'Changes have been saved successfully.',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });

                }
            }
        }

        updateDetails();

    }

    const imgSliderIconProps = {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2
    };

    const imgSliderProps = {
        xs: 8,
        sm: 8,
        md: 8,
        lg: 8
    };
    return (
        <>
            {
                isLoggedIn ? (

                    <CommonLayout>
                        <Button className={`closeBtn ${!sliderOpen && 'sliderClose'}`}>
                            <CloseIcon onClick={handleClose} />
                        </Button>
                        <Button className={`delBtn ${!sliderOpen && 'sliderClose'}`}>
                            <DeleteIcon onClick={handleImageDelete} />
                        </Button>
                        <Grid container className={`imgSliderContainer ${!sliderOpen && 'sliderClose'}`}>
                            <Grid item {...imgSliderIconProps} className='leftIconContainer iconContainer'>
                                <Button disabled={index === 0} className='leftBtn'>
                                    <ChevronLeftIcon onClick={() => { handleImageMove('l') }} className='left-icon' />
                                </Button>
                            </Grid>
                            <Grid item {...imgSliderProps} className='middle-part'>
                                <Grid container justifyContent="center" alignItems="center">
                                    <Grid item xs={12} sm={12} md={8} lg={8} className='imagesContainer'>
                                        {index - 1 >= 0 && data && data['photos'] && <img src={data['photos'][index - 1]} alt="" className='hotelImg leftImg' />}
                                        {data && data['photos'] && <img src={data['photos'][index]} alt="" className='hotelImg centerImg' />}
                                        {index + 1 < length && data && data['photos'] && <img src={data["photos"][index + 1]} alt="" className='hotelImg rightImg' />}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item {...imgSliderIconProps} className='rightIconContainer iconContainer' >
                                <Button disabled={index === length - 1} className='rightBtn'>
                                    <ChevronRightIcon onClick={() => { handleImageMove('r') }} className='right-icon' />
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container className="hotel-form-container" justifyContent="">
                            <Grid item xs={12} sm={12} md={10} lg={10} className='hotel-form'>

                                <div className="title">
                                    {data?.name}
                                </div>
                                <Grid container className='form-container' justifyContent="center">
                                    <Grid item xs={12} sm={12} md={3} lg={3} className='imgAndInputContainer'>
                                        <div className="img-container">
                                            <img src={(data && data.photos && data.photos.length > 0) ? data.photos[0] : ""} className="image" alt='No image uploaded' />
                                            <div className={`moreImgIconContainer ${!menuOpen && 'menuClosed'}`}>
                                                <Tooltip title="More">
                                                    <MoreVertIcon className='moreImgIcon' onClick={() => { setMenuOpen(!menuOpen) }} />
                                                </Tooltip>
                                                <Tooltip title="View Images">
                                                    <CollectionsIcon className='moreImgIcon ' onClick={handleOpen} style={{ display: !menuOpen && 'none' }} />
                                                </Tooltip>
                                                <Tooltip title="add More Imagess">
                                                    <AddPhotoAlternateIcon className='moreImgIcon ' onClick={handleClick} style={{ display: !menuOpen && 'none' }} />
                                                </Tooltip>
                                            </div>

                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            accept="image/png, image/jpeg"
                                            multiple
                                        />

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={9} lg={9}>
                                        <div id='hotel-form'>
                                            <Grid container className='hotel-form-container' justifyContent="space-between">
                                                <Grid item xs={12} sm={12} md={5} lg={5} className='form-sides'>
                                                    <TextField
                                                        type='text'
                                                        name="name"
                                                        label="name"
                                                        placeholder='Hotel Name'
                                                        value={dataObj.name === undefined ? data?.name : dataObj.name}
                                                        onChange={(e) => { setDataOj({ ...dataObj, name: e.target.value }) }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    <FormControl variant='standard' id="" >
                                                        <InputLabel htmlFor="hotel-type-select">Select Type</InputLabel>
                                                        <Select
                                                            id="hotel-type-select"
                                                            name="type"
                                                            label="Select Type"
                                                            value={dataObj.type === undefined ? data?.type === undefined ? '' : data.type : dataObj.type}
                                                            sx={{ padding: 0, marginTop: 0 }}
                                                            onChange={(e) => { setDataOj({ ...dataObj, type: e.target.value }) }}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Type
                                                            </MenuItem>
                                                            <MenuItem value="Hotel" selected={(e) => e.target.value === data?.type ? true : false}>Hotel</MenuItem>
                                                            <MenuItem value="Resort" selected={(e) => e.target.value === data?.type ? true : false}>Resort</MenuItem>
                                                            <MenuItem value="Apartment" selected={(e) => e.target.value === data?.type ? true : false}>Apartment</MenuItem>
                                                            <MenuItem value="Villa" selected={(e) => e.target.value === data?.type ? true : false}>Villa</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <TextField
                                                        type="text"
                                                        name="city"
                                                        label="City"
                                                        placeholder='City'
                                                        value={dataObj.city === undefined ? data?.city : dataObj.city}
                                                        onChange={(e) => { setDataOj({ ...dataObj, city: e.target.value }) }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    <TextField
                                                        type="text"
                                                        name="address"
                                                        label="Address"
                                                        placeholder='Address'
                                                        value={dataObj.address === undefined ? data?.address : dataObj.address}
                                                        onChange={(e) => { setDataOj({ ...dataObj, address: e.target.value }) }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={5} lg={5} className='form-sides'>

                                                    <TextField
                                                        type='text'
                                                        name="distance"
                                                        label="Distance"
                                                        placeholder='Distance'
                                                        value={dataObj.distance === undefined ? data?.distance : dataObj.distance}
                                                        onChange={(e) => { setDataOj({ ...dataObj, distance: e.target.value }) }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    <TextField
                                                        type="text"
                                                        name="desc"
                                                        label="description"
                                                        placeholder="Description"
                                                        value={dataObj.desc === undefined ? data?.desc : dataObj.desc}
                                                        onChange={(e) => { setDataOj({ ...dataObj, desc: e.target.value }) }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        multiline
                                                    />

                                                    <TextField
                                                        type="number"
                                                        name="cheapestPrice"
                                                        label="Cheapest Price"
                                                        placeholder='Cheapest Price'
                                                        value={dataObj.cheapestPrice === undefined ? data?.cheapestPrice : dataObj.cheapestPrice}
                                                        onChange={(e) => { setDataOj({ ...dataObj, cheapestPrice: e.target.value }) }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />

                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                name="featured"
                                                                checked={dataObj.featured === undefined ? data?.featured : dataObj.featured}
                                                                onChange={(e) => { setDataOj({ ...dataObj, featured: e.target.checked }) }}
                                                            />
                                                        }
                                                        label="Featured"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <div className="btnContainer">
                                                <Button type="button" variant="contained" color="primary" onClick={handleReset}>Reset</Button>
                                                <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
                                            </div>

                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CommonLayout>
                ) : <div>User Not Logged In!</div>
            }
        </>
    );
};

export default SingleHotel;