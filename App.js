import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {Text, View, Button, Pressable, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Find from './components/Find';
import Sign from './components/Sign';
import Login from './components/Login';
import Logout from './components/Logout';
import Favourite from './components/Favourite';
import Account from './components/Account';
import Review from './components/Review';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const FindStack = createStackNavigator();

function FindReviews({navigation}) {
  return (
    <FindStack.Navigator initialRouteName="Find">
      <FindStack.Screen
        name="Find"
        component={Find}
        options={{headerShown: false}}
      />
      <FindStack.Screen name="Review" component={Review} />
    </FindStack.Navigator>
  );
}

function Locations({navigation}) {
  return (
    <Tab.Navigator initialRouteName="Find">
      <Tab.Screen name="Find" component={FindReviews} />
      <Tab.Screen name="Favourite" component={Favourite} />
    </Tab.Navigator>
  );
}

function Home({navigation}) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Locations" component={Locations} />
      <Drawer.Screen name="My Account" component={Account} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
}

class CoffidaApp extends Component {
  render() {
    return (
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <RootStack.Screen
            name="Sign up"
            component={Sign}
            options={{headerShown: false}}
          />
          <RootStack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#841584',
  },
  logoutButton: {},
});

export default CoffidaApp;
