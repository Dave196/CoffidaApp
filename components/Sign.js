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
    this.setState({first_name: '', last_name: '', email: '', password: ''});
  };

  successfulSignUp = () => {
    this.clearText();
    this.props.navigation.navigate('Login');
  };

  signInInstead = () => {
    this.clearText();
    this.props.navigation.navigate('Login');
  };

  SignUp = () => {
    if (
      this.state.first_name === '' ||
      this.state.last_name === '' ||
      this.state.email === '' ||
      this.state.password === ''
    ) {
      Alert.alert('Not all fields have been entered');
    } else {
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
          ToastAndroid.show('user created', ToastAndroid.SHORT);
          this.clearText();
          this.props.navigation.navigate('Login');
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
          <Text style={styles.title}> Sign Up </Text>
        </View>
        <View style={styles.signInputView}>
          <TextInput
            style={styles.textInput}
            placeholder="First Name..."
            onChangeText={this.handleFirstNameInput}
            value={this.state.first_name}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Last Name..."
            onChangeText={this.handleLastNameInput}
            value={this.state.last_name}
          />
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
          <Button title="Sign up" onPress={this.SignUp} color="#B8860B" />

          <Text> Already have an account? </Text>

          <Button
            title="Login instead"
            onPress={this.signInInstead}
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
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
  },
  signInputView: {
    flex: 6,
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
    flex: 5,
  },
});

export default Sign;
