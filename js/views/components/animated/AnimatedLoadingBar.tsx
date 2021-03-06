import * as React from 'react'; import { Component } from 'react';
import {
  Animated,
  Image,
  Text,
  View,
} from 'react-native';

import { styles, colors, screenWidth, screenHeight} from '../../styles'


/**
 * expects a progress prop [0 .. 1]
 */
export class AnimatedLoadingBar extends Component<any, any> {
  width : number;
  barHeight : number;
  borderWidth : number;
  progressTarget : any;

  constructor(props) {
    super();
    this.width = props.width || screenWidth * 0.6;
    this.barHeight = props.height || 30;
    this.borderWidth = 3;
    this.progressTarget = props.progress;
    this.state = { progress: new Animated.Value(props.progress || 0) };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.progress) {
      let innerWidth = this.width - 2 * this.borderWidth;
      if (nextProps.progress !== this.progressTarget) {
        Animated.spring(this.state.progress, {
          toValue: innerWidth * nextProps.progress,
          friction: 4,
          tension: 40
        }).start();
        this.progressTarget = nextProps.progress;
      }
    }
  }

  render() {
    let innerWidth = this.width - 2 * this.borderWidth;
    let innerHeight = this.barHeight - 2 * this.borderWidth;

    return (
      <View style={{width:this.width, overflow:'hidden', alignItems:'center', justifyContent:'center', height:this.barHeight, borderRadius: 18, margin:20, backgroundColor:'#fff'}}>
        <View style={{width:innerWidth, height:innerHeight, borderRadius: 15, margin:0, backgroundColor:colors.menuBackground.hex, overflow:'hidden', alignItems:'flex-start', justifyContent:'center'}}>
          <Animated.View style={{width:this.state.progress, height: innerHeight, backgroundColor:colors.blue.hex, borderRadius:0.5*innerHeight}} />
        </View>
      </View>
    );
  }
}