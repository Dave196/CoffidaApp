import React, {Component} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      location: {},
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getLocation();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getLocation = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    let location_id = await AsyncStorage.getItem('@location_id');

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + location_id, {
      headers: {'X-Authorization': token},
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          throw 'Not found';
        } else {
          throw 'server error';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          location: responseJson,
        });
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
          <Text>{this.state.location.location_name} </Text>
        </View>
      );
    }
  }
}

export default Review;
