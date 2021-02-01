import React, { Component } from 'react';
import {Text,View} from 'react-native';

class SayHello extends Component {
  render(){
    return (
      <View>
        <Text>Hello {this.props.name}</Text>
      </View>
    )
  };
}


class HelloWorldApp extends Component{
  render(){

    let name = "Dave";

    return (
        <View>
          <SayHello name="Dave" />
          <SayHello name="Louis" />
          <SayHello name="Kelby" />
        </View>
      );
  }
}

export default HelloWorldApp;
