initialState = {token: null, errorMessage: ''};
export const authReducer = (state = initialState, action) =>{
    switch(action.type){
        case 'add_error':
            return {...state, errorMessage: action.payload}
        case 'signin':
            return {...state, token: action.payload, errorMessage: ''}
        case 'signout':
                return {...state, token: null, errorMessage: ''}    
        case 'clear_error_message':
            return {...state, errorMessage: ''}
        default:
            return state;
    }
};
