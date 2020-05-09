import { LOCAL_SIGNIN, CLEAR_ERROR_MESSAGE, 
    SIGNED_UP, SIGNED_IN, SIGNED_OUT, ADD_ERROR } from '../actions';

initialState = {token: null, errorMessage: ''};
export const authReducer = (state = initialState, action) =>{
    switch(action.type){
        case ADD_ERROR:
            //console.log(`Reducer type ADD_ERROR: ${action.payload}`);
            return {...state, errorMessage: action.payload}
        case SIGNED_IN:
            //console.log("Reducer type SIGNED_IN");
            return {...state, errorMessage: ''}
        case SIGNED_OUT:
                //console.log("Reducer type SIGNED_OUT");
            return {...state, errorMessage: ''}    
        default:
            return state;
    }
};
