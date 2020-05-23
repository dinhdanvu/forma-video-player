import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import { connectVideo } from '../connectVideo'
import styles from '../styles'

export class Title extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { name } = this.props.player
    const { container, text } = this.props.styles

    return (
      <View style={container}>
        <Text numberOfLines={1} style={{ fontSize: text.fontSize, color: text.color }}>{name}</Text>
      </View>
    )
  }

}

export const Connected = connectVideo(['name'])(Title)

export const Styled = styles((styles, theme) => ({
  container: {
    backgroundColor: theme.control.backgroundColor,
    paddingHorizontal: 5
  },
  text: {
    fontSize: 20,
    color: theme.control.textColor
  }
}))(Connected)

export default Styled
