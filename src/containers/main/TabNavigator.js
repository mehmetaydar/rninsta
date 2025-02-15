import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import images from 'res/images';
import colors from 'res/colors';
import palette from 'res/palette';
import MainScreen from './MainScreen';
import OtherScreen from './OtherScreen';
import HomeNavigator from './home/HomeNavigator';
import SearchNavigator from './search/SearchNavigator';
import AddPostNavigator from './addPost/AddPostNavigator';
import ActivityNavigator from './activity/ActivityNavigator';
import ProfileNavigator from './profile/ProfileNavigator';

const routeConfig = {
  Home: HomeNavigator,
  Search: SearchNavigator,
  AddPost: AddPostNavigator,
  Activity: ActivityNavigator,
  Profile: ProfileNavigator,
};

const navigatorConfig = {
  initialRouteName: 'Home',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      style: { backgroundColor: colors.tabBackground },
    },
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      let icon;
      switch (routeName) {
        case 'Home': icon = focused ? images.home_selected : images.home; break;
        case 'Search': icon = focused ? images.search_selected : images.search; break;
        case 'AddPost': icon = focused ? images.add_selected : images.add; break;
        case 'Activity': icon = focused ? images.activity_selected : images.activity; break;
        case 'Profile': icon = focused ? images.profile_selected : images.profile; break;
        default: icon = focused ? images.home_selected : images.home; break;
      }
      return <Image style={{ ...palette.header.image }} source={icon} />
    }
  })
}

export default TabNavigator = createBottomTabNavigator(routeConfig, navigatorConfig);