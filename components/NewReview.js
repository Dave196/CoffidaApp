import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons';

class NewReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      location: {},
      overall_rating: 0,
      quality_rating: 0,
      price_rating: 0,
      clenliness_rating: 0,
      review_body: '',
    };
  }

  handleBodyInput = (review_body) => {
    this.setState({review_body: review_body});
  };

  addReview = async () => {
    const locationID = await AsyncStorage.getItem('@location_id');
    const token = await AsyncStorage.getItem('@session_token');

    let toSend = {
      overall_rating: parseInt(this.state.overall_rating),
      price_rating: parseInt(this.state.price_rating),
      quality_rating: parseInt(this.state.quality_rating),
      clenliness_rating: parseInt(this.state.clenliness_rating),
      review_body: this.state.review_body,
    };

    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' + locationID + '/review',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-Authorization': token},
        body: JSON.stringify(toSend),
      },
    )
      .then((response) => {
        if (response.status === 201) {
          console.log('Review added');
          this.props.navigation.goBack();
        } else if (response.status === 400) {
          throw 'Bad Request';
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
  };

  render() {
    return (
      <View>
        <Text> overall rating </Text>
        <Stars
          default={this.state.overall_rating}
          count={5}
          half={true}
          update={(val) => this.setState({overall_rating: val})}
        />
        <Text> {this.state.overall_rating} </Text>
        <Text> Price rating </Text>
        <Stars
          default={this.state.price_rating}
          count={5}
          half={true}
          update={(val) => this.setState({price_rating: val})}
        />
        <Text> {this.state.price_rating} </Text>
        <Text> Quality rating </Text>
        <Stars
          default={this.state.quality_rating}
          count={5}
          half={true}
          update={(val) => this.setState({quality_rating: val})}
        />
        <Text> {this.state.quality_rating} </Text>
        <Text> clenliness_rating </Text>
        <Stars
          default={this.state.clenliness_rating}
          count={5}
          half={true}
          update={(val) => this.setState({clenliness_rating: val})}
        />
        <Text> {this.state.clenliness_rating} </Text>
        <TextInput
          placeholder="Write Review"
          onChangeText={this.handleBodyInput}
          multiline={true}
        />
        <Button title="Submit Review" onPress={this.addReview} />
      </View>
    );
  }
}

export default NewReview;
