import * as React from 'react'; import { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from 'react-native';

import { Icon }               from '../components/Icon'
import { getUserLevelInSphere, requireMoreFingerprints, enoughCrownstonesInLocationsForIndoorLocalization } from '../../util/DataUtil'
import { LOG }      from '../../logging/Log'
import { overviewStyles }     from './SphereOverview'
import { styles, colors, screenWidth, screenHeight, topBarHeight, tabBarHeight } from '../styles'


export class StatusCommunication extends Component<any, any> {
  unsubscribeStoreEvents : any;
  unsubscribeSetupEvents : any;

  componentDidMount() {
    // watch for setup stones
    this.unsubscribeSetupEvents = [];
    this.unsubscribeSetupEvents.push(this.props.eventBus.on("setupStonesDetected",  () => { this.forceUpdate(); }));

    // tell the component exactly when it should redraw
    this.unsubscribeStoreEvents = this.props.eventBus.on("databaseChange", (data) => {
      let change = data.change;
      if (
        (change.changeStoneState && change.changeStoneState.sphereIds[this.props.sphereId]) ||
        (change.stoneRssiUpdated && change.stoneRssiUpdated.sphereIds[this.props.sphereId])
      ) {
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeSetupEvents.forEach((unsubscribe) => {unsubscribe();});
    this.unsubscribeStoreEvents();
  }

  render() {
    const store = this.props.store;
    const state = store.getState();

    let currentSphere = this.props.sphereId;

    // the bottom distance pops the bottom text up if the orbs are shown. Orbs are shown when there are multiple spheres.
    let bottomDistance = Object.keys(state.spheres).length > 1 ? 20 : 5;
    let noRoomsCurrentSphere = (currentSphere ? Object.keys(state.spheres[currentSphere].locations).length : 0) == 0;
    let noStones = (currentSphere ? Object.keys(state.spheres[currentSphere].stones).length : 0) == 0;
    let isAdminInCurrentSphere = getUserLevelInSphere(state, currentSphere) === 'admin';

    let enoughForLocalization = enoughCrownstonesInLocationsForIndoorLocalization(state, currentSphere);
    let requiresFingerprints = requireMoreFingerprints(state, currentSphere);

    let stones = state.spheres[this.props.sphereId].stones;
    let stoneIds = Object.keys(stones);
    let amountOfVisible = 0;
    stoneIds.forEach((stoneId) => {
      if (stones[stoneId].config.rssi > -100 && stones[stoneId].config.disabled === false) {
        amountOfVisible += 1;
      }
    });

    if (this.props.seeStonesInSetupMode === true && isAdminInCurrentSphere === true) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[overviewStyles.bottomText, {bottom: bottomDistance} ]}>{'New Crownstone Detected! Tap on it!'}</Text>
        </View>
      );
    }
    else if (noStones === true && noRoomsCurrentSphere == true) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="c2-pluginFront" size={150} color={colors.blue.hex}/>
          <Text style={overviewStyles.mainText}>No Crownstones Added.</Text>
          <Text style={overviewStyles.subText}>Get close to a Crownstone and wait for it to appear! If it does not appear, try the recovery procedure in the settings.</Text>
        </View>
      );
    }
    else if (this.props.viewingRemotely === true) {
      return (
        <View style={{flex:1}}>
          <Text style={[overviewStyles.bottomText, {color:colors.darkGreen.hex, bottom: bottomDistance} ]}>{'No Crownstones in range.'}</Text>
        </View>
      );
    }
    else if (amountOfVisible >= 3 && enoughForLocalization && !requiresFingerprints) {
      return (
        <View style={[inRangeStyle, {bottom: bottomDistance}]}>
          <Text style={descriptionTextStyle}>{'I see ' + amountOfVisible}</Text>
          <Icon name="c2-crownstone" size={20} color={colors.darkGreen.hex} style={{position:'relative', top:3, width:20, height:20}} />
          <Text style={descriptionTextStyle}>{' so the indoor localization is running.'}</Text>
        </View>
      )
    }
    else if (amountOfVisible > 0 && enoughForLocalization && !requiresFingerprints) {
      return (
        <View style={[inRangeStyle, {bottom: bottomDistance}]}>
          <Text style={descriptionTextStyle}>{'I see only ' + amountOfVisible}</Text>
          <Icon name="c2-crownstone" size={20} color={colors.darkGreen.hex} style={{position:'relative', top:3, width:20, height:20}} />
          <Text style={descriptionTextStyle}>{' so I paused the indoor localization.'}</Text>
        </View>
      )
    }
    else if (enoughForLocalization && requiresFingerprints) {
      return (
        <View style={[inRangeStyle, {bottom: bottomDistance}]}>
          <Text style={[descriptionTextStyle,{textAlign: 'center'}]}>{'Not all rooms have been trained so I can\'t do indoor localization.'}</Text>
        </View>
      )
    }
    else if (amountOfVisible > 0) {
      return (
        <View style={[inRangeStyle, {bottom: bottomDistance}]}>
          <Text style={{backgroundColor:'transparent', color: colors.darkGreen.hex, fontSize:12, padding:3}}>{'I can see ' + amountOfVisible}</Text>
          <Icon name="c2-crownstone" size={20} color={colors.darkGreen.hex} style={{position:'relative', top:3, width:20, height:20}} />
        </View>
      )
    }
    else { //if (amountOfVisible === 0) {
      return (
        <View style={[inRangeStyle, {bottom: bottomDistance}]}>
          <Text style={{backgroundColor:'transparent', color: colors.darkGreen.hex, fontSize:12, padding:3}}>{"I can't see any Crownstones!"}</Text>
        </View>
      )
    }
  }

}

let inRangeStyle = {position: 'absolute',
  flexDirection:'row',
  width: screenWidth,
  backgroundColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 15,
  paddingBottom: 0
};

let descriptionTextStyle = {
  backgroundColor:'transparent',
  color: colors.darkGreen.hex,
  fontSize:12,
  padding:3
};
