import React from 'react';
import {View, StyleSheet} from 'react-native';
import AuthForm from '../../components/authForm';
import NavLink from '../../components/NavLink';
import {NavigationEvents} from 'react-navigation';
import { connect } from 'react-redux';
import { signin, clearErrorMessage } from 'actions';

const SigninScreen = (props) => {
    //onWillBlur does not work on sign in
    return (
    <View style={styles.container}>        
        <NavigationEvents onWillBlur={clearErrorMessage} />
        <AuthForm  
            headerText="Sign in to your Account"
            errorMessage={props.errorMessage}
            submitButtonText="Sign in"
            onSubmit={props.signin}
        />
        <NavLink 
            routeName="Signup" 
            text="Don't have an an account? Sign up instead"/>
    </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        marginBottom: 250
    },
    link:{
        color: 'blue'
    }
});

const mapStateToProps = (state) => {
    const {token, errorMessage} = state;
    return {
      token, errorMessage
    };
  }
  
const mapDispatchToProps = {
    signin,
    clearErrorMessage     
};

export default connect(mapStateToProps, mapDispatchToProps)(SigninScreen);
//export default SigninScreen;