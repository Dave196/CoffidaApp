import React, {Component} from 'react';
import {Text, View, Button, StyleSheet, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

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
          ToastAndroid.show('Successful Logout', ToastAndroid.SHORT);
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          throw 'No one signed in';
        } else {
          throw 'something went wrong';
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  render() {
    return (
      <View style={styles.flexContainer}>
        <View style={styles.titleView}>
          <Icon name="menu" size={30} color="white" />
          <Text style={styles.title}> Logout </Text>
        </View>
        <View style={styles.buttonView}>
          <Text style={styles.text}> Sad to see you go, come back soon! </Text>
          <Button title="Logout" onPress={this.Logout} color="#B8860B" />
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
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
  buttonView: {
    flex: 11,
    justifyContent: 'space-around',
    width: 200,
  },
});

export default Logout;
