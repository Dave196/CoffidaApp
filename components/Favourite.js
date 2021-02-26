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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
        <View style={styles.flexContainer}>
          <View style={styles.titleView}>
            <Ionicons name="menu" size={30} color="white" />
            <Text style={styles.title}>Favourite</Text>
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
                  <Button
                    title="remove"
                    color="black"
                    onPress={() => this.deleteFavourite(item)}
                  />
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
    borderBottomWidth: 2,
    borderStyle: 'solid',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
  },
  flatListView: {
    flex: 11,
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
});

export default Favourite;
