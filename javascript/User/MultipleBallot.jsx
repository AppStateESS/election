'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import MultipleCandidate from './MultipleCandidate'
import Unqualified from './Unqualified'

/* global $ */

export default class MultipleBallot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      totalSelected: 0
    }
    this.select = this.select.bind(this)
    this.saveVotes = this.saveVotes.bind(this)
  }

  select(candidateId) {
    var selectedRows = this.state.selectedRows
    var found = $.inArray(candidateId, selectedRows)
    var totalSelected = this.state.totalSelected
    var totalSeats = this.props.seatNumber * 1

    if (found === -1) {
      if (totalSelected !== totalSeats) {
        totalSelected++
        selectedRows.push(candidateId)
      }
    } else {
      if (totalSelected > 0) {
        totalSelected--
      }
      selectedRows.splice(found, 1)
    }

    this.setState({selectedRows: selectedRows, totalSelected: totalSelected})
  }

  saveVotes() {
    this.props.updateVote(this.state.selectedRows)
    this.setState({selectedRows: [], totalSelected: 0})
  }

  render() {
    let candidates = this.props.candidates.map(function (value) {
      const selected = $.inArray(value.id, this.state.selectedRows) !== -1

      return (
        <MultipleCandidate
          key={value.id}
          {...value}
          selected={selected}
          select={this.select.bind(null, value.id)}/>
      )
    }.bind(this))

    let button
    if (this.state.totalSelected > 0) {
      button = <button className="btn btn-success btn-lg btn-block" onClick={this.saveVotes}>Continue&nbsp;
        <i className="fa fa-arrow-right"></i>
      </button>
    } else {
      button = <button className="btn btn-warning btn-block" onClick={this.saveVotes}>Abstain from {this.props.title}&nbsp;
        <i className="fa fa-arrow-right"></i>
      </button>
    }

    var unqualified = null
    if (this.props.unqualified.length > 0) {
      unqualified = <Unqualified
        unqualified={this.props.unqualified}
        supportLink={this.props.supportLink}/>
    }
    return (
      <div className="multiple-ticket-vote">
        <h2>{this.props.title}</h2>
        <div className="remaining-seats alert alert-success">
          <p>You have selected {this.state.totalSelected}&nbsp;of the allowed {this.props.seatNumber}&nbsp;seat{
              this.props.seatNumber === '1'
                ? null
                : 's'
            }.</p>
          {button}
        </div>
        <ul className="list-group">
          {candidates}
        </ul>

        <div>
          {button}
        </div>
        <hr/>
        <div>
          {unqualified}
        </div>
      </div>
    )
  }
}

MultipleBallot.propTypes = {
  seatNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string,]),
  updateVote: PropTypes.func,
  title: PropTypes.string,
  candidates: PropTypes.array,
  vote: PropTypes.array,
  multipleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string,]),
  supportLink: PropTypes.string,
  unqualified: PropTypes.array
}

MultipleBallot.defaultProps = {
  updateVote: null,
  seatNumber: 2,
  title: '',
  candidates: [],
  multipleId: 0
}
