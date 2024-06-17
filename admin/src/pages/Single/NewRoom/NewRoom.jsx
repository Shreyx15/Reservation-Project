import React, { useContext, useRef, useState } from 'react';
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import Grid from '@mui/material/Grid';
import "./NewRoom.scss";
import { BungalowOutlined } from '@mui/icons-material';
import { Button, TextField, Tooltip } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';

const NewRoom = () => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);
    const fileInputRef = useRef();
    const [formData, setformData] = useState(new FormData());

    const handleClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const files = e.target.files;

        for (const file of files) {
            formData.append('image', file);
        }
    }

    const handleDragEvents = (e, event) => {
        e.preventDefault();
        const dropZone = e.target;

        switch (event) {
            case "onDragEnter":
                setActive(dropZone, true);
                break;
            case "onDragOver":
                console.log("files are being dragged here!");
                break;
            case "onDragLeave":
                setActive(dropZone, false);
                break;
            case "onDrop":
                handleDroppedFiles(e);
                break;
            default:
                break;
        }

    }

    const handleDroppedFiles = (e) => {
        const { files } = e.dataTransfer;
        console.log(files);

        for (const file of files) {
            formData.append('image', file);
        }
    }

    const setActive = (dropZone, active) => {
        const hasActiveClass = dropZone.classList.contains('active');

        if (hasActiveClass && !active) {
            return dropZone.classList.remove('active');
        }

        if (!hasActiveClass && active) {
            return dropZone.classList.add('active');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to submit the room form?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        });

        if (response.isConfirmed) {
            const form = document.getElementById('room-form');

            const room_form_data = new FormData(form);

            for (const pair of formData.entries()) {
                room_form_data.append(pair[0], pair[1]);
            }


            const res = await axios.post('/rooms/createRoom', room_form_data);

            if (res.status === 200 || Math.floor(res.status / 100) === 2) {
                const resp = await Swal.fire({
                    icon: 'success',
                    title: 'Form Submitted Successfully!',
                    confirmButtonText: 'OK'
                });

                if (resp.isConfirmed) {
                    window.location.reload();
                }
            }
        }


    }

    return (
        <>
            {
                isLoggedIn ? (

                    <CommonLayout>
                        <Grid container className='class' justifyContent="center" alignItems='center'>
                            <Grid item xs={12} sm={6} md={8} lg={8} className='new_room_container'>
                                <div className="room-form-title">
                                    Add new Room
                                </div>
                                <form id="room-form" onSubmit={handleSubmit}>
                                    <Grid container className='room_form_container' gap={10}>
                                        <Grid item xs={12} sm={12} md={3} lg={4} className='room_img_input_container'>
                                            <div className="room_mini_img_input_container" onDrop={(e) => { handleDragEvents(e, 'onDrop') }} onDragEnter={(e) => { handleDragEvents(e, 'onDragEnter') }} onDragLeave={(e) => { handleDragEvents(e, 'onDragLeave') }} onDragOver={(e) => { handleDragEvents(e, 'onDragOver') }}>
                                                <Tooltip title="Add Room Images">
                                                    <Button type="button" variant='contained' color='primary' onClick={handleClick}><DriveFolderUploadIcon className='room_img_upload_icon' /></Button>
                                                </Tooltip>
                                                <div className="hint">Drag An Image Here</div>
                                            </div>
                                            <input
                                                type='file'
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={9} lg={6} className='room_form_content'>
                                            <TextField
                                                type='text'
                                                name="title"
                                                label="Room Title"
                                            />
                                            <TextField
                                                type='number'
                                                name="price"
                                                label="Room Price"
                                            />
                                            <TextField
                                                type='number'
                                                name="maxPeople"
                                                label="Maximum People"
                                            />
                                            <TextField
                                                type='text'
                                                name="desc"
                                                label="Room Description"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button type="submit" className='room_btn' variant='contained' color='primary'>Submit</Button>
                                </form>
                            </Grid>
                        </Grid>
                    </CommonLayout>
                ) : <div>User Not Logged In!</div>
            }
        </>
    );
};

export default NewRoom;