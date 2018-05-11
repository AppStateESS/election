'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'


/* global $ */

export default class ReferendumForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
    }
    this.copyPropsToState = this.copyPropsToState.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.checkForErrors = this.checkForErrors.bind(this)
    this.save = this.save.bind(this)
    this.resetBorder = this.resetBorder.bind(this)
  }

  componentWillMount() {
    if (this.props.id) {
      this.copyPropsToState()
    }
  }

  copyPropsToState() {
    this.setState({title: this.props.title, description: this.props.description,})
  }

  updateTitle(e) {
    this.setState({title: e.target.value})
  }

  updateDescription(e) {
    this.setState({description: e.target.value})
  }

  checkForErrors() {
    var error = false
    if (!this.state.title.length) {
      $(this.refs.referendumTitle).css('borderColor', 'red').attr(
        'placeholder',
        'Please enter a title'
      )
      error = true
    }

    if (!this.state.description.length) {
      $(this.refs.referendumDescription).css('borderColor', 'red').attr(
        'placeholder',
        'Please enter a description'
      )
      error = true
    }

    return error
  }

  save() {
    var error = this.checkForErrors()
    if (error === false) {
      $.post('election/Admin/Referendum', {
        command: 'save',
        electionId: this.props.electionId,
        referendumId: this.props.referendumId,
        title: this.state.title,
        description: this.state.description,
      }, null, 'json').done(function () {
        this.props.reload()
      }.bind(this)).always(function () {
        this.props.hideForm()
      }.bind(this)).fail(function () {
        alert('Cannot save referendum')
      }.bind(this))
    }
  }

  resetBorder(node) {
    $(node.target).removeAttr('style')
  }

  render() {
    var heading = (
      <div>
        <input
          ref="referendumTitle"
          type="text"
          className="form-control"
          defaultValue={this.props.title}
          id="referendum-title"
          onFocus={this.resetBorder}
          onChange={this.updateTitle}
          placeholder="Title of referendum"/>
      </div>
    )

    var body = (
      <div>
        <div>
          <textarea
            ref="referendumDescription"
            className="form-control"
            defaultValue={this.props.description}
            id="referendum-description"
            onFocus={this.resetBorder}
            onChange={this.updateDescription}
            placeholder="Description of referendum"/>
        </div>
        <div className="pad-top">
          <button className="btn btn-primary float-left pad-right" onClick={this.save}>
            <i className="fa fa-save"></i>&nbsp;
            Save</button>
          <button className="btn btn-danger" onClick={this.props.hideForm}>
            <i className="fa fa-times"></i>&nbsp;
            Cancel</button>
        </div>
      </div>
    )

    return (<Panel type="success" heading={heading} body={body}/>)
  }
}

ReferendumForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number,PropTypes.string,]),
  description: PropTypes.string,
  title: PropTypes.string,
  hideForm: PropTypes.func,
  electionId: PropTypes.oneOfType([PropTypes.number,PropTypes.string,]),
  referendumId: PropTypes.oneOfType([PropTypes.number,PropTypes.string,]),
  reload: PropTypes.func,
}

ReferendumForm.defaultProps = {
  referendumId: 0,
  electionId: 0,
  title: '',
  description: '',
  hideForm: null,
  reload: null,
}
