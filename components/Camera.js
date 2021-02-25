import React, {Component} from 'react';
import {View, Button, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RNCamera} from 'react-native-camera';

class Camera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  uploadPicture = async (data) => {
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
        method: 'POST',
        headers: {'Content-Type': 'image/jpeg', 'X-Authorization': token},
        body: data,
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('photo uploaded');
          this.props.navigation.navigate('UpdateReview');
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
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.uploadPicture(data);
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
        />
        <Button title="Take Photo" onPress={this.takePicture} />
      </View>
    );
  }
}

export default Camera;
