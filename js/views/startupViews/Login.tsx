import * as React from 'react'; import { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Text,
  View
} from 'react-native';
const Actions = require('react-native-router-flux').Actions;
const sha1    = require('sha-1');
const RNFS    = require('react-native-fs');
import { LOG }                                from '../../logging/Log'
import { SessionMemory }                      from './SessionMemory'
import { emailChecker, getImageFileFromUser } from '../../util/Util'
import { CLOUD }                              from '../../cloud/cloudAPI'
import { TopBar }                             from '../components/Topbar';
import { TextEditInput }                      from '../components/editComponents/TextEditInput'
import { Background }                         from '../components/Background'
import { StoreManager }                       from '../../router/store/storeManager'
import loginStyles                            from './LoginStyles'
import { styles, colors , screenWidth, screenHeight } from '../styles'


export class Login extends Component<any, any> {
  progress : number;

  constructor() {
    super();
    this.state = {email: SessionMemory.loginEmail || '', password:''};
    this.progress = 0;
  }

  resetPopup() {
    if (emailChecker(this.state.email) === false) {
      Alert.alert('Check Email Address','Please input a valid email address in the form and press the Forgot Password button again.',[
        {text: 'OK'}
      ]);
    }
    else {
      Alert.alert('Send Password Reset Email','Would you like us to send an email to reset your password to: ' + this.state.email.toLowerCase() + '?',[
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => {this.requestPasswordResetEmail()}}
      ]);
    }
  }

  requestVerificationEmail() {
    this.props.eventBus.emit('showLoading', 'Requesting new verification email...');
    CLOUD.requestVerificationEmail({email:this.state.email.toLowerCase()})
      .then(() => {
        SessionMemory.loginEmail = this.state.email.toLowerCase();
        this.props.eventBus.emit('hideLoading');
        (Actions as any).registerConclusion({type:'reset', email:this.state.email.toLowerCase(), title: 'Verification Email Sent'});
      })
      .catch((reply) => {
        Alert.alert("Cannot Send Email", reply.data, [{text: 'OK', onPress: () => {this.props.eventBus.emit('hideLoading')}}]);
      });
  }

  requestPasswordResetEmail() {
    this.props.eventBus.emit('showLoading', 'Requesting password reset email...');
    CLOUD.requestPasswordResetEmail({email:this.state.email.toLowerCase()})
      .then(() => {
        SessionMemory.loginEmail = this.state.email.toLowerCase();
        this.props.eventBus.emit('hideLoading');
        (Actions as any).registerConclusion({type:'reset', email:this.state.email.toLowerCase(), title: 'Reset Email Sent', passwordReset:true});
      })
      .catch((reply) => {
        let content = "Please try again.";
        let title = "Cannot Send Email";
        if (reply.data && reply.data.error) {
          if (reply.data.error.code == "EMAIL_NOT_FOUND") {
            content = "This email is not registered in the Cloud. Please register to create an account.";
            title = "Unknown Email";
          }
        }
        Alert.alert(title, content, [{text: 'OK', onPress: () => {this.props.eventBus.emit('hideLoading')}}]);
      });
  }

  attemptLogin() {
    if (this.state.email === '' || this.state.password === '') {
      Alert.alert('Almost there!','Please input your email and password.', [{text: 'OK'}]);
      return;
    }

    this.props.eventBus.emit('showLoading', 'Logging in...');
    let unverifiedEmailCallback = () => {
      Alert.alert('Your email address has not been verified', 'Please click on the link in the email that was sent to you. If you did not receive an email, press Resend Email to try again.', [
        {text: 'Resend Email', onPress: () => this.requestVerificationEmail()},
        {text: 'OK', onPress: () => {this.props.eventBus.emit('hideLoading')}}
      ]);
    };
    let invalidLoginCallback = () => {
      Alert.alert('Incorrect Email or Password.','Could not log in.',[{text: 'OK', onPress: () => {this.props.eventBus.emit('hideLoading')}}]);
    };

    CLOUD.login({
      email: this.state.email.toLowerCase(),
      password: sha1(this.state.password),
      onUnverified: unverifiedEmailCallback,
      onInvalidCredentials: invalidLoginCallback,
    })
      .then((response) => {
        return new Promise((resolve, reject) => {
        // start the login process from the store manager.
        StoreManager.userLogIn(response.userId)
          .then(() => {
            resolve(response);
          }).catch((err) => {reject(err)})
        })
      })
      .catch((err) => {
        // do not show a popup if it is a failed request: this has its own pop up
        if (err.message && err.message === 'Network request failed') {
          this.props.eventBus.emit('hideLoading');
        }
        else {
          Alert.alert(
            "Connection Problem",
            "Could not connect to the Cloud. Please check your internet connection.",
            [{text:'OK', onPress: () => { this.props.eventBus.emit('hideLoading'); }}]
          );
        }
        return false;
      })
      .done((response) => {
        if (response === false) {return;}
        this.finalizeLogin(response.id, response.userId);
      })
  }

  render() {
    return (
      <Background hideInterface={true} image={this.props.backgrounds.mainDarkLogo}>
        <TopBar leftStyle={{color:'#fff'}} left={Platform.OS === 'android' ? null : 'Back'} leftAction={() => {Actions.loginSplash({type:'reset'})}} style={{backgroundColor:'transparent'}} shadeStatus={true} />
        <View style={loginStyles.spacer}>
          <View style={[loginStyles.textBoxView, {width: 0.8*screenWidth}]}>
            <TextEditInput
              optimization={false}
              style={{width: 0.8*screenWidth, padding:10}}
              placeholder='email'
              keyboardType='email-address'
              autocorrect={false}
              autoCapitalize="none"
              placeholderTextColor='#888'
              value={this.state.email}
              callback={(newValue) => { this.setState({email:newValue});}}
            />
          </View>
          <View style={[loginStyles.textBoxView, {width: 0.8*screenWidth}]}>
            <TextEditInput
              optimization={false}
              style={{width: 0.8*screenWidth, padding:10}}
              secureTextEntry={true}
              placeholder='password'
              placeholderTextColor='#888'
              value={this.state.password}
              callback={(newValue) => { this.setState({password:newValue});}}
            />
          </View>
          <TouchableHighlight style={{borderRadius:20, height:40, width:screenWidth*0.6, justifyContent:'center', alignItems:'center'}} onPress={this.resetPopup.bind(this)}><Text style={loginStyles.forgot}>Forgot Password?</Text></TouchableHighlight>
          <LoginButton loginCallback={() => {this.attemptLogin()}} />
        </View>
      </Background>
    )
  }
  
  checkForRegistrationPictureUpload(userId, filename) {
    return new Promise((resolve, reject) => {
      let uploadingImage = false;
      
      let handleFiles = (files) => {
        files.forEach((file) => {
          // if the file belongs to this user, we want to upload it to the cloud.
          if (file.name === filename) {
            uploadingImage = true;
            let newPath = RNFS.DocumentDirectoryPath + '/' + userId + '.jpg';
            CLOUD.forUser(userId).uploadProfileImage(file)
              .then(() => {return RNFS.moveFile(file.path, newPath);})
              .then(() => {resolve(newPath);})
          }
        });
        if (uploadingImage === false) {
          resolve(null);
        }
      };

      // read the document dir for files that have been created during the registration process
      RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then(handleFiles)
    });
  }


  downloadImage(userId) {
    let toPath = RNFS.DocumentDirectoryPath + '/' + userId + '.jpg';
    return CLOUD.forUser(userId).downloadProfileImage(toPath);
  }

  finalizeLogin(accessToken, userId) {
    this.progress = 0;
    this.props.eventBus.emit('showProgress', {progress: 0, progressText:'Getting user data.'});

    // give the access token and the userId to the cloud api 
    CLOUD.setAccess(accessToken);
    CLOUD.setUserId(userId);

    // load the user into the database
    const store = this.props.store;
    store.dispatch({
      type:'USER_LOG_IN',
      data:{
        email:        this.state.email.toLowerCase(),
        passwordHash: sha1(this.state.password),
        accessToken:  accessToken,
        userId:       userId,
      }
    });
    
    this.downloadSettings(store, userId);
  }
  
  downloadSettings(store, userId) {
    let parts = 1/5;

    let promises = [];

    // get more data on the user
    promises.push(
      CLOUD.forUser(userId).getUserData()
        .then((userData) => {
          store.dispatch({type:'USER_APPEND', data:{firstName: userData.firstName,lastName: userData.lastName, isNew: userData.new}});
          this.progress += parts;
          this.props.eventBus.emit('updateProgress', {progress: this.progress, progressText:'Received user data.'});
        })
    );

    // check if we need to upload a picture that has been set aside during the registration process.
    let imageFilename = getImageFileFromUser(this.state.email.toLowerCase());
    promises.push(this.checkForRegistrationPictureUpload(userId, imageFilename)
      .then((picturePath) => {
        if (picturePath === null)
          return this.downloadImage(userId); // check if there is a picture we can download
        else
          return picturePath;
      })
      .then((picturePath) => {
        store.dispatch({type:'USER_APPEND', data:{picture: picturePath}});
        this.progress += parts;
        this.props.eventBus.emit('updateProgress', {progress: this.progress, progressText:'Handle profile picture.'});
      })
      .catch((err) => {
        // likely a 404, ignore
        LOG.debug("Could be a problem downloading profile picture: ", err);
      })
      .then(() => {
        this.progress += parts;
        this.props.eventBus.emit('updateProgress', {progress: this.progress, progressText:'Syncing with the Cloud.'});
        return CLOUD.sync(store, false);
      })
      .then(() => {
        this.progress += parts;
        this.props.eventBus.emit('updateProgress', {progress: this.progress, progressText:'Syncing with the Cloud.'});
        let state = store.getState();
        if (Object.keys(state.spheres).length == 0 && state.user.isNew !== false) {
          this.props.eventBus.emit('updateProgress', {progress: this.progress, progressText:'Creating first Sphere.'});
          // TODO: place in tutorial
          return CLOUD.createNewSphere(store, state.user.firstName, this.props.eventBus);
        }
        else {
          this.props.eventBus.emit('updateProgress', {progress: this.progress, progressText:'Sphere available.'});
        }
      })
      .catch((err) => {
        LOG.debug("Error creating first Sphere.", err);
        Alert.alert("Whoops!", "An error has occurred while syncing with the Cloud. Please try again later.", [{text:'OK', onPress: () => {this.props.eventBus.emit('hideProgress');}}]);
        throw err;
      })
    );


    Promise.all(promises)
      .then(() => {
        this.props.eventBus.emit('updateProgress', {progress: 1, progressText:'Done'});

        // finalize the login due to successful download of data. Enables persistence.
        StoreManager.finalizeLogIn(userId);

        // this starts scanning, tracking spheres and prepping the database for the user
        this.props.eventBus.emit("userLoggedIn");

        // set a small delay so the user sees "done"
        setTimeout(() => {
          let state = store.getState();
          this.props.eventBus.emit('hideProgress');


          if (state.user.isNew !== false) {
            (Actions as any).aiStart({type: 'reset'});
          }
          else if (Platform.OS === 'android') {
            (Actions as any).sphereOverview({type: 'reset'});
          }
          else {
            (Actions as any).tabBar({type: 'reset'});
          }
        }, 100);
      })
      .catch((err) => {
        LOG.error("ERROR during login.", err);
      });
  }
}



class LoginButton extends Component<any, any> {
  render() {
    if (screenHeight > 480) {
      return (
        <View style={loginStyles.loginButtonContainer}>
          <TouchableOpacity onPress={() => { this.props.loginCallback() }}>
            <View style={loginStyles.loginButton}><Text style={loginStyles.loginText}>Log In</Text></View>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        <View style={{
          position:'absolute',
          bottom:20,
          flex:1,
          width: screenWidth,
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:'transparent'
        }}>
          <TouchableOpacity onPress={() => { this.props.loginCallback() }}>
            <View style={{
              backgroundColor:'transparent',
              height: 60,
              width:  0.6*screenWidth,
              borderRadius: 30,
              borderWidth:2,
              borderColor:'white',
              alignItems:'center',
              justifyContent:'center',
              margin: (screenWidth - 2*110) / 6,
              marginBottom:0}}>
              <Text style={{
                color:'white',
                fontSize:18,
                fontWeight:'300'
              }}>Log In</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

