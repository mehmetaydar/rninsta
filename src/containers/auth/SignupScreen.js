import React from 'react';
import {View, StyleSheet} from 'react-native';
import AuthForm from '../../components/authForm';
import NavLink from '../../components/NavLink';
import {NavigationEvents} from 'react-navigation';
import { connect } from 'react-redux';
import { signup, clearErrorMessage } from 'actions';

const SignupScreen = (props) => {
    console.log("Signedup: json-state log: ");
    console.log(JSON.stringify(props));
    return (
    <View style={styles.container}>
        <NavigationEvents onWillBlur={props.clearErrorMessage} />
        <AuthForm 
            headerText="Sign up for Daddy"
            errorMessage={props.errorMessage}
            submitButtonText="Sign Up"
            onSubmit={props.signup}
        />
        <NavLink 
            routeName="Signin" 
            text="Already have an account? Sign in instead"/>
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
    const {authReducer: 
        {token, errorMessage}
    } = state;
    return {
      token, errorMessage
    };
  }
  
const mapDispatchToProps = {
    signup,
    clearErrorMessage     
};
  
export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
