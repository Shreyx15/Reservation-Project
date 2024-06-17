import { createContext, useEffect, useReducer } from 'react';

const INITIAL_STATE = {
    user: localStorage.getItem("user") || undefined,
    token: localStorage.getItem("token") || undefined,
    loading: undefined,
    error: undefined,
    isGoogleLogin: undefined
} 

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                token: null,
                loading: true,
                error: null,
                isGoogleLogin: null,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
                isGoogleLogin: action.payload.isGoogleLogin || false
            };
        case "LOGIN_FAILURE":
            return {
                user: null, 
                token: null,
                loading: false,
                error: action.payload,
                isGoogleLogin: false
            };
        case "LOGOUT":
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("isGoogleLogin");
            return INITIAL_STATE;
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("user", state.user);
        localStorage.setItem("token", state.token);
        localStorage.setItem("isGoogleLogin", state.isGoogleLogin);
    }, [state.user, state.token, state.isGoogleLogin]);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            loading: state.loading,
            error: state.error,
            isGoogleLogin: state.isGoogleLogin,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    );
}