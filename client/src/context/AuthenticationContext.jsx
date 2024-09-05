import { createContext, useEffect } from 'react';
import { useReducer } from 'react';

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: false,
};

export const AuthenticationContext = createContext(INITIAL_STATE);

const AuthenticationReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const AuthenticationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthenticationReducer, INITIAL_STATE);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthenticationContext.Provider value={{ user: state.user, loading: state.loading, error: state.error, dispatch }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;


