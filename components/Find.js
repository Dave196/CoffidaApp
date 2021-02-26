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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class Find extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      locations: {},
      search: '',
      overall_rating: 0,
      quality_rating: 0,
      price_rating: 0,
      clenliness_rating: 0,
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

  resetFilter = () => {
    this.setState({
      search: '',
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
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
    if (this.state.overall_rating !== 0) {
      filter = filter + '&' + 'overall_rating=' + this.state.overall_rating;
    }
    if (this.state.price_rating !== 0) {
      filter = filter + '&' + 'price_rating=' + this.state.price_rating;
    }
    if (this.state.quality_rating !== 0) {
      filter = filter + '&' + 'quality_rating=' + this.state.quality_rating;
    }
    if (this.state.clenliness_rating !== 0) {
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
          <View style={styles.titleView}>
            <Ionicons name="menu" size={30} color="white" />
            <Text style={styles.title}>Find</Text>
          </View>
          <View style={styles.filterView}>
            <TextInput
              style={styles.textInput}
              placeholder="search"
              onChangeText={this.handleSearchInput}
              value={this.state.search}
            />
            <View style={styles.starView}>
              <Text> overall rating </Text>
              <Stars
                default={this.state.overall_rating}
                count={5}
                half={true}
                fullStar={<FontAwesome name="star" size={30} />}
                emptyStar={<FontAwesome name="star-o" size={30} />}
                halfStar={<FontAwesome name="star-half-o" size={30} />}
                update={(val) => this.setState({overall_rating: val})}
              />
              <Text> {this.state.overall_rating} </Text>
            </View>
            <View style={styles.starView}>
              <Text> Price rating </Text>
              <Stars
                default={this.state.price_rating}
                count={5}
                half={true}
                fullStar={<FontAwesome name="star" size={30} />}
                emptyStar={<FontAwesome name="star-o" size={30} />}
                halfStar={<FontAwesome name="star-half-o" size={30} />}
                update={(val) => this.setState({price_rating: val})}
              />
              <Text> {this.state.price_rating} </Text>
            </View>
            <View style={styles.starView}>
              <Text> Quality rating </Text>
              <Stars
                default={this.state.quality_rating}
                count={5}
                half={true}
                fullStar={<FontAwesome name="star" size={30} />}
                emptyStar={<FontAwesome name="star-o" size={30} />}
                halfStar={<FontAwesome name="star-half-o" size={30} />}
                update={(val) => this.setState({quality_rating: val})}
              />
              <Text> {this.state.quality_rating} </Text>
            </View>
            <View style={styles.starView}>
              <Text> clenliness_rating </Text>
              <Stars
                default={this.state.clenliness_rating}
                count={5}
                half={true}
                fullStar={<FontAwesome name="star" size={30} />}
                emptyStar={<FontAwesome name="star-o" size={30} />}
                halfStar={<FontAwesome name="star-half-o" size={30} />}
                update={(val) => this.setState({clenliness_rating: val})}
              />
              <Text> {this.state.clenliness_rating} </Text>
            </View>
          </View>
          <View style={styles.buttonView}>
            <Button title="reset" onPress={this.resetFilter} color="black" />
            <Button
              title="Apply Filter"
              onPress={this.checkFavourites}
              color="#B8860B"
            />
            <Text> (Press on location) </Text>
          </View>
          <View style={styles.flatListView}>
            <FlatList
              data={this.state.locations}
              renderItem={({item}) => (
                <View>
                  <Pressable
                    style={styles.pressableView}
                    onPress={() => this.navigateToLogation(item.location_id)}>
                    <Text style={styles.locationName}>
                      {item.location_name} ({item.location_town})
                    </Text>
                    <View style={styles.locationStarView}>
                      <Text> Overall rating </Text>
                      <Stars
                        display={item.avg_overall_rating}
                        count={5}
                        half={true}
                        fullStar={
                          <FontAwesome name="star" size={20} color="#B8860B" />
                        }
                        emptyStar={
                          <FontAwesome
                            name="star-o"
                            size={20}
                            color="#B8860B"
                          />
                        }
                        halfStar={
                          <FontAwesome
                            name="star-half-o"
                            size={20}
                            color="#B8860B"
                          />
                        }
                      />
                    </View>
                    <View style={styles.locationStarView}>
                      <Text> Price rating </Text>
                      <Stars
                        display={item.avg_price_rating}
                        count={5}
                        half={true}
                        fullStar={<FontAwesome name="star" size={20} />}
                        emptyStar={<FontAwesome name="star-o" size={20} />}
                        halfStar={<FontAwesome name="star-half-o" size={20} />}
                      />
                    </View>
                    <View style={styles.locationStarView}>
                      <Text> Quality Rating </Text>
                      <Stars
                        display={item.avg_quality_rating}
                        count={5}
                        half={true}
                        fullStar={<FontAwesome name="star" size={20} />}
                        emptyStar={<FontAwesome name="star-o" size={20} />}
                        halfStar={<FontAwesome name="star-half-o" size={20} />}
                      />
                    </View>
                    <View style={styles.locationStarView}>
                      <Text> Clenliness Rating </Text>
                      <Stars
                        display={item.avg_clenliness_rating}
                        count={5}
                        half={true}
                        fullStar={<FontAwesome name="star" size={20} />}
                        emptyStar={<FontAwesome name="star-o" size={20} />}
                        halfStar={<FontAwesome name="star-half-o" size={20} />}
                      />
                    </View>
                  </Pressable>
                  <View style={styles.favouriteView}>
                    <Text> Favourited </Text>
                    <CheckBox
                      value={item.favourited}
                      tintColors={{true: '#B8860B', false: 'black'}}
                      color="#B8860B"
                      onValueChange={() => this.toggleFavourite(item)}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => item.location_id.toString()}
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
    backgroundColor: 'white',
  },
  titleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#B8860B',
    borderStyle: 'solid',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
  },
  filterView: {
    flex: 4,
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
  },
  textInput: {
    width: '100%',
    backgroundColor: 'dimgray',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'white',
    fontWeight: 'bold',
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  buttonView: {
    flex: 2,
  },
  flatListView: {
    flex: 6,
  },
  pressableView: {
    backgroundColor: 'whitesmoke',
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  locationStarView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  favouriteView: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default Find;
