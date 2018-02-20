'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'
import ReferendumList from './ReferendumList'
import ReferendumForm from './ReferendumForm'

/* global $, allowChange */

export default class Referendum extends Component {
  constructor(props) {
    super(props)
    this.state = {
      referendumList: [],
      itemCount: 0,
      showForm: false,
      panelOpen: false,
    }
    this.load = this.load.bind(this)
    this.toggleExpand = this.toggleExpand.bind(this)
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('election/Admin/Referendum', {
      command: 'list',
      electionId: this.props.electionId,
    }).done(function (data) {
      this.setState({itemCount: data.length, referendumList: data,})
    }.bind(this))
  }

  toggleExpand() {
    this.setState({
      panelOpen: !this.state.panelOpen
    })
  }

  showForm(e) {
    e.preventDefault()
    e.stopPropagation()

    this.setState({panelOpen: true, showForm: true,})
  }

  hideForm() {
    this.setState({showForm: false})
  }

  render() {
    let heading = (
      <div className="row">
        <div className="col-sm-8">
          <h4>Referendum - {this.state.itemCount}&nbsp;
            measure{
              this.state.itemCount !== 1
                ? 's'
                : null
            }</h4>
        </div>
        <div className="col-sm-4">
          <button
            disabled={!allowChange}
            className="btn btn-block btn-primary"
            onClick={this.showForm}>
            <i className="fa fa-plus"></i>&nbsp;
            New referendum</button>
        </div>
      </div>
    )

    let body
    let arrow
    let form

    if (this.state.panelOpen) {
      if (this.state.showForm) {
        form = <ReferendumForm
          electionId={this.props.electionId}
          reload={this.load}
          hideForm={this.hideForm}/>
      }
       body = (
        <div>
          {form}
          <ReferendumList
            electionId={this.props.electionId}
            reload={this.load}
            listing={this.state.referendumList}/>
        </div>
      )
      arrow = <i className="fa fa-chevron-up"></i>
    } else {
      body = null
      arrow = <i className="fa fa-chevron-down"></i>
    }

    let footer = (
      <div className="text-center pointer" onClick={this.toggleExpand}>{arrow}</div>
    )

    return (
      <Panel
        type="info"
        heading={heading}
        body={body}
        footer={footer}
        headerClick={this.toggleExpand}
        footerClick={this.toggleExpand}/>
    )
  }
}

Referendum.propTypes = {
  electionId: PropTypes.number
}
Referendum.defaultProps = {
  electionId: 0
}
