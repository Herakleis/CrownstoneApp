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

import { validateEmail, getImageFileFromUser, APPERROR } from '../../util/util'
import { CLOUD } from '../../util/cloud'
import { TopBar } from '../components/Topbar';
import { Processing } from '../components/Processing'
import { TextEditInput } from '../components/editComponents/TextEditInput'
import { Background } from '../components/Background'
import RNFS from 'react-native-fs'
import loginStyles from './LoginStyles'



export class Login extends Component {
  constructor() {
    super();
    // this.state = {email:'alex@dobots.nl', password:'letmein0', processing:false, processingText:'Logging in...'};
    this.state = {email:'alexdemulder@gmail.com', password:'letmein0', processing:false, processingText:'Logging in...'};
    this.closePopupCallback = () => {this.setState({processing:false})};
  }

  resetPopup() {
    if (validateEmail(this.state.email) === false) {
      Alert.alert('Check Email Address','Please input a valid email address in the form and press the Forgot Password button again.',[
        {text: 'OK'}
      ]);
    }
    else {
      Alert.alert('Send Password Reset Email','Would you like us to send an email to reset your password to: ' + this.state.email.toLowerCase() + '?',[
        {text: 'Cancel'},
        {text: 'OK',     onPress: () => {this.requestPasswordResetEmail()}}
      ]);
    }
  }

  requestVerificationEmail() {
    this.setState({processing:true, processingText:'Requesting new verification email...'});
    let successCallback = () => { Actions.registerConclusion({type:'reset', email:this.state.email.toLowerCase(), title: 'Verification Email Sent'}) };
    let errorHandleCallback = (response) => {
      Alert.alert('Cannot Resend Confirmation.',response.error.message,[{text: 'OK', onPress: this.closePopupCallback}]);
    };

    let data = { email: this.state.email.toLowerCase() };
    CLOUD.post({ endPoint:'users/resendVerification', data, type:'query'}, successCallback, errorHandleCallback, this.closePopupCallback);
  }

  requestPasswordResetEmail() {
    this.setState({processing:true, processingText:'Requesting password reset email...'});
    let successCallback = () => {
      Actions.registerConclusion({type:'reset', email:this.state.email.toLowerCase(), title: 'Reset Email Sent', passwordReset:true})
    };
    let errorHandleCallback = (response) => {
      Alert.alert('Cannot Send Reset Email.',response.error.message,[{text: 'OK', onPress: this.closePopupCallback}]);
    };

    let data = { email: this.state.email.toLowerCase() };
    CLOUD.post({endPoint:'users/reset', data, type:'body'}, successCallback, errorHandleCallback, this.closePopupCallback);
  }

  attemptLogin() {
    this.setState({processing:true, processingText:'Logging in...'});
    let successCallback = (response) => {this.finalizeLogin(response.id, response.userId)};
    let errorHandleCallback = (response) => {
      switch (response.error.code) {
        case "LOGIN_FAILED_EMAIL_NOT_VERIFIED":
          Alert.alert('Your email address has not been verified','Please click on the link in the email that was sent to you. If you did not receive an email, press Resend Email to try again.',[
            {text: 'Resend Email', onPress: () => this.requestVerificationEmail()},
            {text: 'OK', onPress: this.closePopupCallback}
          ]);
          break;
        case "LOGIN_FAILED":
          Alert.alert('Incorrect Email or Password.','Could not log in.',[{text: 'OK', onPress: this.closePopupCallback}]);
          break;
        default:
          Alert.alert('Login Error',response.error.message,[{text: 'OK', onPress: this.closePopupCallback}]);
      }
    };
    let data = { email: this.state.email.toLowerCase(), password: this.state.password };
    CLOUD.post({endPoint:'users/login', data, type:'body'}, successCallback, errorHandleCallback, this.closePopupCallback);
  }

