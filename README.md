# iOS & Android App for the Crownstone.

The Crownstone iOS and Android apps have the following functionality:

| Functionality                                   | State Firmware           | State Smartphone Apps     | 
| ---                                             | ---                      | ---                       |
| Switching                                       | Done                     | Done                      |
| Instantaneous power consumption                 | Done                     | Done                      |
| Reacting on close proximity (tap-to-toggle)     | Done                     | Done                      |
| Reacting on moderate proximity (presence)       | Done                     | Done                      |
| Reacting on room-level indoor positioning       | Done                     | Done                      |
| User-controlled upload of data to the cloud     | Done                     | Done                      |
| Sending commands through the internet           | Done                     | Done                      |
| Visualizing other users in the app              | Done                     | To be done on Android     |
| Scheduling                                      | To be done               | To be done                |
| Wake-up light                                   | To be done               | To be done                |
| Dimming (PWM at 50Hz)                           | To be done               | To be done                |
| Power consumption history                       | To be done               | To be done                |
| Integration with Toon                           | To be done               | To be done                |
| Device identification                           | To be done               | To be done                |
| Control by non-registered guest users           | To be done               | To be done                |
| Integration with thermostat radiator valves     | To be done               | To be done                |
| Multi-user setup (don't leave user in the dark) | To be done               | To be done                |

The roadmap of the software development can be found at [Trello](https://trello.com/b/6rUcIt62/crownstone-transparent-product-roadmap).

The Android development is always a few weeks behind the iOS development, especially with respect to the graphical user interface. 

The application makes use of separate libraries (so-called bluenet libraries) that are native to the platform. 
This is on purpose so that people can be make use of the Crownstone libraries without the need to use React Native.
See below for getting the libraries.

## Download

The compiled app can be downloaded from [Crownstone](https://crownstone.rocks/app/). 

![Overview screen](https://raw.githubusercontent.com/crownstone/CrownstoneApp/master/documentation/crownstone-app-overview.jpeg)
![Room screen](https://raw.githubusercontent.com/crownstone/CrownstoneApp/master/documentation/crownstone-app-room.jpeg)

## Setup

### React Native

Assuming you've already installed npm, nodejs and yarn. You can get Yarn here: https://yarnpkg.com/en/docs/install
* nodejs
* Yarn, can be obtained at [yarnpkg.com](https://yarnpkg.com/en/docs/install).
* Carthage (for iOS)
* Android Studio (for Android)

Make sure typescript 2.2 or higher is installed using:

```
npm install -g typescript
```

To download all dependencies, use Yarn:

```
yarn
```

To run the compiler, use:

```
tsc --watch
```

or

```
npm start
```


### iOS

In the ios folder, use Carthage to download the dependencies.

```
carthage bootstrap --platform iOS --no-use-binaries
```

### Android

1. Get the nodejs modules:

        yarn

2. Clone the bluenet lib for android:

        cd android
        git clone https://github.com/crownstone/bluenet-lib-android.git bluenet
        cd ..

2. Import the project in Android Studio

        File > New > Import Project ...

    Choose the android dir.

3. Clone the dfu lib for android:

        cd android
        git clone https://github.com/NordicSemiconductor/Android-DFU-Library.git
        cd ..

4. Modify the build tools version of the dfu lib in _Android-DFU-Library/dfu/build.gradle_:
    - `compileSdkVersion 23`
    - `buildToolsVersion '23.0.1'`
    - `targetSdkVersion 23`
    - `compile 'com.android.support:support-v4:23.0.1'`

## Commands

Run the tests:

```
npm test
```

Run react-native

```
react-native run-ios
```

or:
```
react-native run-android
```

## Troubleshooting

If there are problems with PHC folders during iOS compilation, remove the build folder in the ios map.
Cameraroll has to be manually added to iosbuild in 0.42


If you get a lot of these messages in the XCode console:
```
__nw_connection_get_connected_socket_block_invoke
```

Add this global variable to your build config:
```
Xcode menu -> Product -> Edit Scheme...
Environment Variables -> Add -> Name: "OS_ACTIVITY_MODE", Value:"disable"
```

## Copyrights

The copyrights (2014-2017) belongs to the team of Crownstone B.V. and are provided under an noncontagious open-source license:

* Authors: Alex de Mulder, Bart van Vliet
* Date: 1 Apr. 2016
* Triple-licensed: LGPL v3+, Apache, MIT
* Crownstone B.V., <https://www.crownstone.rocks>
* Rotterdam, The Netherlands

