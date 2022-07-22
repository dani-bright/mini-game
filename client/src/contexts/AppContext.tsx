import React, { createContext, useContext, useReducer } from 'react';
import { ActionTypes } from './actions';
import {IScore} from '../interfaces/IScore';
import { IUser } from '../interfaces/IUser';

type Actions<T> = {
  type: T;
  payload?: any;
  meta?: any;
};

interface IAppState {
  token: string | null;
  scores: IScore[];
  users:IUser[]
}

interface IAppContext {
  setToken: (token : string) => void;
  setScores: (scores: IScore[]) => void;
  setUsers: (scores: IUser[]) => void;
}

const initialState: IAppState = {
  token: null,
  scores: [],
  users :[],
};

const AppContext = createContext<IAppState & IAppContext>({
  ...initialState,
  setToken: () => {},
  setScores: () => {},
  setUsers: () => {},
});

export const AppReducer = (state: IAppState, action: Actions<ActionTypes>) => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      return { ...state, token: action?.payload };
    case ActionTypes.SET_SCORES:
      return { ...state, scores: action?.payload };
    case ActionTypes.SET_USERS:
      return { ...state, users: action?.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setToken: (token) =>
          setImmediate(() =>
            dispatch({ type: ActionTypes.SET_TOKEN, payload: token })
          ),
        setScores: (scores) =>
          setImmediate(() =>
            dispatch({ type: ActionTypes.SET_SCORES, payload: scores })
          ),
        setUsers: (users) =>
          setImmediate(() =>
            dispatch({ type: ActionTypes.SET_USERS, payload: users })
          ),


      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
