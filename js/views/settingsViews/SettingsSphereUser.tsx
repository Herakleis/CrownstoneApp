import * as React from 'react'; import { Component } from 'react';
import {
  Alert,
  Dimensions,
  TouchableHighlight,
  PixelRatio,
  ScrollView,
  Switch,
  Text,
  View
} from 'react-native';

import { Background } from './../components/Background'
import { ProfilePicture } from './../components/ProfilePicture'
import { ListEditableItems } from './../components/ListEditableItems'
import { CLOUD } from '../../cloud/cloudAPI'
import { getUserLevelInSphere } from '../../util/DataUtil'
import { styles, colors, screenWidth } from './../styles'
import {LOG} from "../../logging/Log";
const Actions = require('react-native-router-flux').Actions;

export class SettingsSphereUser extends Component<any, any> {
  deleting : boolean;
  unsubscribe : any;

  constructor() {
    super();
    this.deleting = false;
    this.unsubscribe = undefined;
  }

  componentDidMount() {
    const { store } = this.props;
    this.unsubscribe = store.subscribe(() => {
      if (this.deleting !== true) {
        this.forceUpdate();
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  _getItems(user) {
    const store = this.props.store;
    const state = store.getState();

    let levelInSphere = getUserLevelInSphere(state, this.props.sphereId);
    let availablePermissions = [{label:'Member'},{label:"Guest"}];
    if (levelInSphere === 'admin') {
      availablePermissions = [{label:"Admin"},{label:'Member'},{label:"Guest"}];
    }

    let items = [];
    // room Name:
    items.push({type:'spacer'});
    items.push({label:'User',  type: 'info', value: user.firstName + ' ' + user.lastName});
    items.push({label:'Email',  type: 'info', value: user.email});
    items.push({
      type:'dropdown',
      buttons: true,
      label:'Access Level',
      dropdownHeight:150,
      value: user.accessLevel[0].toUpperCase() + user.accessLevel.substring(1),
      items: availablePermissions,
      callback: (permission) => {
        permission = permission.toLowerCase();
        this.props.eventBus.emit('showLoading', 'Updating user permissions...');
        CLOUD.forSphere(this.props.sphereId).changeUserAccess(user.email, permission)
          .then((result) => {
            this.props.eventBus.emit('hideLoading');
            store.dispatch({type: 'UPDATE_SPHERE_USER', sphereId: this.props.sphereId, userId: this.props.userId, data:{accessLevel: permission}});
          })
          .catch((err) => {
            Alert.alert("Something went wrong", "Please try again later.", [{text:"OK"}]);
            this.props.eventBus.emit('hideLoading');
            LOG.error("Something went wrong during Updating user permissions.", err);
          })
        }
      }
    );

    items.push({type:'explanation', label:'REVOKE PERMISSIONS'});
    items.push({label:'Remove from Sphere', type:'button', callback: () => {
      Alert.alert(
        "Are you sure you want to remove this user from the sphere?",
        "User's permissions will be revoked the next time he/she logs into the app.",
      [{text:'No'}, {text:'Yes', onPress: () => {
        this.deleting = true;
        this.props.eventBus.emit('showLoading', 'Removing user from Sphere...');
        CLOUD.forSphere(this.props.sphereId).deleteUserFromSphere(this.props.userId)
          .then((result) => {
            Alert.alert("User has been removed!", "The next time the user logs into the app, the users' device will be removed.", [{text:"OK", onPress:() => {
              this.props.eventBus.emit('hideLoading');
              this.props.store.dispatch({
                type: 'REMOVE_SPHERE_USER',
                sphereId: this.props.sphereId,
                userId: this.props.userId,
              });
              Actions.pop();
            }}]);
          })
          .catch((err) => {
            this.deleting = false;
            this.props.eventBus.emit('hideLoading');
            Alert.alert("Something went wrong", "Please try again later.", [{text:"OK"}]);
            LOG.error("Something went wrong during Updating user permissions.", err);
          })

      }}])
    }});

    return items;
  }



  render() {
    const store = this.props.store;
    const state = store.getState();
    let user = state.spheres[this.props.sphereId].users[this.props.userId];

    return (
      <Background image={this.props.backgrounds.menu} >
        <ScrollView>
          <View style={{alignItems:'center', justifyContent:'center', width: screenWidth, paddingTop:40}}>
            <ProfilePicture
              value={user.picture}
              size={120}
            />
          </View>
          <ListEditableItems items={this._getItems(user)} separatorIndent={true} />
        </ScrollView>
      </Background>
    );
  }
}
