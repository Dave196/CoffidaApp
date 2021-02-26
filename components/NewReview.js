import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  ToastAndroid,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
    if (this.state.review_body === '') {
      Alert.alert('A review must be typed before submitting');
    } else {
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
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
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
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
  };

  render() {
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
          <Text style={styles.title}> Add Review </Text>
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
          <Button title="Submit" onPress={this.addReview} color="#B8860B" />
        </View>
      </View>
    );
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
    flex: 6,
    justifyContent: 'center',
  },
  bodyText: {
    height: 300,
    backgroundColor: 'dimgray',
    borderStyle: 'solid',
    color: 'white',
    fontWeight: 'bold',
  },
  buttonView: {
    flex: 2,
  },
});

export default NewReview;
