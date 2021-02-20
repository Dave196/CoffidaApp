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

class Sign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
  }

  handleFirstNameInput = (firstName) => {
    this.setState({first_name: firstName});
  };

  handleLastNameInput = (lastName) => {
    this.setState({last_name: lastName});
  };

  handleEmailInput = (email) => {
    this.setState({email: email});
  };

  handlePasswordInput = (pass) => {
    this.setState({password: pass});
  };

  clearText = () => {
    this.setState({first_name: '', lastName: '', email: '', password: ''});
  };

  successfulSignUp = () => {
    this.clearText();
    this.props.navigation.navigate('Login');
  };

  signInInstead = () => {
    this.clearText();
    this.props.navigation.goBack();
  };

  SignUp = () => {
    //Validation to be added
    return fetch('http://10.0.2.2:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw 'failed validation';
        } else {
          throw 'something went wrong';
        }
      })
      .then(async (responseJson) => {
        console.log('User created with ID:', responseJson);
        this.clearText();
        this.props.navigation.navigate('Login');
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
          placeholder="First Name..."
          onChangeText={this.handleFirstNameInput}
          value={this.state.first_name}
        />
        <TextInput
          placeholder="Last Name..."
          onChangeText={this.handleLastNameInput}
          value={this.state.last_name}
        />
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
        <Button title="Sign up" onPress={this.SignUp} color="#841584" />

        <Button
          title="Login instead"
          onPress={this.signInInstead}
          color="#841584"
        />
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

export default Sign;
