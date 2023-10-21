const { createContext, useReducer } = require("react");

const INITIAL_STATE = {
    city: undefined,
    dates: [{
        startDate: new Date(),
        endDate: new Date()
    }],
    options: {
        adults: 0,
        children: 0,
        rooms: 0
    }
};


const SearchReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE":
            return action.payload
        case "CITY":
            return {
                ...state,
                city: action.city
            }
        default:
            return state;
    }
}

export const searchContext = createContext(INITIAL_STATE);

export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

    return (
        <searchContext.Provider value={{
            city: state.city,
            dates: state.dates,
            options: state.options,
            dispatch
        }}>
            {children}
        </searchContext.Provider>
    );
}