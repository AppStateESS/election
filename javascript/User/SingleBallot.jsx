'use strict'
import React, {Component} from 'react'
import {AbstainButton} from '../Mixin/Mixin.jsx'
import PropTypes from 'prop-types'
import SingleBallotTicket from './SingleBallotTicket'

export default class SingleBallot extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let tickets = this.props.ballot.tickets.map(function (value) {
      return (
        <SingleBallotTicket
          key={value.id}
          {...value}
          updateVote={this.props.updateVote.bind(null, value)}/>
      )
    }.bind(this))
    return (
      <div className="single-ticket-vote">
        <h1>{this.props.title}</h1>
        <p className="warning">Vote for <strong>ONE</strong> ticket. We&#39;ll review your decision at the end.</p>
        {tickets}
        <hr/>
        <div className="text-right">
          <AbstainButton
            title={this.props.title}
            handleClick={this.props.updateVote.bind(null, null)}/>
        </div>
      </div>
    )
  }
}

SingleBallot.propTypes = {
  updateVote: PropTypes.func,
  title: PropTypes.string,
  ballot: PropTypes.object,
  vote: PropTypes.array,
  singleId: PropTypes.number
}

SingleBallot.defaultProps = {
  updateVote: null,
  singleId: 0
}
