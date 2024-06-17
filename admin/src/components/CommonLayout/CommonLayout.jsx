import React from 'react';
import Navbar from '../Navbar/Navbar';
import DrawerMUI from '../Sidebar/DrawerMUI';
import Grid from "@mui/material/Grid";
import { themeContext } from "../../context/themeContext";
import { useContext } from 'react';
import "./commonLayout.scss";

const CommonLayout = ({ children }) => {
    const { state } = useContext(themeContext);

    return (
        <div className="customContainer">
            <Navbar style={{ zIndex: 1000 }} />
            <Grid container spacing={2} className="bodyContainer" justifyContent={state.drawerOpen ? '' : 'center'}>
                <Grid item md={2} style={{ display: state.drawerOpen ? 'block' : 'none' }}>
                    <DrawerMUI />
                </Grid>
                <Grid item md={10} className="right_side_grid">
                    <div className={`right-side ${state.mode} ${state.drawerOpen ? 'drawerOpen' : 'drawerClose'}`}>
                        {children}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default CommonLayout;