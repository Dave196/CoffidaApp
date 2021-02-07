import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Nearest from './components/Nearest';
import Find from './components/Find';
import Sign from './components/Sign';
import Login from './components/Login';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HomeTabs({ navigation }) {
  return (
    <Tab.Navigator initialRouteName="Nearest">
      <Tab.Screen name="Nearest" component={Nearest} />
      <Tab.Screen name="Find" component={Find} />
    </Tab.Navigator>
  );
}

function AccountStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Sign up" component={Sign} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

class CoffidaApp extends Component{
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={HomeTabs} />
          <Drawer.Screen name="Sign up" component={Sign} />
          <Drawer.Screen name="Login" component={Login} />
        </Drawer.Navigator>
      </NavigationContainer>

      );
  }
}

export default CoffidaApp;
