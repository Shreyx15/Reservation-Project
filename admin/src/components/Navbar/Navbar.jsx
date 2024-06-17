import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import DarkModeSwitch from '../Switch/DarkModeSwitch';
import { themeContext } from '../../context/themeContext';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import "./navbar.scss";



function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const { state, dispatch } = React.useContext(themeContext);

    const handleDrawer = () => {
        const type = state.drawerOpen ? "drawerClose" : "drawerOpen";
        const action = {
            type: type
        }

        dispatch(action);
    }
    // console.log(state);
    return (
        <AppBar position="fixed" id='navbar' className={state.mode}>
            <div id="navContainer">
                <div className='iconContainer'>
                    <DensityMediumIcon onClick={handleDrawer} className='openIcon' />
                </div>
                <Toolbar disableGutters className='toolbar'>
                    <Box id="options">
                        {/* <DarkModeSwitch /> */}
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </div>

        </AppBar>
    );
}
export default Navbar;
