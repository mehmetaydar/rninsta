/*
Anything that starts with S_ means it is an action that is suppose to hit SAGA
Anything that starts with R_ means it is an action that is suppose to hit REDUCER
*/
import {action} from './actionUtil';
export const S_READREF = "S_READREF";
export const R_READREF = "R_READREF";

export const S_SYNCREF = "S_SYNCREF";
export const R_SYNCREF = "R_SYNCREF";

export const readref = ({path, key1, key2}) => action(S_READREF, {path, key1, key2});
//path: /people/uid/full_name, key1: profile, key2: full_name
// path to be used in firebase. key1 and key2 to be used in reducer
//read: read firebase ref once

export const syncref = ({path, key1, key2}) => action(S_SYNCREF, {path, key1, key2});
//sync: read firebase ref once and continue as its value change, and reflect it to the store. kind of like a listener
