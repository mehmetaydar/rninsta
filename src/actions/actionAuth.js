import {action} from './actionUtil';
export const LOCAL_SIGNIN = "LOCAL_SIGNIN";
export const CLEAR_ERROR_MESSAGE = "CLEAR_ERROR_MESSAGE";
export const SIGNUP = "SIGNUP";
export const SIGNIN = "SIGNIN";
export const SIGNOUT = "SIGNOUT";

export const tryLocalSignin = ()=> action(LOCAL_SIGNIN);
export const clearErrorMessage = ()=> action(CLEAR_ERROR_MESSAGE);
export const signup = ({email, password})=> action(SIGNUP, {email, password});
export const signin = ({email, password})=> action(SIGNIN, {email, password});
export const signout = ()=> action(SIGNOUT);