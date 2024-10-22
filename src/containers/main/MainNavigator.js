import { Easing, Animated } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import DmScreen from './home/dm/DmScreen';
import StoryCameraScreen from './home/storyCamera/StoryCameraScreen';
import TabNavigator from './TabNavigator';


const routeConfig = {
  Main: {
    screen: TabNavigator,
    navigationOptions: () => ({
      header: null,
      headerTransparent: true,
    })
  },
  Dm: {
    screen: DmScreen,
  },
  StoryCamera: {
    screen: StoryCameraScreen
  }
};


const navigatorConfig = {
  initialRouteName: 'Main',
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene
      const params = route.params || {};
      const transition = params.transition || 'toRight';
      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [transition === 'toRight' ? width : -width, 0, 0],
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 1, index],
        outputRange: [0, 1, 1],
      });

      return { opacity, transform: [{ translateX: translateX }] };
    },
  })
}

const MainNavigator = createStackNavigator(routeConfig, navigatorConfig);
export default MainNavigator;