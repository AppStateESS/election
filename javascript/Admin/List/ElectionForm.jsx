'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'
import DateMixin from '../../Mixin/DateMixin'

/* global $ */

export default class ElectionForm extends DateMixin {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      startDate: '',
      endDate: '',
      unixStart: 0,
      unixEnd: 0,
    }

  }

  componentDidMount() {
    this.initStartDate()
    this.initEndDate()
  }

  componentWillMount() {
    if (this.props.electionId) {
      this.copyPropsToState()
    }
  }

  copyPropsToState() {
    this.setState({
      title: this.props.title,
      startDate: this.props.startDateFormatted,
      endDate: this.props.endDateFormatted,
      unixStart: this.props.startDate,
      unixEnd: this.props.endDate,
    })
  }

  updateTitle(e) {
    this.setState({title: e.target.value})
  }

  checkForErrors() {
    var error = false
    if (this.state.title.length === 0) {
      $(this.refs.electionTitle).css('borderColor', 'red').attr(
        'placeholder',
        'Please enter a title'
      )
      error = true
    }

    if (this.hasDateErrors()) {
      error = true
    }

    return error
  }

  save() {
    var error = this.checkForErrors()
    if (error === false) {
      var conflict = this.checkForConflict()
      conflict.done(function (data) {
        if (data.conflict === false) {
          $.post('election/Admin/Election', {
            command: 'save',
            electionId: this.props.electionId,
            title: this.state.title,
            startDate: this.state.unixStart,
            endDate: this.state.unixEnd,
          }, null, 'json').done(function () {
            this.props.load()
          }.bind(this)).always(function () {
            this.props.hideForm()
          }.bind(this))
        } else {
          $(this.refs.startDate).css('borderColor', 'red').attr(
            'placeholder',
            'Date conflict'
          )
          $(this.refs.endDate).css('borderColor', 'red').attr(
            'placeholder',
            'Date conflict'
          )
          this.setState({startDate: '', unixStart: 0, endDate: '', unixEnd: 0,})
        }
      }.bind(this))
    }
  }

  render() {
    const year = new Date().getFullYear()
    var title = (
      <input
        ref="electionTitle"
        type="text"
        className="form-control"
        defaultValue={this.props.title}
        id="election-title"
        onFocus={this.resetBorder.bind(this)}
        onChange={this.updateTitle.bind(this)}
        placeholder={`Title (e.g. Fall ${year} Election)`}/>
    )
    var date = (
      <div className="row pad-top">
        <div className="col-sm-6">
          <div className="input-group">
            <input
              placeholder="Voting start date and time"
              ref="startDate"
              type="text"
              className="form-control datepicker"
              id="start-date"
              onFocus={this.resetBorder}
              onChange={this.changeStartDate}
              value={this.state.startDate}/>
            <div className="input-group-addon">
              <i className="fa fa-calendar" onClick={this.showStartCalendar.bind(this)}></i>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="input-group">
            <input
              placeholder="Voting deadline"
              ref="endDate"
              type="text"
              className="form-control datepicker"
              id="end-date"
              onFocus={this.resetBorder}
              onChange={this.changeEndDate}
              value={this.state.endDate}/>
            <div className="input-group-addon">
              <i className="fa fa-calendar" onClick={this.showEndCalendar.bind(this)}></i>
            </div>
          </div>
        </div>
      </div>
    )
    var buttons = (
      <div>
        <button className="btn btn-primary btn-block" onClick={this.save.bind(this)}>
          <i className="fa fa-save"></i>&nbsp; Save election</button>
        <button className="btn btn-danger btn-block" onClick={this.props.hideForm}>
          <i className="fa fa-times"></i>&nbsp; Cancel</button>
      </div>
    )

    var heading = (
      <div className="row">
        <div className="col-sm-9">
          {title}
          {date}
        </div>
        <div className="col-sm-3">
          {buttons}
        </div>
      </div>
    )

    return (<Panel type="info" heading={heading}/>)
  }
}

ElectionForm.propTypes = {
  title: PropTypes.string,
}

ElectionForm.defaultProps = {
  electionId: 0,
  title: '',
  startDate: '',
  endDate: '',
  hideForm: null,
}
