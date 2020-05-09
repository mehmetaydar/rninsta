import {useEffect} from 'react';
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { tryLocalSignin } from 'actions';
//import {navigate} from '../../navigationRef';

const ResolveAuthScreen = (props) => {    
    //try to sign in if there is already a token in the async storage
    useEffect(()=>{
        //console.log('ResolveAuth->useEffect');
        props.tryLocalSignin();        
        //navigate('Login');
        //props.test();
    }, []);

    return (<View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />   
           </View>);           
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  })
  
export default connect(mapStateToProps, mapDispatchToProps)(ResolveAuthScreen);