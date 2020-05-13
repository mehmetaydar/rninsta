import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import NavLink from '../../components/NavLink';
import {NavigationEvents} from 'react-navigation';
import { connect } from 'react-redux';
import { signup, clearErrorMessage } from 'actions';
import {Text, Input, Button} from 'react-native-elements';
import Spacer from '../../components/Spacer';

const SignupScreen = (props) => {
    //console.log("Signedup: json-state log: ");
    //console.log(JSON.stringify(props));

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
    <View style={styles.container}>
        <NavigationEvents onWillBlur={props.clearErrorMessage} />

        <Spacer>
            <Text h3>Sign up for Daddy</Text>
        </Spacer>
        <Spacer />

        <Input 
        label="Full Name" 
        value={fullname}
        onChangeText={setFullname}
        autoCapitalize="none"
        autoCorrect={false}
        />
        <Spacer />

        <Input 
        label="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        />
        <Spacer />

        <Input label="Password" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        />
        
        {props.errorMessage ? <Text style={styles.errorMessage}>{props.errorMessage}</Text> : null}
        
        <Spacer>
            <Button title="Sign Up" onPress={()=>{
                console.log("clicked Signup submit");
                props.signup({email, password, fullname});
            }}/>
        </Spacer>


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
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15,
        marginTop: 15
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
