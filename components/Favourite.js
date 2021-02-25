import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Favourite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      locations: {},
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getFavLocations();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFavLocations = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    return fetch('http://10.0.2.2:3333/api/1.0.0/find?search_in=favourite', {
      headers: {'X-Authorization': token},
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw 'Bad Request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else {
          throw 'server error';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          locations: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  async deleteFavourite(item) {
    const token = await AsyncStorage.getItem('@session_token');

    this.setState({
      isLoading: true,
    });

    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' +
        item.location_id +
        '/favourite',
      {
        method: 'DELETE',
        headers: {'X-Authorization': token},
      },
    )
      .then((response) => {
        if (response.status === 200) {
          this.getFavLocations();
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else {
          throw 'server error';
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  async navigateToLogation(ID) {
    await AsyncStorage.setItem('@location_id', JSON.stringify(ID));
    this.props.navigation.navigate('Location');
  }

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
          <FlatList
            data={this.state.locations}
            renderItem={({item}) => (
              <View>
                <Pressable
                  onPress={() => this.navigateToLogation(item.location_id)}>
                  <Text>
                    {item.location_name}--{item.location_town}
                  </Text>
                </Pressable>
                <Button
                  title="remove"
                  onPress={() => this.deleteFavourite(item)}
                />
              </View>
            )}
            keyExtractor={(item, index) => item.location_id.toString()}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: 'blanchedalmond',
  },
});

export default Favourite;
