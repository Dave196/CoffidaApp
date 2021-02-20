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

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailInput = (email) => {
    this.setState({email: email});
  };

  handlePasswordInput = (pass) => {
    this.setState({password: pass});
  };

  clearText = () => {
    this.setState({email: '', password: ''});
  };

  successfulLogin = () => {
    this.clearText();
    this.props.navigation.navigate('Home');
  }

  signUpInstead = () => {
    this.clearText();
    this.props.navigation.navigate('Sign up');
  };

  login = async () => {
    //Validation to be added
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw 'Invalid email/password';
        } else {
          throw 'something went wrong';
        }
      })
      .then(async (responseJson) => {
        let ID = JSON.stringify(responseJson.id);

        console.log('user signed in:', responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_ID', ID);
        //await AsyncStorage.setItem('@Favourite', )
        this.successfulLogin();
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  render() {
    return (
      <View>
        <TextInput
          placeholder="Email..."
          onChangeText={this.handleEmailInput}
          value={this.state.email}
        />
        <TextInput
          placeholder="Password..."
          onChangeText={this.handlePasswordInput}
          value={this.state.password}
          secureTextEntry={true}
        />
        <Button title="Login" onPress={this.login} color="#841584" />

        <Button title="Sign up" onPress={this.signUpInstead} color="#841584" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    backgroundColor: 'steelblue',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  loginButton: {
    backgroundColor: '#841584',
  },
});

export default Login;
