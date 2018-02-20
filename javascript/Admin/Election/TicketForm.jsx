'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'

/* global $ */

export default class TicketForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      siteAddress: '',
      platform: '',
      siteAddressError: false,
    }
    this.save = this.save.bind(this)
    this.checkUrl = this.checkUrl.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this.changePlatform = this.changePlatform.bind(this)
    this.changeSiteAddress = this.changeSiteAddress.bind(this)
  }

  componentWillMount() {
    if (this.props.id > 0) {
      this.copyPropsToState()
    }
  }

  copyPropsToState() {
    this.setState(
      {title: this.props.title, siteAddress: this.props.siteAddress, platform: this.props.platform,}
    )
  }

  checkForErrors() {
    var error = false

    var title = this.refs.title.value
    if (title.length === 0) {
      $(this.refs.title).css('borderColor', 'red').attr(
        'placeholder',
        'Please enter a title'
      )
      error = true
    }

    return error
  }

  checkUrl() {
    if (this.state.siteAddress && this.state.siteAddress.length > 0) {
      $.getJSON('election/Admin/Ticket', {
        command: 'checkUrl',
        checkUrl: this.state.siteAddress,
      }).done(function (data) {
        if (!data.success || data.success === false) {
          this.setState({siteAddressError: true})
          $(this.refs.siteAddress).css('borderColor', 'red')
          return false
        } else {
          this.setState({siteAddressError: false})
          $(this.refs.siteAddress).css('borderColor', 'inherit')
          return true
        }
      }.bind(this))
    } else {
      this.setState({siteAddressError: false})
      $(this.refs.siteAddress).css('borderColor', 'inherit')
      return true
    }
  }

  save() {
    var error = this.checkForErrors()
    if (error === false && this.state.siteAddressError === false) {
      $.post('election/Admin/Ticket', {
        command: 'save',
        singleId: this.props.singleId,
        ticketId: this.props.ticketId,
        title: this.state.title,
        siteAddress: this.state.siteAddress,
        platform: this.state.platform,
      }, null, 'json').done(function () {
        this.props.load()
      }.bind(this)).always(function () {
        this.props.close()
      }.bind(this)).fail(function () {
        alert('Sorry but an error occurred when trying to save your ticket.')
      })
    }
  }

  changeTitle(e) {
    this.setState({title: e.target.value})
  }

  changeSiteAddress(e) {
    var siteAddress = e.target.value
    if (siteAddress.length === 0) {
      this.setState({siteAddressError: false})
    }
    this.setState({siteAddress: siteAddress})
  }

  changePlatform(e) {
    this.setState({platform: e.target.value})
  }

  resetBorder(e) {
    $(e.target).css('borderColor', 'inherit')
  }

  render() {
    var body = (
      <div className="col-xs-12 col-sm-8">
        <div className="row">
          <div className="col-sm-2">
            <label htmlFor="title" className="control-label pad-right">Title:</label>
          </div>
          <div className="col-sm-10">
            <input
              ref="title"
              type="text"
              className="form-control"
              onFocus={this.resetBorder}
              placeholder="Candidate last names (e.g. Jones / Smith)"
              onChange={this.changeTitle}
              value={this.state.title}/>
          </div>
        </div>
        <div className="row pad-top">
          <div className="col-sm-2">
            <label htmlFor="siteAddress" className="control-label pad-right">Site address:</label>
          </div>
          <div className="col-sm-10">
            <input
              ref="siteAddress"
              type="text"
              className="form-control"
              placeholder="http://siteaddress.com"
              onFocus={this.resetBorder}
              onBlur={this.checkUrl}
              onChange={this.changeSiteAddress}
              value={this.state.siteAddress}/> {
              this.state.siteAddressError
                ? <div className="text-danger">Site address format not accepted.</div>
                : null
            }
          </div>
        </div>
        <div className="row pad-top">
          <div className="col-sm-2">
            <label htmlFor="platform" className="control-label pad-right">Platform:</label>
          </div>
          <div className="col-sm-10">
            <textarea
              ref="platform"
              className="form-control"
              onFocus={this.resetBorder}
              placeholder="Ticket's election statement"
              onChange={this.changePlatform}
              value={this.state.platform}
              maxLength={500}/>
            <span>500 character limit</span>
          </div>
        </div>
        <hr/>
        <button
          className="btn btn-primary pad-right"
          onClick={this.save}
          disabled={this.state.siteAddressError}>
          <i className="fa fa-save"></i>&nbsp;Save ticket</button>
        <button className="btn btn-danger" onClick={this.props.close}>
          <i className="fa fa-times"></i>&nbsp;Cancel</button>
      </div>
    )

    return (<div>
      <Panel body={body}/>
    </div>)
  }
}

TicketForm.propTypes = {
  id: PropTypes.string,
  close: PropTypes.func,
  load: PropTypes.func,
  singleId: PropTypes.string,
  ticketId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  title: PropTypes.string,
  siteAddress: PropTypes.string,
  platform: PropTypes.string,
}

TicketForm.defaultProps = {
  close: null,
  load: null,
  singleId: 0,
  ticketId: 0,
  title: null,
  siteAddress: null,
  platform: null
}
