import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      orig_first_name: '',
      orig_last_name: '',
      orig_email: '',
      orig_password: '',
      //states that would be updated
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    this.getAccount();
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

  clearPassword = () => {
    this.setState({password: ''});
  };

  getAccount = async () => {
    this.setState({
      isLoading: true,
    });

    let token = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem('@user_ID');

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
      headers: {'X-Authorization': token},
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'not found';
        } else {
          throw 'something went wrong';
        }
      })
      .then((responseJson) => {
        ToastAndroid.show('Account updated', ToastAndroid.SHORT);
        this.setState({
          isLoading: false,
          orig_first_name: responseJson.first_name,
          orig_last_name: responseJson.last_name,
          orig_email: responseJson.email,
          //states that would be updated
          first_name: responseJson.first_name,
          last_name: responseJson.last_name,
          email: responseJson.email,
          password: '',
        });
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  updateAccount = async () => {
    let toSend = {};
    let token = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem('@user_ID');

    if (this.state.first_name !== this.state.orig_first_name) {
      toSend.first_name = this.state.first_name;
    }
    if (this.state.last_name !== this.state.orig_last_name) {
      toSend.last_name = this.state.last_name;
    }
    if (this.state.email !== this.state.orig_email) {
      toSend.email = this.state.email;
    }
    if (this.state.password !== '') {
      toSend.password = this.state.password;
    }

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', 'X-Authorization': token},
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Account info updated:');
          this.clearPassword();
          this.getAccount();
        } else if (response.status === 400) {
          throw 'Bad Request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else {
          throw 'Server error';
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#841584" />
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <View style={styles.titleView}>
            <Icon name="menu" size={30} color="white" />
            <Text style={styles.title}> Account</Text>
          </View>
          <View style={styles.inputView}>
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
              placeholder="New Password"
              onChangeText={this.handlePasswordInput}
              value={this.state.password}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.buttonView}>
            <Button
              title="Update"
              onPress={this.updateAccount}
              color="#B8860B"
            />
          </View>
        </View>
      );
    }
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
    flexDirection: 'row',
    alignItems: 'center',
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
  inputView: {
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
    flex: 5,
    justifyContent: 'space-around',
    width: 200,
  },
});

export default Account;
