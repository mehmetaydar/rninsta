import {useEffect} from 'react';
import { connect } from 'react-redux';
import { tryLocalSignin } from 'actions';
import {navigate} from '../../navigationRef';

const ResolveAuthScreen = (props) => {    
    //try to sign in if there is already a token in the async storage
    useEffect(()=>{
        console.log('ResolveAuth->useEffect');
        props.tryLocalSignin();        
        //navigate('Login');
        //props.test();
    }, []);

    return null;
};

const mapStateToProps = (state) => {
    const {token, errorMessage} = state;
    return {
      token, errorMessage
    };
  }
  
  const mapDispatchToProps = {
    tryLocalSignin     
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(ResolveAuthScreen);