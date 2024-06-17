import { createContext, useReducer, useState } from 'react';

const INITIAL_STATE = {
    mode: "light",
    drawerOpen: window.innerWidth < 960 ? false : true
};

export const themeContext = createContext(INITIAL_STATE);


const themeReducer = (state, action) => {
    switch (action.type) {
        case "dark":
            return {
                ...state,
                mode: "dark"
            }
        case "light":
            return {
                ...state,
                mode: "light"
            }
        case "drawerOpen":
            return {
                ...state,
                drawerOpen: true
            }
        case "drawerClose":
            return {
                ...state,
                drawerOpen: false
            }
        default:
            return state;
    }
}

export const ThemeContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, INITIAL_STATE);

    return (
        <themeContext.Provider value={{
            state,
            dispatch
        }}>
            {children}
        </themeContext.Provider>
    );
}
