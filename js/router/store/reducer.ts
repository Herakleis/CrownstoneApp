import { combineReducers } from 'redux'

import userReducer    from './reducers/user'
import devicesReducer from './reducers/devices'
import spheresReducer from './reducers/spheres'
import settingReducer from './reducers/settings'
import installationReducer from './reducers/installation'
import appReducer     from './reducers/app'

// crownstoneReducer
export default (state : any = {}, action : any = {}) => {
  // clearing should only happen once we logged out through the store manager. The state of the old user
  // will be persisted.
  if (action.type === 'USER_LOGGED_OUT_CLEAR_STORE') {
    state = {};
  }
  else if (action.type === 'HYDRATE') {
    state = action.state;
  }

  return {
    user: userReducer(state.user, action),
    devices: devicesReducer(state.devices, action),
    spheres: spheresReducer(state.spheres, action),
    settings: settingReducer(state.settings, action),
    installations: installationReducer(state.installations, action),
    app: appReducer(state.app, action)
  }
};
