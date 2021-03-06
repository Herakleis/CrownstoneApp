const DeviceInfo = require('react-native-device-info');

/******************** RELEASE FLAGS ********************/


    // ONLY CHANGE THIS LINE IF YOU WANT TO DISABLE RELEASE MODE
    const RELEASE_MODE = true;
    export const FALLBACKS_ENABLED = true;

    // DO NOT CHANGE THIS LINE.
    // the global is meant as a last resort, forcing release to true when compiled in release mode.
    export const RELEASE_MODE_USED = (RELEASE_MODE && DeviceInfo.getModel() !== "Simulator") || global.__DEV__ !== true;

    // this is the name of the app in the database. It has to be exactly this to match the database entry for push notifications.
    // it is used to link an installation to a specific App.
    export const APP_NAME = 'Crownstone.consumer';

/******************** /RELEASE FLAGS ********************/


/**
 *  DO NOT CHANGE THESE VALUES BELOW THIS LINE. YOU CAN CHANGE THEM IN THE LOCAL CONFIG FILE!
 *
 *  To use local config, create a file called LocalConfig.ts next to this file. Any value you put in there will overwrite the matching one here.
 *  The local file is ignored if RELEASE_MODE is set to true.
 */


/******************** APP ********************/

    /**
     * enabling Debug behaviour throughout the app.
     */
    export let DEBUG = false;

    /**
     * Disable Native will automatically mock all BLE commands so the app can run in the simulator.
     * Silence cloud will silently reject all cloud calls.
     */
    export let DISABLE_NATIVE = DeviceInfo.getModel() === "Simulator";
    export let SILENCE_CLOUD  = false;

    /**
     * IMPORTANT: ENCRYPTION_ENABLED determines how the app communicates with the crownstone
     * IMPORTANT: AMOUNT_OF_CROWNSTONES_FOR_INDOOR_LOCALIZATION sets the limit before indoor localization is allowed.
     */
    export let ENCRYPTION_ENABLED = true;   // Enable encryption for the app and the libs
    export const AMOUNT_OF_CROWNSTONES_FOR_INDOOR_LOCALIZATION = 4;

    /**
     * Point to the production cloud.
     */
    export let CLOUD_ADDRESS = 'https://cloud.crownstone.rocks/api/';

    export let MESH_ENABLED = false;

/******************** /APP ********************/




/******************** LOGGING ********************/

    /**
     * Main logging settings
     */
    export let LOG_INFO       = true;    // enabling LOG.info       commands to be shown.
    export let LOG_WARNINGS   = true;    // enabling LOG.warn       commands to be shown.
    export let LOG_ERRORS     = true;    // enabling LOG.error      commands to be shown.

    /**
     * Specific logging settings used for debugging mostly.
     */
    export let LOG_VERBOSE    = false;   // enabling LOG.verbose    commands to be shown.
    export let LOG_SCHEDULER  = false;   // enabling LOG.scheduler  commands to be shown.
    export let LOG_BLE        = false;   // enabling LOG.ble        commands to be shown.
    export let LOG_EVENTS     = false;   // enabling LOG.event      commands to be shown.
    export let LOG_STORE      = false;   // enabling LOG.store      commands to be shown.
    export let LOG_MESH       = false;   // enabling LOG.mesh       commands to be shown.
    export let LOG_CLOUD      = false;   // enabling LOG.cloud      commands to be shown.
    export let LOG_DEBUG      = false;   // enabling LOG.debug      commands to be shown.

    /**
     * Log to file. Even if this is false, if the user configures it in the user profile through the developer mode, logging to file will still be used.
     * This flag is meant to just always log to file, regardless of the user input. Used for debugging.
     */
    export let LOG_TO_FILE    = false;   // log everything that is logged to a file.

/******************** /LOGGING ********************/




/******************** TIMINGS ********************/

    // Network request handles the calls the cloud. If they take longer than 15 seconds, the requests will reject.
    export const NETWORK_REQUEST_TIMEOUT = 15000; //ms

    // Max duration of HF scanning. Meant to clean up in case the user does not. HF scanning is expensive for the battery.
    export const HIGH_FREQUENCY_SCAN_MAX_DURATION = 15000; //ms

    // The disable timeout determines how long we will keep showing the crownstone active (instead of searching...) since we last heard from it.
    export const DISABLE_TIMEOUT = 30000; //ms

    // settings for the keepAlive. The interval determines how often the keep alive fires, the attemps are the times it will try in total. 2 means 1 retry.
    export const KEEPALIVE_INTERVAL = 70; // s !
    export const KEEPALIVE_ATTEMPTS = 2;

    // Time until a scanned crownstone in setup mode is regarded to be gone.
    export const SETUP_MODE_TIMEOUT = 15000; // ms

    // interval for syncing with the cloud.
    export const SYNC_INTERVAL = 60*10; // s --> 10 minutes

    // The amount of time to wait until the promise manager gives up on a pending promise.
    export const PROMISE_MANAGER_FALLBACK_TIMEOUT = 60000; // ms --> 1 minute

    // The amount of time the scheduler tick (setTimeout) waits between ticks. The normal heartbeat is by the ibeacon messages (once a second)
    export const SCHEDULER_FALLBACK_TICK = 4000; // ms --> 1 minute

    // the amount of time between the near/far switching. If you go from near->far, it will ignore the messages for the next TRIGGER_TIME_BETWEEN_SWITCHING_NEAR_AWAY ms
    export const TRIGGER_TIME_BETWEEN_SWITCHING_NEAR_AWAY = 2000; // ms

    // the amout of time we wait before accepting another tap to toggle to the same crownstone.
    export const TIME_BETWEEN_TAP_TO_TOGGLES = 5000; // ms

/******************** /TIMINGS ********************/




/******************** LOCAL OVERRIDE ********************/

// force flags based on release modes
if (RELEASE_MODE_USED === false) {
  //override settings with local config, if it exists
  try {
    let localConfig = require('./LocalConfig');
    let localKeys = Object.keys(localConfig);
    for (let i = 0; i < localKeys.length; i++) {
      if (module.exports[localKeys[i]] !== undefined && module.exports[localKeys[i]] !== localConfig[localKeys[i]]) {
        console.log("LOCAL CONFIG OVERRIDE", localKeys[i], module.exports[localKeys[i]], 'to', localConfig[localKeys[i]]);
        module.exports[localKeys[i]] = localConfig[localKeys[i]];
      }
    }
    console.log("USING CONFIG", module.exports);
  } catch (err) {
    // cant find local config. ignore import.
  }
}


/******************** /LOCAL OVERRIDE ********************/
