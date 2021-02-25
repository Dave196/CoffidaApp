import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  Image,
  StyleSheet,
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
      quality_rating: '',
      price_rating: '',
      clenliness_rating: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkFavourites();
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

  handleQualityInput = (quality_rating) => {
    this.setState({quality_rating: quality_rating});
  };

  handlePriceInput = (price_rating) => {
    this.setState({price_rating: price_rating});
  };

  handleClenlinessInput = (clenliness_rating) => {
    this.setState({clenliness_rating: clenliness_rating});
  };

  checkFavourites = async () => {
    const token = await AsyncStorage.getItem('@session_token');

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
        //After the check get all the locations
        this.getLocations();
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  getLocations = async () => {
    const token = await AsyncStorage.getItem('@session_token');
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
    if (this.state.quality_rating !== '') {
      filter = filter + '&' + 'quality_rating=' + this.state.quality_rating;
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
          this.initialCheck(location);
        });
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  //When called assigns a boolean to a location on whether its has been favourited
  initialCheck = async (item) => {
    const FavouriteID = JSON.parse(await AsyncStorage.getItem('@FavID'));
    if (FavouriteID.includes(item.location_id)) {
      item.displayImage = true;
      item.favourited = true;
      this.setState({
        locations: this.state.locations,
      });
    } else {
      item.displayImage = true;
      item.favourited = false;
      this.setState({
        locations: this.state.locations,
      });
    }
  };

  errorLoading(item) {
    item.displayImage = false;
    this.setState({
      locations: this.state.locations,
    });
  }

  async toggleFavourite(item) {
    const token = await AsyncStorage.getItem('@session_token');

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
    } else if (item.favourited === true) {
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
        <View style={styles.flexContainer}>
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
            placeholder="quality_rating"
            onChangeText={this.handleQualityInput}
            value={this.state.quality_rating}
          />
          <TextInput
            placeholder="clenliness_rating"
            onChangeText={this.handleClenlinessInput}
            value={this.state.clenliness_rating}
          />
          <Button title="Apply Filter" onPress={this.checkFavourites} />
          <FlatList
            data={this.state.locations}
            renderItem={({item}) => (
              <View>
                <Pressable
                  onPress={() => this.navigateToLogation(item.location_id)}>
                  <Text>
                    {item.location_name}--{item.location_town}
                  </Text>
                  {this.state.displayImage ? (
                    <Image
                      style={styles.reviewImage}
                      source={{
                        uri: item.photo_path,
                      }}
                      onError={() => this.errorLoading(item)}
                    />
                  ) : (
                    <View>
                      <Text>No image </Text>
                    </View>
                  )}
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

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: 'antiquewhite',
  },
  reviewImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 2,
    width: 200,
    backgroundColor: 'dimgray',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  loginButton: {
    backgroundColor: '#841584',
  },
});

export default Find;
