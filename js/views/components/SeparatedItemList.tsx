import * as React from 'react'; import { Component } from 'react';
import {
  
  ScrollView,
  Text,
  View
} from 'react-native';

import { Separator } from '../components/Separator'


export class SeparatedItemList extends Component<any, any> {
  textFields : any;
  textFieldMap : any;
  index : any;
  focusTimeout : any;

  constructor() {
    super();
    this.textFields = [];
    this.textFieldMap = {};
    this.index = 0;
    this.focusTimeout = undefined;
  }


  _getItems() {
    let items = this.props.items;
    let renderItems = [];


    let indentSeparator = this.props.separatorIndent === true;
    let isEditableItem = (item) => {return !(item.type === 'spacer' || item.type === 'explanation')};

    // this function parses the input item.
    let iterator = (prevItem, item, nextItem, index, itemId) => {
      let isItemEditable = isEditableItem(item);
      if (prevItem !== undefined) {
        if (isEditableItem(prevItem) && isItemEditable && indentSeparator) {
          renderItems.push(<Separator key={index + 'top_separator'} fullLength={false} />);
        }
        else if (isItemEditable || isEditableItem(prevItem)) {
          renderItems.push(<Separator key={index + 'top_separator'} fullLength={true} />);
        }
      }
      else if (isItemEditable == true) {
        renderItems.push(<Separator key={index + 'top_separator'} fullLength={true} />);
      }

      renderItems.push(this.props.renderer(item, index, itemId));

      if (nextItem === undefined) {
        if (isItemEditable) {
          renderItems.push(<Separator key={index + 'bottom_separator'} fullLength={true} />);
        }
      }
    };


    if (Array.isArray(items)) {
      if (items.length == 0)
        renderItems.push(<Separator key={0 + 'top_separator'} fullLength={true} />);

      items.forEach((item, index) => {
        iterator(
          (index === 0 ? undefined : items[index-1]),
          item,
          (index === items.length-1 ? undefined : items[index+1]),
          index,
          this.props.ids !== undefined ? this.props.ids[index] : undefined
        )
      });
    }
    else if (typeof items === 'object') {
      let keys = Object.keys(items).sort();
      if (keys.length == 0) {
        renderItems.push(<Separator key={0 + 'top_separator'} fullLength={true} />);
      }
      keys.forEach((itemId, index) => {
        iterator(
          (index === 0 ? undefined : items[keys[index-1]]),
          items[itemId],
          (index === items.length-1 ? undefined : items[keys[index+1]]),
          index,
          itemId
        )
      });
    }
    else {
      return <Text>UNKNOWN TYPE</Text>
    }

    return renderItems;
  }

  render() {
    return <View>{this._getItems()}</View>
  }
}
