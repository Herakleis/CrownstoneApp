import * as React from 'react'; import { Component } from 'react';
import {
  Dimensions,
  View
} from 'react-native';

import { styles, colors, screenWidth } from '../styles'


export class Separator extends Component<any, any> {
  render() {
    if (this.props.fullLength === true)
      return <View style={styles.separator} />;
    else {
      return (
        <View style={{backgroundColor:'#ffffff'}}>
          <View style={[styles.separator, {width:screenWidth-15, alignSelf:'flex-end'}]}/>
        </View>
      );
    }
  }
}
