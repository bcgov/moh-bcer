import React, { useReducer, createContext, useEffect } from 'react';

export interface ToastContextState {
    isOpen?: boolean,
    type: 'success' | 'error' | 'warning',
    successMessages?: string[],
    errorMessages?: string[],
    warningMessages?: string[],
    title?: '',
}

interface ToastContextValues {
  handleOpen: (payload: ToastContextState) => void,
  handleClose: () => void,
  state: ToastContextState,
}

interface ToastContextAction {
    payload?: ToastContextState,
    type: 'OPEN' | 'CLOSE'
}

const initialState: ToastContextState = {
  isOpen: false,
  type: 'success',
};

const toastContextValues: ToastContextValues ={
  handleOpen: (payload: ToastContextState) => {},
  handleClose: () => {},
  state: initialState,
}

function reducer(state: ToastContextState, action: ToastContextAction) {
  switch (action.type) {
    case 'OPEN':
      return {
        isOpen: true,
        ...action.payload,
      };
    case 'CLOSE':
      return {
        ...state,
        isOpen: false,
      };
    default:
      return {
        ...state,
      };
  }
}

export const ToastContext = createContext(toastContextValues);

export const ToastProvider = ({ children }: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpen = (payload: ToastContextState) => dispatch({ type: 'OPEN', payload });
  const handleClose = () => dispatch({ type: 'CLOSE' });

  const contextValue = {
    handleOpen,
    handleClose,
    state,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};