import { Reducer, ActionConst } from 'react-native-router-flux';
import { Platform } from 'react-native';
import { LOG } from '../../../logging/Log'

let inTabMenu = (state) => {
  if (state && state.children && state.children.length > 0) {
    return state.children[0].name == "tabBar";
  }
  return false;
};

let getActiveTabName = (state) => {
  if (state && state.children && state.children.length > 0) {
    let tabBar = state.children[0];
    let tabIndex =  tabBar.index;
    return tabBar.children[tabIndex].name;
  }
  return undefined;
};

let getTabTreeIndex = (state) => {
  if (state && state.children && state.children.length > 0) {
    let tabBar = state.children[0];
    let tabIndex =  tabBar.index;
    return tabBar.children[tabIndex].index;
  }
  return undefined;
};

let getTabRootName = (state) => {
  if (state && state.children && state.children.length > 0) {
    let tabBar = state.children[0];
    let tabIndex =  tabBar.index;
    let tabContainer = tabBar.children[tabIndex];
    return tabContainer.children[0].name;
  }
  return undefined;
};

export const reducerCreate = (params) => {
  const defaultReducer = Reducer(params, {});
  return (state, action)=> {
    if (Platform.OS !== 'android') {
      // this part makes sure that when a menuIcon is pressed AND you are already in that menu tree,
      // it goes back to the root of that tree
      if (action.type === ActionConst.JUMP && inTabMenu(state)) {
        let activeTabName = getActiveTabName(state);
        // We only want to reset if the icon is tapped when we're already in the view
        if (activeTabName === action.key) {
          // if we're already at root, do not do anything.
          if (getTabTreeIndex(state) === 0) {
            return state;
          }
          // snap to root.
          let rootName = getTabRootName(state);
          if (rootName) {
            LOG.info("ACTION Overruled", {key: rootName, type: 'reset'});
            return defaultReducer(state, {key: rootName, type: 'reset'});
          }
        }
      }
    }
    return defaultReducer(state, action);
  }
};