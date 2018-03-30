'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Tickets from './Tickets'
import Panel from '../../Mixin/Panel'

/* global $, allowChange */

export default class SingleListRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formId: -1,
      tickets: [],
      ticketCount: 0,
    }
    this.load = this.load.bind(this)
    this.edit = this.edit.bind(this)
    this.toggleExpand = this.toggleExpand.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }
  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('election/Admin/Ticket', {
      command: 'list',
      singleId: this.props.singleId,
    }).done(function (data) {
      this.setState({tickets: data, ticketCount: data.length,})

    }.bind(this))
  }

  toggleExpand() {
    this.props.openSingle(this.props.singleId)
  }

  handleDelete() {
    if (confirm('Are you sure you want to delete this ballot?')) {
      $.post('election/Admin/Single', {
        command: 'delete',
        singleId: this.props.id
      }, null, 'json').done(function () {
        this.props.reload()
      }.bind(this)).fail(function () {
        alert('Unable to delete ballot.')
        this.props.reload()
      }.bind(this))
    }
  }

  edit(e) {
    e.stopPropagation()
    this.props.edit()
  }

  render() {
    var heading = (
      <div className="row">
        <div className="col-sm-6">
          <div className="ballot-title">{this.props.title}&nbsp;-&nbsp; {this.state.ticketCount}&nbsp;
            ticket{
              this.state.ticketCount !== 1
                ? 's'
                : null
            }
          </div>
        </div>
        <div className="col-sm-6">
          <div className="pull-right">
            <button
              className="btn btn-success pad-right"
              onClick={this.edit}
              title="Edit ballot">
              <i className="fa fa-edit"></i>&nbsp;
              Edit</button>
            <button
              disabled={!allowChange}
              className="btn btn-danger"
              onClick={this.handleDelete}>
              <i className="far fa-trash-alt" title="Remove ballot"></i>&nbsp;
              Delete</button>
          </div>
        </div>
      </div>
    )

    let body
    let arrow
    if (this.props.isOpen) {
      body = (
        <div>
          <Tickets
            singleId={this.props.singleId}
            tickets={this.state.tickets}
            load={this.load}/>
        </div>
      )
      arrow = <i className="fa fa-chevron-up"></i>
    } else {
      body = null
      arrow = <i className="fa fa-chevron-down"></i>
    }

    var footer = (<div className="text-center pointer">{arrow}</div>)

    return (
      <Panel
        type="success"
        heading={heading}
        body={body}
        footer={footer}
        footerClick={this.toggleExpand}
        headerClick={this.toggleExpand}/>
    )

  }
}

SingleListRow.propTypes = {
  electionId: PropTypes.number,
  id: PropTypes.string,
  reload: PropTypes.func,
  hideForm: PropTypes.func,
  singleId: PropTypes.string,
  title: PropTypes.string,
  openSingle: PropTypes.func,
  isOpen: PropTypes.bool,
  edit: PropTypes.func
}

SingleListRow.defaultProps = {
  electionId: 0,
  reload: null,
  hideForm: null,
  singleId: 0,
  title: '',
  isOpen: true,
}
