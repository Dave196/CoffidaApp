import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Sign from './components/Sign';
import Login from './components/Login';
import Logout from './components/Logout';
import Find from './components/Find';
import Favourite from './components/Favourite';
import Reviewed from './components/Reviewed';
import Account from './components/Account';
import Location from './components/Location';
import NewReview from './components/NewReview';
import UpdateReview from './components/UpdateReview';
import Camera from './components/Camera';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const LocationStack = createStackNavigator();

function Locations({navigation}) {
  return (
    <LocationStack.Navigator initialRouteName="Locations">
      <LocationStack.Screen
        name="Locations"
        component={Home}
        options={{headerShown: false}}
      />
      <LocationStack.Screen name="Location" component={Location} />
      <LocationStack.Screen name="NewReview" component={NewReview} />
      <LocationStack.Screen name="UpdateReview" component={UpdateReview} />
      <LocationStack.Screen name="Camera" component={Camera} />
    </LocationStack.Navigator>
  );
}

function Home({navigation}) {
  return (
    <Tab.Navigator initialRouteName="Find">
      <Tab.Screen name="Find" component={Find} />
      <Tab.Screen name="Favourite" component={Favourite} />
      <Tab.Screen name="Reviewed" component={Reviewed} />
    </Tab.Navigator>
  );
}

function Main({navigation}) {
  return (
    <Drawer.Navigator initialRouteName="Locations">
      <Drawer.Screen name="Home" component={Home} />
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
            name="Main"
            component={Main}
            options={{headerShown: false}}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default CoffidaApp;
