import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainNavigator from './main/MainNavigator';
//import LoginScreen from './auth/LoginScreen';

import SigninScreen from './auth/SigninScreen';
import SignupScreen from './auth/SignupScreen';
import ResolveAuthScreen from './auth/ResolveAuthScreen';

const routeConfig = { 
    //Login: LoginScreen, 
    ResolveAuth: ResolveAuthScreen,
    loginFlow: createStackNavigator({
        Signup: SignupScreen,
        Signin: SigninScreen
    }),
    Main: MainNavigator 
};
const navigatorConfig = { initialRouteName: 'ResolveAuth' };

export default AppNavigator = createSwitchNavigator(routeConfig, navigatorConfig);

