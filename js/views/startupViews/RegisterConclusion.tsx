import * as React from 'react'; import { Component } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  TouchableHighlight,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Background } from './../components/Background'
const Actions = require('react-native-router-flux').Actions;
import loginStyles from './LoginStyles'
// let Animation = require('lottie-react-native');

export class RegisterConclusion extends Component<any, any> {
  animation : any;

  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
      progress2: new Animated.Value(0),
    };
  }

  // componentDidMount() {
  //   this.animation.play();
  // }

  render() {
    return (
      <Background hideInterface={true} image={this.props.backgrounds.mainDark}>
        <View style={{flex:1}} />
        {/*<View style={{flex:1, justifyContent:'center', alignItems:'center', position:'relative', left:15, top:120}} >*/}
          {/*<Animation*/}
            {/*ref={animation => { this.animation = animation; }}*/}
            {/*style={{*/}
              {/*width: 400,*/}
              {/*height: 400,*/}
            {/*}}*/}
            {/*loop={true}*/}
            {/*source={require('../../animations/crownstoneAnimatedLogo.json')}*/}
          {/*/>*/}
        {/*</View>*/}
        <View style={style.viewContainer}>
          <Text style={style.text}>An email has been sent to:</Text>
        </View>
        <View style={[style.viewContainer]}>
          <Text style={[style.text, {fontSize:21, fontWeight:'500'}]}>{this.props.email}</Text>
        </View>
        <View style={[style.viewContainer]}>
          <Text style={style.text}>{
            this.props.passwordReset ?
              'Please click the link in the email and follow the instructions to reset your password.' :
              'After you click the validation link in the email, you can login to the app using your email address.'
          }
          </Text>
          <Text style={style.smallText}>{
            'It can take up to a minute for the email to be received. Make sure you check your spam folder as well.'
          }
          </Text>

        </View>
        <View style={{alignItems:'center', justifyContent:'center', paddingBottom: 30}}>
          <TouchableOpacity onPress={ () => { (Actions as any).login() }}>
            <View style={loginStyles.loginButton}><Text style={loginStyles.loginText}>OK</Text></View>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }
}

let style = StyleSheet.create({
  viewContainer: {
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
    paddingLeft:15,
    paddingRight:15,
    padding:10
  },
  text: {
    textAlign:'center',
    color: '#fff',
    fontSize: 18
  },
  smallText: {
    paddingTop:15,
    textAlign:'center',
    color: '#fff',
    fontSize: 13
  }
});
