import {action} from './actionUtil';
export const LOCAL_SIGNIN = "LOCAL_SIGNIN";
export const CLEAR_ERROR_MESSAGE = "CLEAR_ERROR_MESSAGE";
export const SIGNUP = "SIGNUP";
export const SIGNIN = "SIGNIN";
export const SIGNOUT = "SIGNOUT";

export const SIGNED_UP = "SIGNED_UP";
export const SIGNED_IN = "SIGNED_IN";
export const SIGNED_OUT = "SIGNED_OUT";
export const ADD_ERROR = "ADD_ERROR";

export const tryLocalSignin = ()=> action(LOCAL_SIGNIN);
export const clearErrorMessage = ()=> action(CLEAR_ERROR_MESSAGE);
export const signup = ({email, password, fullname})=> action(SIGNUP, {email, password, fullname});
export const signin = ({email, password})=> action(SIGNIN, {email, password});
export const signout = ()=> action(SIGNOUT);