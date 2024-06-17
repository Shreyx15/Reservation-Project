import React, { useContext, useEffect, useRef } from 'react';
import "./NewHotel.scss";
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import { Grid, Tooltip, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Input, OutlinedInput, FilledInput, TextField } from '@mui/material';
import { useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';

const NewHotel = () => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);
    const [formData, setFormData] = useState(new FormData());
    const fileInputRef = useRef(null);

    useEffect(() => {
        window.addEventListener("dragover", function (e) {
            e.preventDefault();
        }, false);
        window.addEventListener("drop", function (e) {
            e.preventDefault();
        }, false);
    }, []);

    const handleClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const files = e.target.files;

        Array.from(files).forEach((file) => {
            formData.append("images", file);
        });
    }


    const handleDragEvents = (e, event) => {
        e.preventDefault();
        const dropZone = e.target;

        switch (event) {
            case "dragEnter":
                setActive(dropZone, true);
                break;
            case "dragOver":
                setActive(dropZone, true);
                break;
            case "dragLeave":
                setActive(dropZone, false);
                break;
            case "drop":
                appendFiles(e);
                break;
            default:
                alert("there might be some problem!");
        }
    }

    const appendFiles = (e) => {
        const files = e.dataTransfer.files;
        console.log(files);
        Array.from(files).forEach((file) => {
            formData.append("images", file);
        });
        console.log(files);
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
    }

    const setActive = (dropZone, active) => {
        const hasActiveClass = dropZone.classList.contains('active');

        if (!active && hasActiveClass) {
            dropZone.classList.remove('active');
        } else if (active && !hasActiveClass) {
            dropZone.classList.add('active');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otherFormEntries = new FormData(e.target);

        for (let pair of otherFormEntries.entries()) {
            formData.append(pair[0], pair[1]);
            console.log(pair);
        }
        console.log(formData);

        const res = await axios.post("/hotels", formData);

        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Hotel form submitted successfully!',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });


    }


    return (
        <>
            {
                isLoggedIn ? (

                    <CommonLayout>
                        <Grid container className="hotel-form-container" justifyContent="">
                            <Grid item xs={12} sm={12} md={10} lg={10} className='hotel-form'>
                                <div className="title">
                                    Hotel Registration
                                </div>
                                <Grid container className='hotel-form-container' justifyContent="center">
                                    <Grid item xs={12} sm={12} md={3} lg={3} className='imgAndInputContainer'>
                                        <div
                                            className="imgContainer"
                                            id="dropZone"
                                            onDragEnter={(e) => { handleDragEvents(e, "dragEnter") }}
                                            onDragLeave={(e) => { handleDragEvents(e, "dragLeave") }}
                                            onDragOver={(e) => { handleDragEvents(e, "dragOver") }}
                                            onDrop={(e) => { handleDragEvents(e, "drop") }}
                                        >
                                            <Button id="iconBtn" onClick={handleClick}>
                                                <Tooltip title="drag or select pictures to upload">
                                                    <FileUploadIcon id='uploadIcon' />
                                                </Tooltip>
                                            </Button>
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
                                        <form id='hotel-form' onSubmit={handleSubmit}>
                                            <Grid container className='hotel-form-container' justifyContent="space-between">
                                                <Grid item xs={12} sm={12} md={5} lg={5} className='form-sides-hotel'>
                                                    <Input
                                                        type='text'
                                                        name="name"
                                                        placeholder='Hotel Name'

                                                    />
                                                    <FormControl variant='standard' id="" >
                                                        <InputLabel htmlFor="hotel-type-select">Select Type</InputLabel>
                                                        <Select
                                                            id="hotel-type-select"
                                                            name="type"
                                                            label="Select Type"
                                                            sx={{ padding: 0, marginTop: 0 }}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select Type
                                                            </MenuItem>
                                                            <MenuItem value="Hotel">Hotel</MenuItem>
                                                            <MenuItem value="Resort">Resort</MenuItem>
                                                            <MenuItem value="Apartment">Apartment</MenuItem>
                                                            <MenuItem value="Villa">Villa</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <Input
                                                        type="text"
                                                        name="city"
                                                        label="City"
                                                        placeholder='City'

                                                    />
                                                    <Input
                                                        type="text"
                                                        name="address"
                                                        label="Address"
                                                        placeholder='Address'

                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={5} lg={5} className='form-sides'>

                                                    <Input
                                                        type='text'
                                                        name="distance"
                                                        label="Distance"
                                                        placeholder='Distance'

                                                    />
                                                    <TextField
                                                        type="text"
                                                        name="desc"
                                                        label="Description"
                                                        placeholder='Description'
                                                        multiline
                                                    />

                                                    <Input
                                                        type="number"
                                                        name="cheapestPrice"
                                                        label="Cheapest Price"
                                                        placeholder='Cheapest Price'
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                name="featured"
                                                            />
                                                        }
                                                        label="Featured"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                                        </form>
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

export default NewHotel;