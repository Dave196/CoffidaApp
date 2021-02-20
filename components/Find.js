import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

class Find extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      locations: {},
      search: '',
      overall_rating: '',
      price_rating: '',
      clenliness_rating: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkFavourites();
      this.getLocations();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleSearchInput = (search) => {
    this.setState({search: search});
  };

  handleOverallInput = (overall_rating) => {
    this.setState({overall_rating: overall_rating});
  };

  handlePriceInput = (price_rating) => {
    this.setState({price_rating: price_rating});
  };

  handleClenlinessInput = (clenliness_rating) => {
    this.setState({clenliness_rating: clenliness_rating});
  };

  getLocations = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    let filter = '';

    this.setState({
      isLoading: true,
    });

    if (this.state.search !== '') {
      filter = filter + '&' + 'q=' + this.state.search;
    }
    if (this.state.overall_rating !== '') {
      filter = filter + '&' + 'overall_rating=' + this.state.overall_rating;
    }
    if (this.state.price_rating !== '') {
      filter = filter + '&' + 'price_rating=' + this.state.price_rating;
    }
    if (this.state.clenliness_rating !== '') {
      filter =
        filter + '&' + 'clenliness_rating=' + this.state.clenliness_rating;
    }
    return fetch('http://10.0.2.2:3333/api/1.0.0/find?' + filter, {
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
        this.state.locations.forEach((location) => {
          this.initalCheck(location);
        });
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  checkFavourites = async () => {
    let token = await AsyncStorage.getItem('@session_token');

    return fetch('http://10.0.2.2:3333/api/1.0.0/find?search_in=favourite', {
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
      .then(async (responseJson) => {
        let FavouriteID = [];
        responseJson.forEach((location) => {
          FavouriteID.push(location.location_id);
        });
        await AsyncStorage.setItem('@FavID', JSON.stringify(FavouriteID));
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };
  //When called assigns a boolean to a location on whether its has been favourited
  initalCheck = async (item) => {
    let FavouriteID = JSON.parse(await AsyncStorage.getItem('@FavID'));
    if (FavouriteID.includes(item.location_id)) {
      item.favourited = true;
      this.setState({
        locations: this.state.locations,
      });
    } else {
      item.favourited = false;
      this.setState({
        locations: this.state.locations,
      });
    }
  };

  async toggleFavourite(item) {
    let token = await AsyncStorage.getItem('@session_token');

    if (item.favourited === false) {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' +
          item.location_id +
          '/favourite',
        {
          method: 'POST',
          headers: {'X-Authorization': token},
        },
      ).then((response) => {
        if (response.status === 200) {
          this.checkFavourites();
          item.favourited = true;
          this.setState({
            locations: this.state.locations,
          });
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else {
          throw 'server error';
        }
      });
    }
    if (item.favourited === true) {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' +
          item.location_id +
          '/favourite',
        {
          method: 'DELETE',
          headers: {'X-Authorization': token},
        },
      ).then((response) => {
        if (response.status === 200) {
          this.checkFavourites();
          item.favourited = false;
          this.setState({
            locations: this.state.locations,
          });
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else {
          throw 'server error';
        }
      });
    }
  }

  async navigateToLogation(ID) {
    await AsyncStorage.setItem('@location_id', JSON.stringify(ID));
    this.props.navigation.navigate('Review');
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
          <TextInput
            placeholder="search"
            onChangeText={this.handleSearchInput}
            value={this.state.search}
          />
          <TextInput
            placeholder="overall_rating"
            onChangeText={this.handleOverallInput}
            value={this.state.overall_rating}
          />
          <TextInput
            placeholder="price_rating"
            onChangeText={this.handlePriceInput}
            value={this.state.price_rating}
          />
          <TextInput
            placeholder="clenliness_rating"
            onChangeText={this.handleClenlinessInput}
            value={this.state.clenliness_rating}
          />
          <Button title="Apply Filter" onPress={this.getLocations} />
          <FlatList
            data={this.state.locations}
            renderItem={({item}) => (
              <View>
                <Pressable onPress={() => this.navigateToLogation(item.location_id)}>
                  <Text>
                    {item.location_name}--{item.location_town}
                  </Text>
                </Pressable>
                <CheckBox
                  value={item.favourited}
                  onValueChange={() => this.toggleFavourite(item)}
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

export default Find;
