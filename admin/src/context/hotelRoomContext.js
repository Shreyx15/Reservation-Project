import { createContext, useReducer, useState } from 'react';
import { ThemeContextProvider } from './themeContext';

const INITIAL_STATE = {
    miniTab: "",
    hotelId: null,
    selectedRooms: []
};

export const hotelRoomContext = createContext(INITIAL_STATE);

const hotelRoomReducer = (state, action) => {
    switch (action.type) {
        case "selectHotel":
            return {
                ...state,
                miniTab: "selectHotel"
            };
        case "closeTab":
            return {
                ...state,
                miniTab: ""
            };
        case "setHotelId":
            return {
                ...state,
                hotelId: action.hotelId,
                miniTab: action.miniTab
            };
        case "setSelectedRooms":
            return {
                ...state,
                selectedRooms: action.roomsToBeUpdated
            };
        case "updateData":
            return action.payload;
        case "roomUpdateFinished":
            return INITIAL_STATE;
        default:
            return state;
    }
};


export const HotelRoomContextProvider = ({ children }) => {
    const [dataState, dispatch] = useReducer(hotelRoomReducer, INITIAL_STATE);

    return (
        <hotelRoomContext.Provider value={{ dataState, dispatch }}>
            {children}
        </hotelRoomContext.Provider>
    );
}
