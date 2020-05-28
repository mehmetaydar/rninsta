import {types} from '../actions/actionProfile';    

initialState = { 
    data: {
        full_name:null, url:null, bio:null, profile_picture:null,             
        nbposts:null, nbfollowers:null, nbfollowing:null        
    },
    posts: {
        entries: [],
        nextPage: null
    },
    error: null    
};

export const profileReducer = (state = initialState, action) =>{
    switch(action.type){
        case types.r_error: 
            console.log(`Reducer type r_error - error: ${action.payload.error}`);
            return {...state, error: action.payload.error}
        case types.r_profileinfo:
            console.log(`Reducer type r_profileinfo - full_name: ${action.payload.full_name}`);
            return {...state, data: {...state.data, full_name:action.payload.full_name, url:action.payload.url, 
                bio:action.payload.bio, profile_picture:action.payload.profile_picture} };
        case types.r_profile_nb:
            console.log(`Reducer type r_profile_nb: ${action.payload.nbtype}: ${action.payload.nb}`);
            return {...state, data: {...state.data, [action.payload.nbtype]: action.payload.nb} };                     
        case types.r_profile_posts:
            console.log(`Reducer type r_profile_posts: ${action.payload.entries}: ${action.payload.nextPage}`);
            return {...state, posts: {...state.posts, entries: action.payload.entries}, nextPage: action.payload.nextPage };                     
        default:
            return state;
    }
};