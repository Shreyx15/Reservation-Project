import React, { useEffect, useRef, useState } from 'react';
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import Grid from "@mui/material/Grid";
import useFetch from '../../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { Button, TextField, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import "./singleRoom.scss";
import Swal from 'sweetalert2';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';


const SingleRoom = () => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);
    const { roomId } = useParams();
    const { data, error, loading } = useFetch(`/rooms/${roomId}`);
    const [img, setImg] = useState('');
    const [formData, setFormData] = useState({});
    const [rn, setRn] = useState(undefined);
    const fileInputRef = useRef(null);
    console.log(data);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        const fr = new FileReader();

        fr.readAsDataURL(file);

        fr.onload = () => {
            setImg(fr.result);
        }
    }

    const handleClick = () => {
        fileInputRef.current.click();
    }

    const handleRoomNumbers = (operation, num = -1) => {
        if (!formData || (!formData.roomNumbers)) {
            formData.roomNumbers = data?.roomNumbers;
        }

        let roomNumbers = formData?.roomNumbers;

        // console.log(room);
        if (operation === 'add' && rn) {
            roomNumbers.push({ number: rn });
            setRn(undefined);

        } else if (operation === 'delete') {
            roomNumbers = roomNumbers.filter((roomNum) => {
                return roomNum.number !== num;
            });
        }
        setFormData({ ...formData, roomNumbers });
    }

    const handleSubmit = async () => {
        const response = await Swal.fire({
            icon: 'warning',
            title: 'Confirm Submit?',
            titleText: 'Do you want to update this Room\'s information?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Submit',
            cancelButtonText: 'Cancel'

        });


        if (response.isConfirmed) {
            const dataToBeSubmitted = new FormData();
            const file = fileInputRef.current.files[0];

            for (const pair of Object.entries(formData)) {
                if (pair[0] !== 'roomNumbers') {
                    dataToBeSubmitted.append(pair[0], pair[1]);
                }
            }
            if (formData.roomNumbers) {
                dataToBeSubmitted.append('roomNumbers', JSON.stringify(formData.roomNumbers));
            }
            dataToBeSubmitted.append('image', file);
            // https://res.cloudinary.com/drq6qjbpg/image/upload/v1706287559/ReservationApp/Rooms/Ahmedabad_Hotel_Room.jpg

            const arr = data?.img.split('/');
            const index = arr.indexOf('ReservationApp');
            const public_id_arr = arr.slice(index);
            const name = public_id_arr[2].split('.')[0];
            const public_id = public_id_arr[0] + '/' + public_id_arr[1] + '/' + name;

            const res = await axios.put(`${process.env.BACKEND_HOSTED_URL}/rooms/${roomId}?public_id=${public_id}`, dataToBeSubmitted);

            if (res.status === 200 || Math.floor(res.status / 100) === 2) {
                Swal.fire({
                    icon: 'success',
                    title: 'Room Updated Successfully!',
                    showConfirmButton: true,
                    confirmButtonText: 'Okay'
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.location.reload();
                    }
                });
            }

        }
    }

    return (
        <>
            {
                isLoggedIn ? (

                    <CommonLayout>
                        <Grid container className="ru_grid_container" justifyContent="center" alignItems='center'>
                            <Grid item xs={12} sm={10} md={8} lg={8} className='ru_container'>
                                <div className="ru_title">
                                    Room Update
                                </div>
                                <Grid container className='ru_form_container' gap={8}>
                                    <Grid item xs={12} sm={12} md={3} lg={4} className='ru_imgAndInput'>
                                        <div className="ru_imgAndIconContainer">
                                            <img src={img ? img : data?.img} alt="No Image Found" className="ru_img" />

                                            <Tooltip title='Update Image'>
                                                <EditIcon className='ru_editIcon' onClick={handleClick} />
                                            </Tooltip>
                                        </div>
                                        <input
                                            type='file'
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} className='ru_infoContainer'>
                                        <TextField
                                            type="text"
                                            name="title"
                                            label='Room Title'
                                            onChange={(e) => { setFormData({ ...formData, title: e.target.value }) }}
                                            value={formData.title !== undefined ? formData.title : data?.title}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField
                                            type="number"
                                            name="price"
                                            label='Price'
                                            onChange={(e) => { setFormData({ ...formData, price: e.target.value }) }}
                                            value={formData.price !== undefined ? formData.price : data?.price}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField

                                            type="number"
                                            name="maxPeople"
                                            onChange={(e) => { setFormData({ ...formData, maxPeople: e.target.value }) }}
                                            label='Maximum People'
                                            value={formData.maxPeople !== undefined ? formData.maxPeople : data?.maxPeople}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField
                                            type="text"
                                            name="desc"
                                            onChange={(e) => { setFormData({ ...formData, desc: e.target.value }) }}
                                            label='Description'
                                            value={formData.desc !== undefined ? formData.desc : data?.desc}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            multiline
                                        />

                                        <div className="roomNumbers_container">
                                            <div className="roomNumberInput">
                                                <TextField
                                                    type="number"
                                                    name="roomNumbers"
                                                    id='roomNumberInputField'
                                                    label="Add Room Number"
                                                    sx={{ width: '100%' }}
                                                    value={rn === undefined ? undefined : rn}
                                                    onChange={(e) => { setRn(e.target.value) }}
                                                />
                                                <AddIcon className='ru_addIcon' onClick={() => { handleRoomNumbers('add') }} />
                                            </div>
                                            <Grid container gap={2} className="roomNumbers">
                                                {formData?.roomNumbers ? formData.roomNumbers.map((rn, i) => {
                                                    return (
                                                        <Grid item xs={2} sm={2} md={2} lg={2} className="rn">
                                                            <span>{rn.number}</span>
                                                            <CloseIcon className='ru_closeIcon' onClick={() => { handleRoomNumbers('delete', rn.number) }} />
                                                        </Grid>
                                                    );
                                                }) : data !== undefined && data.roomNumbers !== undefined && (data.roomNumbers.map((rn, i) => {
                                                    return (
                                                        <Grid item xs={3} sm={2} md={3} lg={2} className="rn">
                                                            <div>{rn.number}</div>
                                                            <CloseIcon className='ru_closeIcon' onClick={() => { handleRoomNumbers('delete', rn.number) }} />
                                                        </Grid>
                                                    );
                                                }))
                                                }
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>
                                <div className="ru_btnContainer">
                                    <Button type='button' className='btn' variant='contained' color='primary' onClick={handleSubmit}>Update</Button>
                                    <Button type='button' className='btn' variant='contained' color='primary' onClick={() => { window.location.reload() }}>Reset</Button>
                                </div>
                            </Grid>
                        </Grid>
                    </CommonLayout>
                ) : <div>User Not Logged In!</div>
            }
        </>
    );
};

export default SingleRoom;