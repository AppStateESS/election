'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CandidateForm from './CandidateForm'
import CandidateProfile from './CandidateProfile'

/* global $, allowChange */

export default class Candidates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 0
    }
    this.load = this.load.bind(this)
    this.setCurrentForm = this.setCurrentForm.bind(this)
    this.deleteCandidate = this.deleteCandidate.bind(this)
  }

  load() {
    this.props.reload()
    this.setState({currentForm: 0})
  }

  setCurrentForm(id) {
    this.setState({currentForm: id})
  }

  deleteCandidate(candidateId) {
    if (confirm('Are you sure you want to delete this candidate?')) {
      $.post('election/Admin/Candidate', {
        command: 'delete',
        candidateId: candidateId
      }, null, 'json').done(function () {
        this.load()
      }.bind(this)).fail(function () {
        alert('Failed to delete candidate')
      })
    }
  }

  render() {
    var candidates = this.props.candidates.map(function (value) {
      if (value.id === this.state.currentForm) {
        return (
          <div key={value.id} className="col-sm-4 col-xs-6 pad-bottom">
            <CandidateForm
              {...this.props}
              {...value}
              candidateId={value.id}
              reload={this.load}
              reset={this.setCurrentForm.bind(null, 0)}/>
          </div>
        )
      } else {
        return <CandidateProfile
          key={value.id}
          {...value}
          deleteCandidate={this.deleteCandidate.bind(null, value.id)}
          edit={this.setCurrentForm.bind(null, value.id)}/>
      }
    }.bind(this))

    let form = null
    let allowButton = this.state.currentForm == 0 && this.props.showAdd && allowChange
    let button = null
    const bigger = {
      fontSize: '1.5em'
    }

    if (allowButton) {
      button = (
        <button
          className="btn btn-block btn-primary"
          onClick={this.setCurrentForm.bind(null, -1)}>
          <i className="fa fa-user-plus fa-2x"></i>&nbsp;
          <span style={bigger}>Add candidate</span>
        </button>
      )
    }
    if (this.state.currentForm === -1) {
      form = (
        <CandidateForm
          {...this.props}
          reload={this.load}
          reset={this.setCurrentForm.bind(null, 0)}/>
      )
    }

    return (<div>
      {candidates}
      {form}
      {button}
    </div>)
  }
}

Candidates.propTypes = {
  candidates: PropTypes.array,
  ticketId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  multipleId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  type: PropTypes.string,
  showAdd: PropTypes.bool,
  reload: PropTypes.func
}
Candidates.defaultProps = {
  candidates: [],
  ticketId: 0,
  multipleId: 0,
  type: 'ticket',
  showAdd: true
}
