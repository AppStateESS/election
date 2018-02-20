'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'
import Candidates from './Candidates'

/* global $, allowChange */

export default class TicketRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      candidates: []
    }
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('election/Admin/Candidate', {
      command: 'ticketList',
      ticketId: this.props.id,
    }).done(function (data) {
      this.setState({candidates: data})
    }.bind(this))
  }

  render() {
    var platform = <em>No platform</em>
    if (this.props.platform.length > 0) {
      platform = (
        <p>{
            this.props.platform.split("\n").map(function (item, i) {
              return (
                <span key={i}>{item}
                  <br/>
                </span>
              )
            })
          }
        </p>
      )
    }
    var showAdd = this.state.candidates.length < 2

    var body = (
      <div className="ticket-form-view">
        <div className="change-buttons">
          <button
            className="btn btn-sm btn-success"
            data-tid={this.props.id}
            onClick={this.props.handleEdit}
            title="Edit ticket">
            <i className="fa fa-lg fa-edit"></i>&nbsp;Edit ticket</button>
          <button
            disabled={!allowChange}
            className="btn btn-sm btn-danger"
            onClick={this.props.handleDelete}
            title="Delete ticket">
            <i className="fa fa-lg fa-trash-o"></i>&nbsp;Delete ticket</button>
        </div>
        <div className="ticket-title">{this.props.title}</div>
        <div>
          {platform}
          <div>
            {
              this.props.siteAddress.length
                ? (
                  <p>
                    <strong>Web site:</strong>
                    <a href={this.props.siteAddress} target="_blank">{this.props.siteAddress}</a>
                  </p>
                )
                : <em>No website</em>
            }
          </div>
        </div>
        <hr/>
        <Candidates
          type="ticket"
          candidates={this.state.candidates}
          singleId={this.props.singleId}
          ticketId={this.props.id}
          reload={this.load}
          showAdd={showAdd}/>
      </div>
    )

    return (<div>
      <Panel body={body}/>
    </div>)
  }
}

TicketRow.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  platform: PropTypes.string,
  siteAddress: PropTypes.string,
  handleDelete: PropTypes.func,
  singleId: PropTypes.string,
  handleEdit: PropTypes.func,
}

TicketRow.defaultProps = {
  id: 0,
  title: null,
  platform: '',
  siteAddress: '',
  handleDelete: null,
}
