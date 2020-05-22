import {R_READREF, R_SYNCREF} from '../actions/actionFire';    

initialState = {profile: 
    {full_name:null, url:null, bio:null, profile_picture:null, 
        nbposts:null, npfollowers:null, nbfollowing:null}
  };

export const fireReducer = (state = initialState, action) =>{
    switch(action.type){
        case R_READREF:
            console.log(`Reducer type R_READREF: ${action.payload.key2}: ${action.payload.value}`);
            return {...state, profile: {...[action.payload.key1], [action.payload.key2]: action.payload.value} };
        case R_SYNCREF:
            console.log(`Reducer type R_SYNCREF: ${action.payload.key2}: ${action.payload.value}`);
            return {...state, profile: {...[action.payload.key1], [action.payload.key2]: action.payload.value} };
        default:
            return state;
    }
};
