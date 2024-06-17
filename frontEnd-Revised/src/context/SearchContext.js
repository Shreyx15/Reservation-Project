const { createContext, useReducer } = require("react");

const INITIAL_STATE = {
    query: undefined,
    dates: [{
        startDate: new Date(),
        endDate: new Date()
    }],
    options: {
        adults: 0,
        children: 0,
        rooms: 0
    },
};


const SearchReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE":
            return action.payload
        case "SEARCH_QUERY":
            return {
                ...state,
                query: action.query
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
            query: state.query,
            dates: state.dates,
            options: state.options,
            dispatch
        }}>
            {children}
        </searchContext.Provider>
    );
}