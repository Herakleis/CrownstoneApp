import * as React from 'react'; import { Component } from 'react';
import {
  
  TouchableOpacity,
  PixelRatio,
  ScrollView,
  Switch,
  TextInput,
  Text,
  View
} from 'react-native';
import { Background }        from '../components/Background'
import { ListEditableItems } from '../components/ListEditableItems'
import { EditSpacer }        from '../components/editComponents/EditSpacer'
let Actions = require('react-native-router-flux').Actions;

import { styles, colors} from '../styles'
import { LOG } from '../../logging/Log'

export class DeviceScheduleStateEdit extends Component<any, any> {
  unsubscribe : any;

  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() => {
      this.forceUpdate();
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  constructOptions(store, device) {
    //let requiredData = {sphereId: this.props.sphereId, locationId: this.props.locationId, stoneId: this.props.stoneId};
    //let currentBehaviour = device.behaviour[this.props.eventName];
    //let items = [];
    //
    //// behaviour explanation
    //if (device.config.dimmable === true) {
    //  //TODO: DIMMING CONTROL IS BROKEN, could be fixed by passing panHandlers in RN 0.23?
    //  items.push({label:"State", value: currentBehaviour.state, type: 'slider', callback:(newValue) => {
    //    store.dispatch({
    //      ...requiredData,
    //      type: 'UPDATE_BEHAVIOUR_FOR_' + this.props.eventName,
    //      data: {state: newValue}
    //    });
    //  }});
    //  items.push({label: 'When you ' + this._getExplanationLabel() + ', the light is dimmed to the level you specify here.', type: 'explanation', below: true});
    //}
    //else {
    //  items.push({label:"State", value: currentBehaviour.state === 1, type: 'switch', callback:(newValue) => {
    //    store.dispatch({
    //      ...requiredData,
    //      type: 'UPDATE_BEHAVIOUR_FOR_' + this.props.eventName,
    //      data: {state: newValue ? 1 : 0}
    //    });
    //  }});
    //  items.push({label:'The device will be switched to match the state when you ' + this._getExplanationLabel() + '.', type: 'explanation', below: true});
    //}
    //
    //
    //items.push({label:"Fading", value: this._getDelayLabel(currentBehaviour), valueStyle:styles.rightNavigationValue, type: 'navigation',  callback:() => {
    //  (Actions as any).delaySelection({
    //    ...requiredData,
    //    extractionMethod: (device) => {return device.behaviour[this.props.eventName].delay;},
    //    callback: (newValue) => {
    //      store.dispatch({
    //        ...requiredData,
    //        type: 'UPDATE_BEHAVIOUR_FOR_' + this.props.eventName,
    //        data: {delay: newValue}
    //      });
    //    }
    //  })
    //}});
    //items.push({label:'You can set a delay between when you ' + this._getExplanationLabel() + ' and when the device responds to it. If the device is switched by something before this delay has finished, the first event will be discarded.', type: 'explanation', below: true});
    //
    //return items;
  }

  render() {
    LOG.info("the schedule uses an old data model.");
    return <View />;
    // const store   = this.props.store;
    // const state   = store.getState();
    // const room    = state.spheres[this.props.sphereId].locations[this.props.locationId];
    // const device  = room.stones[this.props.stoneId];
    //
    // let options = this.constructOptions(store, device);
    // return (
    //   <Background image={this.props.backgrounds.menu} >
    //     <ScrollView>
    //       <EditSpacer top={true} />
    //       <ListEditableItems items={options}/>
    //     </ScrollView>
    //   </Background>
    // )
  }
}
