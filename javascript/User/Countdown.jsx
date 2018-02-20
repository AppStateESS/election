'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Countdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seen: false
    }
  }

  plural(item, single, plural) {
    if(typeof single === 'undefined' || single.length === 0) {
      single = ''
    }
    if(typeof plural === 'undefined' || plural.length === 0) {
      plural = 's'
    }
    return(
      item != 1 ?
      plural :
      single
    )
  }

  render() {
    var ballots = null
    var referendum = null
    var totalItems = 0
    var isAre = 'are '
    var and = ''

    if(this.props.ballotCount > 0) {
      totalItems += this.props.ballotCount
      ballots = this.props.ballotCount + ' ballot' + this.plural(
        this.props.ballotCount
      ) + ' '
    }

    if(this.props.referendumCount > 0) {
      totalItems += this.props.referendumCount
      referendum = this.props.referendumCount + ' referend' + this.plural(
        this.props.referendumCount,
        'um',
        'a'
      )
    }

    if(totalItems < 2) {
      isAre = 'is'
    }

    if(this.props.ballotCount > 0 && this.props.referendumCount > 0) {
      and = 'and'
    }

    return(
      <div className="alert alert-info">
        There {isAre} currently {ballots} {and} {referendum} for you to vote on. We will review all your selections later, before your votes are submitted.
      </div>
    )
  }
}

Countdown.propTypes = {
  ballotCount: PropTypes.number,
  referendumCount: PropTypes.number,
  vote: PropTypes.func,
}

Countdown.defaultProps = {
  ballotCount: 0,
  referendumCount: 0,
  vote: null,
}
