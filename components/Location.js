import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ToastAndroid,
  Button,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';

class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      location: {},
      accountReviews: [],
      likedID: [],
      locationID: ''
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getAccountInfo();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getAccountInfo = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@user_ID');
    const locationID = parseInt(await AsyncStorage.getItem('@location_id'));

    this.setState({
      locationID: locationID,
      accountReviews: [],
      likedID: [],
    });

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
        responseJson.reviews.forEach((review) => {
          if (review.location.location_id === locationID) {
            this.state.accountReviews.push(review.review);
          }
        });
        responseJson.liked_reviews.forEach((likedReview) => {
          if (likedReview.location.location_id === locationID) {
            this.state.likedID.push(parseInt(likedReview.review.review_id));
          }
        });
        this.getLocation();
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  getLocation = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const locationID = await AsyncStorage.getItem('@location_id');

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locationID, {
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
        this.state.location.location_reviews.forEach((review) => {
          this.initialCheck(review, this.state.location.location_id);
        });
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  initialCheck = (item, locationID) => {
    if (this.state.likedID.includes(item.review_id)) {
      item.liked = 'like1';
      item.displayImage = true;
      this.setState({
        location: this.state.location,
      });
    } else {
      item.liked = 'like2';
      this.setState({
        location: this.state.location,
      });
    }

    //Method to check if there is an image for each item.

    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' +
        locationID +
        '/review/' +
        item.review_id +
        '/photo',
    ).then((response) => {
      if (response.status === 200) {
        item.photo =
          'http://10.0.2.2:3333/api/1.0.0/location/' +
          locationID +
          '/review/' +
          item.review_id +
          '/photo';
        item.displayImage = true;
        this.setState({
          location: this.state.location,
        });
      } else if (response.status === 400) {
        throw 'Bad Request';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 403) {
        throw 'Forbidden';
      } else if (response.status === 404) {
        item.photo = 'http:';
        item.displayImage = false;
        this.setState({
          location: this.state.location,
        });
      } else {
        throw 'Server error';
      }
    });
  };

  errorLoading(item) {
    item.displayImage = false;
    this.setState({
      location: this.state.location,
    });
  }

  async updateReview(item) {
    this.setState({
      isLoading: true,
    });
    await AsyncStorage.setItem('@review_id', JSON.stringify(item.review_id));
    this.props.navigation.navigate('UpdateReview', item);
  }

  async deleteReview(ID) {
    const token = await AsyncStorage.getItem('@session_token');
    const locationID = await AsyncStorage.getItem('@location_id');

    this.setState({
      isLoading: true,
    });

    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' + locationID + '/review/' + ID,
      {
        method: 'DELETE',
        headers: {'X-Authorization': token},
      },
    )
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            accountReviews: [],
          });
          this.getAccountInfo();
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden';
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

  async toggleLike(item) {
    const token = await AsyncStorage.getItem('@session_token');
    const locationID = await AsyncStorage.getItem('@location_id');

    if (item.liked === 'like2') {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' +
          locationID +
          '/review/' +
          item.review_id +
          '/like',
        {
          method: 'POST',
          headers: {'X-Authorization': token},
        },
      ).then((response) => {
        if (response.status === 200) {
          item.liked = 'like1';
          this.setState({
            location: this.state.location,
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
    } else if (item.liked === 'like1') {
      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' +
          locationID +
          '/review/' +
          item.review_id +
          '/like',
        {
          method: 'DELETE',
          headers: {'X-Authorization': token},
        },
      ).then((response) => {
        if (response.status === 200) {
          item.liked = 'like2';
          this.setState({
            location: this.state.location,
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
          <Text>{this.state.location.location_name} </Text>
          <Button
            title="Add review"
            onPress={() => this.props.navigation.navigate('NewReview')}
          />
          <Text> MY REVIEWS </Text>
          <FlatList
            data={this.state.accountReviews}
            renderItem={({item}) => (
              <View>
                <Text>{item.review_body}</Text>
                <Button
                  title="Update"
                  onPress={() => this.updateReview(item)}
                />
                <Button
                  title="Delete"
                  onPress={() => this.deleteReview(item.review_id)}
                />
              </View>
            )}
            keyExtractor={(item, index) => item.review_id.toString()}
          />

          <Text> ALL REVIEWS </Text>
          <FlatList
            data={this.state.location.location_reviews}
            renderItem={({item}) => (
              <View>
                <Text>{item.review_body}</Text>
                <Icon
                  name={item.liked}
                  size={20}
                  onPress={() => this.toggleLike(item)}
                />
                {item.displayImage ? (
                  <Image
                    style={styles.reviewImage}
                    source={{
                      uri: item.photo,
                    }}
                  />
                ) : (
                  <View>
                    <Text>No image </Text>
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item, index) => item.review_id.toString()}
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
  myReview: {
    flex: 1,
  },
  reviewImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
  },
});

export default Location;
