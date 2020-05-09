import React, { createContext, useReducer } from 'react';

const initialState = {
  time: 0,
};

const TimeContext = createContext(initialState);

const TimeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'updateTime':
        return {
          ...state,
          time: state.time + 10,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <TimeContext.Provider value={{ state, dispatch }}>
      {children}
    </TimeContext.Provider>
  );
};

export { TimeContext, TimeContextProvider };
