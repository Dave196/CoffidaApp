import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Nearest extends Component{
  render() {

    return (
      <View>
        <Text> Nearest
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: 'blanchedalmond',
  },
});

export default Nearest;
