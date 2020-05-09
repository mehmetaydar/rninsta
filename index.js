import React from 'react';
import { AppRegistry } from 'react-native';
import { StatusBar } from 'react-native';
import { name as appName } from './app.json';
import AppNavigator from 'containers/AppNavigator';
import { createAppContainer } from 'react-navigation';
import { store } from 'store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from 'store';
import {setNavigator} from './src/navigationRef';
//import Fire from './src/database/Fire';//need to import one time

StatusBar.setBarStyle('light-content', true);
StatusBar.backgroundColor = '#000';

const App = createAppContainer(AppNavigator);
const Root = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App ref ={(navigator) => {
            setNavigator(navigator);
      }}/>
    </PersistGate>
  </Provider>
);
AppRegistry.registerComponent(appName, () => Root);