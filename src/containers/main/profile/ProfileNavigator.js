import React from 'react';
import { View, Text, Platform, Image, TouchableOpacity, StyleSheet  } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator} from 'react-navigation-stack';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import OtherScreen from '../OtherScreen';
import ProfileDrawer from './ProfileDrawer';
import images from 'res/images';
import palette from 'res/palette';
import colors from 'res/colors';
//import { FontAwesome } from '@expo/vector-icons';
//import {FontAwesome} from 'react-native-vector-icons';
//import Icon from 'react-native-vector-icons/FontAwesome';
//import { Icon } from 'react-native-elements'

const routeConfig = {
    ProfileStackNavigator: {
      screen: createStackNavigator({
        Profile: {
            screen: ProfileScreen,
            navigationOptions: ({ navigation }) => ({
              headerStyle: {
                backgroundColor: '#222',
              },
              headerTintColor: '#FFF',
              headerTitleStyle: {
                fontFamily: Platform.OS === 'ios' ? 'Futura' : 'Roboto',
              },
              headerLeft: () => (
                <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', marginLeft: 10, fontSize: 18, fontWeight: 'bold' }} >ozaferayan</Text>
                </View>
              ),
              headerRight: () => (
                <View style={{ marginRight: 20, flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image style={{ height: 25, width: 25, resizeMode: 'contain' }} source={images.menu} />
                  </TouchableOpacity>
                </View>
              )
            })
          },
        EditProfile: {
          screen: EditProfileScreen,
          navigationOptions: ({ navigation }) => ({
            ...palette.header,
            headerLeft: () => (
              <View style={styles.headerLeftContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image style={styles.headerLeftImage} source={images.close} />                
                </TouchableOpacity>
                <Text style={styles.headerLeftText}>Profili Düzenle</Text>
              </View>
            ),
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Info')}>
                  <Text style={styles.headerLeftText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            )            
          })
        }                                      
      })
    },    
    Archive: {
      screen: OtherScreen,
      navigationOptions: {
        drawerLabel: "Demo Screen 1"
      }
    }
  };

  const navigatorConfig = {
    drawerPosition: 'right',
    drawerType: 'slide',
    contentComponent: ProfileDrawer,
  }

  const styles = StyleSheet.create({
    headerLeftContainer: { ...palette.header.headerLeftContainer },
    headerLeftImage: { ...palette.header.image },
    headerRightContainer: { ...palette.header.headerRightContainer },
    headerRightImage: { ...palette.header.image },
    headerRightText: { color: colors.storyAdd, marginLeft: 10, fontSize: 18 },
    headerLeftText: { color: colors.textFaded1, marginLeft: 20, fontSize: 18, fontWeight: 'bold' },
  });

  export default ProfileNavigator = createDrawerNavigator(routeConfig, navigatorConfig);