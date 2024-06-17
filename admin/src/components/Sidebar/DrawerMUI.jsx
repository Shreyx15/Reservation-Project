import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useContext, useState } from 'react';
import { themeContext } from '../../context/themeContext';
import { IconButton, } from '@mui/material';
import Grid from '@mui/material/Grid';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import "./Drawer.scss";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import BedIcon from '@mui/icons-material/Bed';
import AirlineSeatIndividualSuiteIcon from '@mui/icons-material/AirlineSeatIndividualSuite';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;


const DrawerMUI = () => {
    const { state, dispatch } = useContext(themeContext);
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

    const navigate = useNavigate();
    const options = ['Dashboard', 'Users', 'Add New User', 'Hotels', 'Add New Hotel', 'Rooms', 'Add New Room', 'Logout'];
    const icons = [<DashboardIcon />, <GroupIcon />, <PersonAddIcon />, <HotelIcon />, <AddIcon />, <BedIcon />, <AirlineSeatIndividualSuiteIcon />, <LogoutIcon />];

    const handleClick = (index) => {

        const handleLogOut = async () => {
            const response = await Swal.fire({
                title: 'Logout',
                text: 'Are you sure you want to logout?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout'
            });

            if (response.isConfirmed) {
                const body = {
                    token: authState.token
                };
                const res = await axios.post('/auth/logout', body, { withCredentials: true });

                if (res.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'User Logged Out Successfully!',
                        confirmButtonText: 'Ok'
                    })
                        .then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = 'http://localhost:3000/login';
                                const action = {
                                    type: 'LOGOUT'
                                };

                                authDispatch(action);
                            }
                        });
                }
            }
        }

        switch (index) {
            case 0:
                navigate('/');
                break;
            case 1:
                navigate('/users');
                break;
            case 2:
                navigate('/users/newUser');
                break;
            case 3:
                navigate('/hotels');
                break;
            case 4:
                navigate('/hotels/newHotel');
                break;
            case 5:
                navigate('/rooms');
                break;
            case 6:
                navigate('/rooms/newRoom');
                break;
            case 7:
                handleLogOut();
                break;
            default:
                break;
        }
    }

    return (
        <Drawer
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    position: "static",
                    paddingTop: "65px"
                },
            }}
            variant="persistent"
            anchor="left"
            className='drawer'
            open={state.drawerOpen}
        >
            {/* <ArrowBackIosIcon style={{ fontSize: '18px' }} id="arrowIcon" onClick={() => { dispatch({ type: "drawerClose" }) }} /> */}
            <List>
                {options.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton className={`listItemBtn ${state.mode}`} onClick={() => { handleClick(index) }}>
                            <ListItemIcon style={{ color: `${state.mode === 'light' ? 'black' : 'white'}` }}>
                                {icons[index]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default DrawerMUI;

