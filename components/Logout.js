import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  Logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method: 'POST',
      headers: {'X-Authorization': token},
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Successful logout');
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          throw 'No one signed in';
        } else {
          throw 'something went wrong';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <View>
        <Button title="Logout" onPress={this.Logout} color="#841584" />
      </View>
    );
  }
}

export default Logout;
