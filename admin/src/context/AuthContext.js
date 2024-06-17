import { createContext, useEffect, useReducer, useState } from 'react';

const INITIAL_STATE = {
    user: undefined,
    token: undefined,
    loading: undefined,
    error: undefined
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                token: null,
                loading: true,
                error: null
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                token: null,
                loading: false,
                error: action.payload
            };
        case "LOGOUT":
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return INITIAL_STATE;
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem('user', state.user);
        localStorage.setItem('token', state.token);
    }, [state.user, state.token]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}