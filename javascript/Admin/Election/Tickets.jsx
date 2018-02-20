'use strict'

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TicketForm from './TicketForm'
import TicketRow from './TicketRow'

/* global $, allowChange */

class Tickets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ticketFormId: -1
    }
    this.editFormId = this.editFormId.bind(this)
  }

  editFormId(ticketId) {
    this.setState({ticketFormId: ticketId})
  }

  delete(ticketId) {
    if (confirm('Are you sure you want to delete this ticket?')) {
      $.post('election/Admin/Ticket', {
        command: 'delete',
        ticketId: ticketId
      }, null, 'json').done(function () {
        this.props.load()
      }.bind(this)).fail(function () {
        alert('Unable to delete this ticket.')
        this.props.load()
      }.bind(this))
    }
  }

  render() {

    var shared = {
      close: this.editFormId.bind(null, -1),
      load: this.props.load,
      singleId: this.props.singleId,
    }
    var form = null
    if (this.state.ticketFormId === 0) {
      form = <TicketForm {...shared} singleId={this.props.singleId}/>
    } else {
      form = (
        <button
          disabled={!allowChange}
          className="btn btn-primary"
          onClick={this.editFormId.bind(null, 0)}>
          <i className="fa fa-plus"></i>&nbsp;
          Add a new ticket
        </button>
      )
    }

    var ticketList = (<div>
      No tickets yet!
    </div>)

    if (this.props.tickets.length > 0) {
      ticketList = this.props.tickets.map(function (value) {
        if (value.id === this.state.ticketFormId) {
          return <TicketForm key={value.id} ticketId={value.id} {...value} {...shared}/>
        } else {
          return <TicketRow
            key={value.id}
            {...value}
            handleEdit={this.editFormId.bind(null, value.id)}
            handleDelete={this.delete.bind(null, value.id)}/>
        }
      }.bind(this))
    }

    return (
      <div>
        {form}
        <div className="pad-top">
          {ticketList}
        </div>
      </div>
    )
  }
}

Tickets.propTypes = {
  load: PropTypes.func,
  tickets: PropTypes.array,
  singleId: PropTypes.string,
}

Tickets.defaultProps = {
  singleId: 0,
  tickets: []
}

export default Tickets
