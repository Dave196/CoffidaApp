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
    this.props.navigation.navigate('Main');
  };

  signUpInstead = () => {
    this.clearText();
    this.props.navigation.navigate('Sign up');
  };

  login = async () => {
    if (this.state.email === '' || this.state.password === '') {
      Alert.alert('Type an email and password');
    } else {
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
          ToastAndroid.show('Logged in', ToastAndroid.SHORT);
          let ID = JSON.stringify(responseJson.id);
          await AsyncStorage.setItem('@session_token', responseJson.token);
          await AsyncStorage.setItem('@user_ID', ID);
          this.successfulLogin();
        })
        .catch((error) => {
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
  };

  render() {
    return (
      <View style={styles.flexContainer}>
        <View style={styles.titleView}>
          <Text style={styles.title}>Login </Text>
        </View>
        <View style={styles.loginInputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Email..."
            onChangeText={this.handleEmailInput}
            value={this.state.email}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password..."
            onChangeText={this.handlePasswordInput}
            value={this.state.password}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonView}>
          <Button title="Login" onPress={this.login} color="#B8860B" />
          <Text> Don't have an account? Sign up instead </Text>
          <Button
            title="Sign up"
            onPress={this.signUpInstead}
            color="#B8860B"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  titleView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#B8860B',
    borderBottomWidth: 2,
    borderStyle: 'solid',
  },
  title: {
    fontFamily: 'Monospace',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 30,
  },
  loginInputView: {
    flex: 3,
    justifyContent: 'space-around',
  },
  textInput: {
    width: 300,
    backgroundColor: 'dimgray',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonView: {
    justifyContent: 'space-around',
    flex: 8,
  },
});

export default Login;
