'use strict'
import React, {Component} from 'react'
import Panel from '../../Mixin/Panel.jsx'
import PropTypes from 'prop-types'
import SingleList from './SingleList'
import SingleBallotForm from './SingleBallotForm'

/* global $, allowChange */

export default class Single extends Component {
  constructor(props) {
    super(props)
    this.state = {
      singleList: [],
      itemCount: 0,
      showForm: false,
      panelOpen: true,
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
    $.getJSON('election/Admin/Single', {
      command: 'list',
      electionId: this.props.electionId,
    }).done(function (data) {
      this.setState({itemCount: data.length, singleList: data,})
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
    var heading = (
      <div className="row">
        <div className="col-sm-9">
          <h4>Single chair - {this.state.itemCount}&nbsp;
            ballot{
              this.state.itemCount !== 1
                ? 's'
                : null
            }</h4>
        </div>
        <div className="col-sm-3">
          <button
            className="btn btn-block btn-primary"
            disabled={!allowChange}
            onClick={this.showForm}>
            <i className="fa fa-plus"></i>&nbsp;
            New ballot</button>
        </div>
      </div>
    )

    let form
    let body
    let arrow

    if (this.state.panelOpen) {
      if (this.state.showForm) {
        form = <SingleBallotForm
          electionId={this.props.electionId}
          reload={this.load}
          hideForm={this.hideForm}/>
      }
      body = (
        <div>
          {form}
          <SingleList
            electionId={this.props.electionId}
            reload={this.load}
            hideForm={this.hideForm}
            listing={this.state.singleList}/>
        </div>
      )
      arrow = <i className="fa fa-chevron-up"></i>
    } else {
      body = null
      arrow = <i className="fa fa-chevron-down"></i>
    }

    var footer = (
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

Single.propTypes = {
  electionId: PropTypes.number
}

Single.defaultProps = {
  electionId: 0
}
