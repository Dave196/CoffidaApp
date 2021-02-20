import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      reviews: [],
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
          reviews: responseJson.reviews,
        });
      })
      .catch((error) => {
        console.error(error);
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

    console.log(toSend);

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
        <View>
          <Text> My Account</Text>
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
            placeholder="New Password"
            onChangeText={this.handlePasswordInput}
            value={this.state.password}
            secureTextEntry={true}
          />
          <Button title="Update" onPress={this.updateAccount} color="#841584" />
          <FlatList
            data={this.state.reviews}
            renderItem={({item}) => (
              <View>
                <Text>flatlist </Text>
                <Text>{item.first_name} </Text>
              </View>
            )}
            keyExtractor={(item, index) => item.id.toString()}
          />
        </View>
      );
    }
  }
}

export default Account;
