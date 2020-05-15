import React, { Component } from 'react';
import {
  View
} from 'react-native';
import PropTypes from 'prop-types';

import VideoWrapper from './VideoWrapper'
import PlayerControls from './PlayerControls'
import Overlay from './Overlay'
import { connectVideo } from './connectVideo'
import { actions } from './state'
import styles from './styles'
import { makeTheme } from './util'

const videoPropsToSet = [
  'source', 'rate', 'volume', 'muted', 'paused', 'resizeMode', 'repeat', 'playInBackground', 'name'
]
const propsToWatch = [
  'back', 'styles'
]

export class Player extends Component {

  constructor(props) {
    super(props)
    this.state = {
      forceShow: false,
      isShow: false,
    }
    this.setStateFromVideoProps()
    props.theme && props.actions.theme(makeTheme(props.theme))
  }

  setStateFromVideoProps = () => {

    videoPropsToSet.forEach((prop) => {
      (typeof this.props.videoProps[prop] != 'undefined') && this.props.actions[prop](this.props.videoProps[prop])
    })

  }



  componentWillReceiveProps(newProps) {
    propsToWatch.forEach((prop) => {
      if ((typeof newProps[prop] != 'undefined') && newProps[prop] != this.props.player[prop]) {
        this.props.actions[prop](newProps[prop])
      }
    })
  }

  showOverlay(forceShow) {

  }

  render() {

    return (
      <View style={{ flex: 1, width: '100%' }}>
        <VideoWrapper resetOverlay={() => {
          this.setState({ isShow: false })
        }} showOverlay={() => {
          if (this.state.forceShow == false && !this.state.isShow) {
            this.setState({ forceShow: true })
            setTimeout(() => {
              this.setState({ forceShow: false, isShow: true })
            }, 5000);
          }
        }} videoProps={this.props.videoProps} />
        <Overlay
          fadeDuration={300}
          displayDuration={5000}
          forceVisible={this.props.player.paused || this.props.player.buffering || this.state.forceShow}>
          <PlayerControls layout={this.props.layout} />
        </Overlay>
      </View>
    )
  }
}

Player.defaultStyles = {
  player: {
    flex: 1
  }
}

Player.propTypes = {
  videoProps: PropTypes.shape({
    name: PropTypes.string,
    source: PropTypes.shape({
      uri: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  back: PropTypes.func,
  styles: PropTypes.object,
  theme: PropTypes.object,
  layout: PropTypes.shape({
    Header: PropTypes.object,
    Body: PropTypes.object,
    Footer: PropTypes.object
  })
}

export const Connected = connectVideo(['paused', 'buffering', 'theme'].concat(videoPropsToSet).concat(propsToWatch),
  videoPropsToSet.concat(propsToWatch).reduce((result, prop) => {
    result[prop] = actions[prop]
    return result
  }, { theme: actions.theme })
)(Player)

export default Connected
