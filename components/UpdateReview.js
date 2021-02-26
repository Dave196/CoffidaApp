import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

class UpdateReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      photo: '',
      displayImage: true,
      //fields
      orig_overall_rating: props.route.params.overall_rating,
      orig_quality_rating: props.route.params.quality_rating,
      orig_price_rating: props.route.params.price_rating,
      orig_clenliness_rating: props.route.params.clenliness_rating,
      orig_review_body: props.route.params.review_body,
      //States to updated
      overall_rating: props.route.params.overall_rating,
      quality_rating: props.route.params.quality_rating,
      price_rating: props.route.params.price_rating,
      clenliness_rating: props.route.params.clenliness_rating,
      review_body: props.route.params.review_body,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getPhoto();
    });
  }

  componentWillUnmount() {
    console.log('unmount');
    this.unsubscribe();
  }

  getPhoto = async () => {
    const locationID = await AsyncStorage.getItem('@location_id');
    const id = await AsyncStorage.getItem('@review_id');

    this.setState({
      isLoading: true,
    });

    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' +
        locationID +
        '/review/' +
        id +
        '/photo',
    ).then((response) => {
      if (response.status === 200) {
        this.setState({
          photo:
            'http://10.0.2.2:3333/api/1.0.0/location/' +
            locationID +
            '/review/' +
            id +
            '/photo',
          isLoading: false,
        });
      } else if (response.status === 400) {
        throw 'Bad Request';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 403) {
        throw 'Forbidden';
      } else if (response.status === 404) {
        this.setState({
          photo: 'http',
          isLoading: false,
        });
      } else {
        throw 'Server error';
      }
    });
  };

  errorLoading = () => {
    this.setState({displayImage: false});
  };

  handleBodyInput = (review_body) => {
    this.setState({review_body: review_body});
  };

  updateReview = async () => {
    if (this.state.review_body === '') {
      Alert.alert('A review must be typed before updating');
    } else {
      let toSend = {};
      const token = await AsyncStorage.getItem('@session_token');
      const locationID = await AsyncStorage.getItem('@location_id');
      const id = await AsyncStorage.getItem('@review_id');

      if (this.state.overall_rating !== this.state.orig_overall_rating) {
        toSend.overall_ratinge = this.state.overall_rating;
      }
      if (this.state.quality_rating !== this.state.orig_quality_rating) {
        toSend.quality_rating = this.state.quality_rating;
      }
      if (this.state.price_rating !== this.state.orig_price_rating) {
        toSend.price_rating = this.state.price_rating;
      }
      if (this.state.clenliness_rating !== this.state.orig_clenliness_rating) {
        toSend.clenliness_rating = this.state.clenliness_rating;
      }
      if (this.state.review_body !== this.state.orig_review_body) {
        toSend.review_body = this.state.review_body;
      }

      return fetch(
        'http://10.0.2.2:3333/api/1.0.0/location/' +
          locationID +
          '/review/' +
          id,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
          body: JSON.stringify(toSend),
        },
      )
        .then((response) => {
          if (response.status === 200) {
            console.log('Review updated:');
            this.props.navigation.navigate('Location');
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
    }
  };

  deletePhoto = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const locationID = await AsyncStorage.getItem('@location_id');
    const id = await AsyncStorage.getItem('@review_id');

    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' +
        locationID +
        '/review/' +
        id +
        '/photo',
      {
        method: 'DELETE',
        headers: {'X-Authorization': token},
      },
    ).then((response) => {
      if (response.status === 200) {
        console.log('image deleted');
        this.getPhoto();
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 403) {
        throw 'Forbidden';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'server error';
      }
    });
  };

  addPhoto = () => {
    this.setState({
      isLoading: true,
      displayImage: true,
    });
    this.props.navigation.navigate('Camera');
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
        <ScrollView Style={styles.flexContainer}>
          <View style={styles.titleView}>
            <Ionicons name="menu" size={30} color="white" />
            <Icon
              name="arrowleft"
              size={35}
              color="white"
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={styles.title}> Update Review </Text>
          </View>
          <View style={styles.ratingView}>
            <View style={styles.starView}>
              <Text> Overall rating </Text>
              <Stars
                default={this.state.overall_rating}
                count={5}
                half={true}
                fullStar={<FontAwesome name="star" size={30} color="#B8860B" />}
                emptyStar={
                  <FontAwesome name="star-o" size={30} color="#B8860B" />
                }
                halfStar={
                  <FontAwesome name="star-half-o" size={30} color="#B8860B" />
                }
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
          <View style={styles.bodyView}>
            <TextInput
              style={styles.bodyText}
              placeholder="Write Review"
              onChangeText={this.handleBodyInput}
              multiline={true}
            />
          </View>
          <View style={styles.buttonView}>
            {this.state.displayImage ? (
              <Image
                style={styles.reviewImage}
                source={{
                  uri: this.state.photo,
                }}
                onError={this.errorLoading}
              />
            ) : (
              <View>
                <Text>No image </Text>
              </View>
            )}
            <Button
              title="Add/Change Photo"
              onPress={this.addPhoto}
              color="#B8860B"
            />
            <Button
              title="Delete photo"
              onPress={this.deletePhoto}
              color="black"
            />
            <Button
              title="Update"
              onPress={this.updateReview}
              color="#B8860B"
            />
          </View>
        </ScrollView>
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
    flex: 4,
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
  ratingView: {
    flex: 3,
    justifyContent: 'space-between',
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
  },
  bodyView: {
    flex: 5,
    justifyContent: 'center',
  },
  bodyText: {
    height: 300,
    backgroundColor: 'dimgray',
    borderStyle: 'solid',
    color: 'white',
    fontWeight: 'bold',
  },
  reviewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  buttonView: {
    flex: 3,
  },
});

export default UpdateReview;
