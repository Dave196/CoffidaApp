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
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      location: {},
      displayImage: true,
      accountReviews: [],
      likedID: [],
      locationID: '',
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

  errorLocationLoading = () => {
    this.setState({
      displayImage: false,
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
          item.likes = item.likes + 1;
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
          item.likes = item.likes - 1;
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
          <View style={styles.titleView}>
            <Ionicons name="menu" size={30} color="white" />
            <Icon
              name="arrowleft"
              size={35}
              color="white"
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={styles.title}>
              {this.state.location.location_name} (
              {this.state.location.location_town})
            </Text>
          </View>
          <View style={styles.locationView}>
            <ScrollView>
              <View style={styles.starView}>
                <Text> Average Overall Rating </Text>
                <Stars
                  display={this.state.location.avg_overall_rating}
                  count={5}
                  half={true}
                  fullStar={
                    <FontAwesome name="star" size={30} color="#B8860B" />
                  }
                  emptyStar={
                    <FontAwesome name="star-o" size={30} color="#B8860B" />
                  }
                  halfStar={
                    <FontAwesome name="star-half-o" size={30} color="#B8860B" />
                  }
                />
              </View>
              <View style={styles.starView}>
                <Text> Average Price Rating </Text>
                <Stars
                  display={this.state.location.avg_price_rating}
                  count={5}
                  half={true}
                  fullStar={<FontAwesome name="star" size={30} />}
                  emptyStar={<FontAwesome name="star-o" size={30} />}
                  halfStar={<FontAwesome name="star-half-o" size={30} />}
                />
              </View>
              <View style={styles.starView}>
                <Text> Average Quality Rating </Text>
                <Stars
                  display={this.state.location.avg_quality_rating}
                  count={5}
                  half={true}
                  fullStar={<FontAwesome name="star" size={30} />}
                  emptyStar={<FontAwesome name="star-o" size={30} />}
                  halfStar={<FontAwesome name="star-half-o" size={30} />}
                />
              </View>
              <View style={styles.starView}>
                <Text> Average Clenliness Rating </Text>
                <Stars
                  display={this.state.location.avg_clenliness_rating}
                  count={5}
                  half={true}
                  fullStar={<FontAwesome name="star" size={30} />}
                  emptyStar={<FontAwesome name="star-o" size={30} />}
                  halfStar={<FontAwesome name="star-half-o" size={30} />}
                />
              </View>
              <Button
                title="Add review"
                onPress={() => this.props.navigation.navigate('NewReview')}
                color="#B8860B"
              />
              {this.state.displayImage ? (
                <Image
                  style={styles.reviewImage}
                  source={{
                    uri: this.state.location.photo_path,
                  }}
                  onError={this.errorLocationLoading}
                />
              ) : (
                <View>
                  <Text>--No image--</Text>
                </View>
              )}
            </ScrollView>
          </View>
          <View style={styles.myReviewView}>
            <Text style={styles.heading}> My Reviews </Text>
            <FlatList
              data={this.state.accountReviews}
              renderItem={({item}) => (
                <View style={styles.myReviewItem}>
                  <Text style={styles.bodyText}>{item.review_body}</Text>
                  <View style={styles.myReviewButtons}>
                    <Button
                      style={styles.myReviewButton}
                      title="Update"
                      onPress={() => this.updateReview(item)}
                      color="#B8860B"
                    />
                    <Button
                      title="Delete"
                      onPress={() => this.deleteReview(item.review_id)}
                      color="black"
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => item.review_id.toString()}
            />
          </View>
          <View style={styles.allReviewView}>
            <Text style={styles.heading}> All Reviews </Text>
            <FlatList
              data={this.state.location.location_reviews}
              renderItem={({item}) => (
                <View style={styles.allReviewItem}>
                  <Text style={styles.bodyText}>{item.review_body}</Text>
                  <View style={styles.likes}>
                    <Icon
                      name={item.liked}
                      size={20}
                      onPress={() => this.toggleLike(item)}
                    />
                    <Text>{item.likes}</Text>
                  </View>
                  <View style={styles.reviewStarView}>
                    <Text> overall rating </Text>
                    <Stars
                      display={item.overall_rating}
                      count={5}
                      half={true}
                      fullStar={
                        <FontAwesome name="star" size={20} color="#B8860B" />
                      }
                      emptyStar={
                        <FontAwesome name="star-o" size={20} color="#B8860B" />
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
                  <View style={styles.reviewStarView}>
                    <Text> Price rating </Text>
                    <Stars
                      display={item.price_rating}
                      count={5}
                      half={true}
                      fullStar={<FontAwesome name="star" size={20} />}
                      emptyStar={<FontAwesome name="star-o" size={20} />}
                      halfStar={<FontAwesome name="star-half-o" size={20} />}
                    />
                  </View>
                  <View style={styles.reviewStarView}>
                    <Text> Quality Rating </Text>
                    <Stars
                      display={item.quality_rating}
                      count={5}
                      half={true}
                      fullStar={<FontAwesome name="star" size={20} />}
                      emptyStar={<FontAwesome name="star-o" size={20} />}
                      halfStar={<FontAwesome name="star-half-o" size={20} />}
                    />
                  </View>
                  <View style={styles.reviewStarView}>
                    <Text> Clenliness Rating </Text>
                    <Stars
                      display={item.clenliness_rating}
                      count={5}
                      half={true}
                      fullStar={<FontAwesome name="star" size={20} />}
                      emptyStar={<FontAwesome name="star-o" size={20} />}
                      halfStar={<FontAwesome name="star-half-o" size={20} />}
                    />
                  </View>
                  {item.displayImage ? (
                    <Image
                      style={styles.reviewImage}
                      source={{
                        uri: item.photo,
                      }}
                    />
                  ) : (
                    <View>
                      <Text>--No image-- </Text>
                    </View>
                  )}
                </View>
              )}
              keyExtractor={(item, index) => item.review_id.toString()}
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
    fontSize: 25,
    color: 'white',
  },
  locationView: {
    flex: 3,
    backgroundColor: 'lightgray',
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
  },
  bodyText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  myReviewView: {
    flex: 2,
  },
  myReviewItem: {
    backgroundColor: 'whitesmoke',
  },
  myReviewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 2,
  },
  myReviewButton: {
    width: 50,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  allReviewView: {
    flex: 6,
  },
  allReviewItem: {
    backgroundColor: 'whitesmoke',
    borderBottomWidth: 5,
    alignItems: 'center',
  },
  likes: {
    flexDirection: 'row',
  },
  reviewStarView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default Location;
