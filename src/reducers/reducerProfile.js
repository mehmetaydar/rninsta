import { ADD_ERROR } from '../actions';

initialState = {errorMessage: ''};
export const profileReducer = (state = initialState, action) =>{
    switch(action.type){
        case ADD_ERROR:
            //console.log(`Reducer type ADD_ERROR: ${action.payload}`);
            return {...state, errorMessage: action.payload}
    }
};
