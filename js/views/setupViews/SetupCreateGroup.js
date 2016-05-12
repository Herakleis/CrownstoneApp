import React, {
  Alert,
  Component,
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Text,
  View
} from 'react-native';
var Actions = require('react-native-router-flux').Actions;

import { CLOUD } from '../../cloud/cloudAPI'
import { TextEditInput } from '../components/editComponents/TextEditInput'
import { Background } from '../components/Background'
import { setupStyle } from './SetupStyles'
import { styles, colors } from './../styles'

let {width, height} = Dimensions.get("window");

export class SetupCreateGroup extends Component {
  constructor() {
    super();
    this.state = {groupName:'', processing:false, processingText:'Setting up Group...'}
  }

  saveGroupName() {
    if (this.state.groupName.length > 3) {
      this.props.eventBus.emit('showLoading', 'Creating Group...');
      CLOUD.createGroup(this.state.groupName)
        .then((response) => {
          this.props.eventBus.emit('hideLoading');
          console.log("response", response)
        })
    }
    else {
      Alert.alert("Please provide a valid Group name.", "At least 3 characters", [{type:'OK'}])
    }
  }

  render() {
    return (
      <Background hideInterface={true} background={require('../../images/setupBackground.png')}>
        <View style={styles.shadedStatusBar} />
        <View style={{flex:1, flexDirection:'column'}}>
          <Text style={setupStyle.header}>Group Setup</Text>
          <Text style={[setupStyle.text, {paddingTop:0}]}>A Group is a place like "Home", or "Office" where you use your Crownstones.</Text>
          <Text style={setupStyle.information}>You can invite other people to join this group so they can use your Crownstones too.</Text>
          <Text style={setupStyle.information}>You can use permission levels to determine how much control invited people have in your Group.</Text>
          <Text style={setupStyle.information}>Choose a name for your Group:</Text>

          <View style={[setupStyle.textBoxView,{marginTop:20, backgroundColor:'transparent'}]}>
            <View style={[setupStyle.textBoxView, {width: 0.8*width}]}>
              <TextEditInput style={{flex:1, padding:10}} placeholder="Group name" placeholderTextColor="#888" value={this.state.groupName} callback={(newValue) => {this.setState({groupName:newValue});}} />
            </View>
          </View>
        </View>

          <View style={setupStyle.buttonContainer}>
            <TouchableOpacity onPress={this.saveGroupName.bind(this)}>
              <View style={[setupStyle.button, {height:100, width:100, borderRadius:50}]}><Text style={setupStyle.buttonText}>Next</Text></View>
            </TouchableOpacity>
        </View>
        <Processing visible={this.state.processing} text={this.state.processingText} />
      </Background>
    )
  }
}

