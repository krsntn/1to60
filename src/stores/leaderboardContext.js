import React, { createContext, useReducer } from 'react';

const initialState = {
  data: 0,
};

const LeaderboardContext = createContext(initialState);

const LeaderboardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'setData':
        return {
          ...state,
          data: action.payload,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <LeaderboardContext.Provider value={{ state, dispatch }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export { LeaderboardContext, LeaderboardContextProvider };