  render() {
    let width = Dimensions.get('window').width;
    return (
      <Background hideInterface={true} background={require('../../images/loginBackground.png')}>
        <TopBar left="Back" leftAction={Actions.pop} style={{backgroundColor:'transparent'}} shadeStatus={true} />
        <View style={loginStyles.spacer}>
          <View style={[loginStyles.textBoxView, {width: 0.8*width}]}>
            <TextEditInput style={{flex:1, padding:10}} placeholder="email" placeholderTextColor="#888" value={this.state.email} callback={(newValue) => {this.setState({email:newValue});}} />
          </View>
          <View style={[loginStyles.textBoxView, {width: 0.8*width}]}>
            <TextEditInput style={{flex:1, padding:10}} secureTextEntry={true} placeholder="password" placeholderTextColor="#888" value={this.state.password} callback={(newValue) => {this.setState({password:newValue});}} />
          </View>
          <TouchableHighlight style={{borderRadius:20, height:40, width:width*0.6, justifyContent:'center', alignItems:'center'}} onPress={this.resetPopup.bind(this)}><Text style={loginStyles.forgot}>Forgot Password?</Text></TouchableHighlight>
          <View style={loginStyles.loginButtonContainer}>
            <TouchableOpacity onPress={this.attemptLogin.bind(this)}>
              <View style={loginStyles.loginButton}><Text style={loginStyles.loginText}>Log In</Text></View>
            </TouchableOpacity>
          </View>
        </View>
        <Processing visible={this.state.processing} text={this.state.processingText} />
      </Background>
    )
  }
  
  checkForRegistrationPictureUpload(userId) {
    return new Promise((resolve, reject) => {
      let uploadingImage = false;
      
      let handleFiles = (files) => {
        files.forEach((file) => {
          // if the file belongs to this user, we want to upload it to the cloud.
          if (file.name === getImageFileFromUser(this.state.email)) {
            uploadingImage = true;
            let newPath = RNFS.DocumentDirectoryPath + '/' + userId + '.jpg';
            CLOUD.forUser(userId).uploadImage({endPoint:'/users/{id}/profilePic', ...file, type:'body'})
              .then(() => {return RNFS.moveFile(file.path, newPath);})
              .then(() => {resolve(newPath);})
              .catch(APPERROR);
          }
        });
        if (uploadingImage === false) {
          resolve(null);
        }
      };

      // read the document dir for files that have been created during the registration process
      RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then(handleFiles)
        .catch(APPERROR);
    });
  }

  getUserData(userId) {
    return new Promise((resolve, reject) => {
      CLOUD.forUser(userId).get({endPoint:'/users/me'}, resolve, reject)
    })
  }

  downloadImage(userId) {
    let path = RNFS.DocumentDirectoryPath + '/' + userId + '.jpg';
    return CLOUD.forUser(userId).download({endPoint:'/users/{id}/profilePic'}, path);
  }

  finalizeLogin(accessToken, userId) {
    // give the access token to the cloud api
    CLOUD.setAccess(accessToken);

    // load the user into the database
    const store = this.props.store;
    store.dispatch({
      type:'USER_LOG_IN',
      data:{
        email:this.state.email.toLowerCase(),
        accessToken:accessToken,
        userId:userId
      }
    });

    // get more data on the user
    this.getUserData(userId).then((userData) => {
      store.dispatch({
        type:'USER_APPEND',
        data:{
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      });
    });

    // function to store the path to the picture. Can be null or path.
    let storeProfilePicture = (picturePath) => {
      store.dispatch({
        type:'USER_APPEND',
        data:{
          picture: picturePath,
        }
      });
    };

    // check if we need to upload a picture that has been set aside during the registration process.
    this.checkForRegistrationPictureUpload(userId)
      .then((picturePath) => {
        if (picturePath === null) {
          // check if there is a picture we can download
          this.downloadImage(userId).then((picturePath) => {
            storeProfilePicture(picturePath);
          });
        }
        else {
          storeProfilePicture(picturePath);
        }
      });

    // continue to the main part of the app while the images are being handled in the background.
    Actions.tabBar();
  }
}

let transparent = {backgroundColor:'transparent'};
