import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import Spacer from './Spacer';

const AuthForm = ({headerText, errorMessage, onSubmit, submitButtonText}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
    <>
        <Spacer>
            <Text h3>{headerText}</Text>
        </Spacer>
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
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        <Spacer>
            <Button title={submitButtonText} onPress={()=>{
                console.log("clicked authForm submit");
                onSubmit({email, password});
            }}/>
        </Spacer>
    </>
    );
};

AuthForm.navigationOptions = () =>{
    return {
        header: null
    };
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        marginBottom: 250
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15,
        marginTop: 15
    },
    link:{
        color: 'blue'
    }
});

export default AuthForm;