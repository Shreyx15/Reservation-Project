import React, { useContext } from 'react';
import DrawerMUI from '../../../components/Sidebar/DrawerMUI';
import Navbar from '../../../components/Navbar/Navbar';
import HotelsTable from '../../../components/Table/Hotels/HotelsTable';
import { Container } from '@mui/material';
import { themeContext } from '../../../context/themeContext';
import commonLayout from "../../../components/CommonLayout/CommonLayout";
import CommonLayout from '../../../components/CommonLayout/CommonLayout';
import { AuthContext } from '../../../context/AuthContext';
import useAuthCheck from '../../../hooks/useAuthCheck';

const Hotels = () => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { isLoggedIn } = useAuthCheck(authDispatch);

    return (
        <>
            {
                isLoggedIn ? (
                    <CommonLayout>
                        <HotelsTable />
                    </CommonLayout>
                ) : <div>User Not Logged In!</div>
            }
        </>
    );
}

export default Hotels;
