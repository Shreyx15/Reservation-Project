import Navbar from "../../components/Navbar/Navbar";
import DrawerMUI from "../../components/Sidebar/DrawerMUI";
import Card from "../../components/Card/Card";
import BarChartForVisits from "../../components/BarChartForVisits/BarChartForVisits";
import PieChartForVisits from "../../components/PieChartForVisits/PieChartForVisits";
import { themeContext } from "../../context/themeContext";
import { useContext, useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import "./dashboard.scss";
import CommonLayout from "../../components/CommonLayout/CommonLayout";
import { AuthContext } from "../../context/AuthContext";
import Snackbar from '@mui/material/Snackbar';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import useAuthCheck from "../../hooks/useAuthCheck";

const Dashboard = () => {
    const { state } = useContext(themeContext);
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthCheck(authDispatch);


    return (
        <>
            {isLoggedIn ? (<CommonLayout>
                <Grid container spacing={3} className="cardsContainer" alignItems="center" justifyContent="center">
                    <Grid item xs={10} sm={6} md={3} >
                        <Card />
                    </Grid>
                    <Grid item xs={10} sm={6} md={3} >
                        <Card />
                    </Grid>
                    <Grid item xs={10} sm={6} md={3} >
                        <Card />
                    </Grid>
                    <Grid item xs={10} sm={6} md={3} >
                        <Card />
                    </Grid>
                </Grid>
                <Grid container spacing={4} justifyContent="space-around" className="chartsContainer">
                    <Grid item xs={12} sm={8} md={8} lg={8} className="barChartContainer">
                        <BarChartForVisits />
                    </Grid>
                    <Grid item xs={10} sm={4} md={4} lg={4} className="pieChartContainer">
                        <PieChartForVisits />
                    </Grid>
                </Grid>
            </CommonLayout>) : <span>User Not Logged in!</span>
            }
        </>
    );
};

export default Dashboard;   