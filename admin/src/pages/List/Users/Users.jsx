import { React, useContext, useState, useEffect } from 'react';
import Navbar from "../../../components/Navbar/Navbar";
import DrawerMUI from "../../../components/Sidebar/DrawerMUI";
import { Button, Container } from "@mui/material";
import { themeContext } from '../../../context/themeContext';
import "./users.scss";
import useFetch from '../../../hooks/useFetch';
import UsersTable from '../../../components/Table/Users/UsersTable';
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';

const Users = () => {
    const { state } = useContext(themeContext);
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);

    return (
        <>

            {isLoggedIn ? (<CommonLayout>
                <UsersTable />
            </CommonLayout>) : (<div>User not Logged In!</div>)
            }
        </>
    );
}

export default Users;
