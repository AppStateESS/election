'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel.jsx'
import MultipleForm from './MultipleForm.jsx'
import MultipleList from './MultipleList.jsx'

/* global $, allowChange */

export default class MultipleBallot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      multipleList: [],
      itemCount: 0,
      panelOpen: false,
      showForm: false,
      categoryList: [],
    }
    this.toggleExpand = this.toggleExpand.bind(this)
    this.showForm = this.showForm.bind(this)
    this.load = this.load.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('election/Admin/Multiple', {
      command: 'list',
      electionId: this.props.electionId,
    }).done(function (data) {
      this.setState({itemCount: data.length, multipleList: data,})
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
          <h4>Multiple chair - {this.state.itemCount}&nbsp;
            ballot{
              this.state.itemCount !== 1
                ? 's'
                : null
            }</h4>
        </div>
        <div className="col-sm-3">
          <button
            className="btn btn-block btn-primary"
            onClick={this.showForm}
            disabled={!allowChange}>
            <i className="fa fa-plus"></i>&nbsp;
            New ballot</button>
        </div>
      </div>
    )
    let body
    let arrow
    if (this.state.panelOpen) {
      var form = null
      if (this.state.showForm) {
        form = <MultipleForm
          electionId={this.props.electionId}
          reload={this.load}
          hideForm={this.hideForm}/>
      }
      body = (
        <div>
          {form}
          <MultipleList
            electionId={this.props.electionId}
            reload={this.load}
            listing={this.state.multipleList}/>
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

MultipleBallot.propTypes = {
  electionId: PropTypes.oneOfType([PropTypes.number,PropTypes.string,]),
}
