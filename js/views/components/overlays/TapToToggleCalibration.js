import React, { Component } from 'react'
import {
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { NativeBus }          from '../../../native/Proxy'
import { IconButton }         from '../IconButton'
import { BleUtil }            from '../../../native/BleUtil'
import { addDistanceToRssi }  from '../../../util/util'
import { OverlayBox }         from './OverlayBox'
import { eventBus }                                   from '../../../util/eventBus'
import { styles, colors , screenHeight, screenWidth } from '../../styles'

export class TapToToggleCalibration extends Component {
  constructor() {
    super();

    this.state = { visible: true, step:0 };
    this.unsubscribe = [];
  }

  componentDidMount() {
    eventBus.on("CalibrateTapToToggle", () => {
      this.setState({visible: true, step:0});
    })
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((callback) => {callback()});
    this.unsubscribe = [];
  }


  learnDistance() {
    // show loading screen
    eventBus.emit("showLoading", "Learning Tap-to-Toggle distance...");

    // make sure we don't strangely trigger stuff while doing this.
    eventBus.emit("ignoreTriggers");

    BleUtil.getNearestCrownstone(5000)
      .then((nearestItem) => {
        if (nearestItem.rssi > -70) {
          this.props.store.dispatch({
            type: 'SET_TAP_TO_TOGGLE_CALIBRATION',
            data: { tapToToggleCalibration: addDistanceToRssi(nearestItem.rssi, 0.1) }
          });
          eventBus.emit("showLoading", "Great!");
          setTimeout(() => {
            eventBus.emit("hideLoading");
          }, 500);
          this.setState({step:2});
        }
        else {
          eventBus.emit("hideLoading");
          Alert.alert("That's a bit far away.", "Try to hold your phone really close to the Plug and press OK!", [{text:'OK', onPress:() => {this.learnDistance()}}])
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getContent() {
    let props = {};
    switch(this.state.step) {
      case 0:
        eventBus.emit("ignoreTriggers");
        props = {
          title: 'Using Tap-to-Toggle',
          image: require('../../../images/lineDrawings/holdingPhoneNextToPlugDarkBlank.png'),
          header: "Now that you've added a Crownstone Plug, you can use tap-to-toggle!",
          explanation: "Tap-to-toggle means you can switch a Plug just by holding your phone really close to it!",
          back: false,
          nextCallback: () => {this.setState({step:1});},
          nextLabel: 'Next'
        };
        break;
      case 1:
        props = {
          title: 'Setting it up',
          image: require('../../../images/lineDrawings/holdingPhoneNextToPlugDarkBlank.png'),
          header: "In order to use tap-to-toggle, you need to help it a little.",
          explanation: "This will only take a minute and will only have to be done once. Hold your phone really close to a Plug and press 'Next'.",
          back: true,
          backCallback: () => {this.setState({step:0});},
          nextCallback: () => {this.learnDistance()},
          nextLabel: 'Next'
        };
        break;
      case 2:
        props = {
          title: "Great!",
          image: require('../../../images/lineDrawings/holdingPhoneNextToPlugDarkToggle.png'),
          header: "Now that I can recognise it with your phone, let's try tap-to-toggle!",
          explanation: "After you click 'Next' I'll enable tap-to-toggle and you can try it out! You can recalibrate your tap-to-toggle in the settings.",
          back: true,
          backCallback: () => {this.setState({step:1});},
          nextCallback: () => {eventBus.emit("useTriggers"); this.setState({step:3})},
          nextLabel: 'Next'
        };
        break;
      case 3:
        props = {
          title: "Let's give it a try!",
          image: require('../../../images/lineDrawings/holdingPhoneNextToPlugDarkToggle.png'),
          header: "Touch your phone to the Plug to trigger tap-to-toggle!",
          explanation: "Once the phone vibrates, it will start to toggle the Plug.",
          back: true,
          backCallback: () => {this.setState({step:1});},
          nextCallback: () => {this.setState({visible: false});},
          nextLabel: 'Finish!'
        };
        break;

    }

    return (
      <View style={{flex:1, alignItems:'center'}}>
        <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.csBlue.hex, padding:15}}>{props.title}</Text>
        <Image source={props.image} style={{width:0.45*screenWidth, height:0.45*screenWidth, margin:0.025*screenHeight}}/>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: colors.csBlue.hex, textAlign:'center'}}>{props.header}</Text>
        <Text style={{fontSize: 14, color: colors.blue.hex, textAlign:'center', marginTop:15}}>{props.explanation}</Text>
        <View style={{flex:1}}/>

        {props.back ?
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={props.backCallback} style={[styles.centered, {
              width: 0.3 * screenWidth,
              height: 36,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: colors.blue.rgba(0.2),
              marginBottom: 10
            }]}>
              <Text style={{fontSize: 14, color: colors.blue.rgba(0.6)}}>Back</Text>
            </TouchableOpacity>
            <View style={{flex: 1}}/>
            <TouchableOpacity onPress={props.nextCallback} style={[styles.centered, {
              width: 0.3 * screenWidth,
              height: 36,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: colors.blue.rgba(0.5),
              marginBottom: 10
            }]}>
              <Text style={{fontSize: 14, color: colors.blue.hex}}>{props.nextLabel}</Text>
            </TouchableOpacity>
          </View>
          :
          <TouchableOpacity onPress={props.nextCallback} style={[styles.centered, {
            width: 0.4 * screenWidth,
            height: 36,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: colors.blue.rgba(0.5),
            marginBottom: 10
          }]}>
            <Text style={{fontSize: 14, color: colors.blue.hex}}>{props.nextLabel}</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }


  render() {
    return (
      <OverlayBox visible={this.state.visible}>
        {this.getContent()}
      </OverlayBox>
    );
  }
}