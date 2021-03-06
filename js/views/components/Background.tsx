import * as React from 'react'; import { Component } from 'react';
import {
  Image,
  View
} from 'react-native';

import { styles, colors, screenWidth, screenHeight, topBarHeight, tabBarHeight} from '../styles'


export class Background extends Component<any, any> {
  render() {
    return (
      <View style={[styles.fullscreen,{elevation: 0}]} >
        {this.props.image}
        <View style={styles.fullscreen} >
          {this.props.hideInterface !== true && this.props.hideTopBar !== true ? <View style={{width:screenWidth,height:topBarHeight}} /> : undefined}
          <View style={{flex:1}}>
            {this.props.children}
          </View>
          {this.props.hideInterface !== true && this.props.hideTabBar !== true ? <View style={{width: screenWidth,height:tabBarHeight}} /> : undefined}
        </View>
      </View>
    );
  }
}