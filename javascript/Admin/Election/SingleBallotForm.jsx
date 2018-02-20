'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'

/* global $ */

export default class SingleBallotForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: ''
    }
    this.updateTitle = this.updateTitle.bind(this)
    this.save = this.save.bind(this)
  }
  componentWillMount() {
    if (this.props.id) {
      this.copyPropsToState()
    }
  }

  copyPropsToState() {
    this.setState({title: this.props.title})
  }

  updateTitle(e) {
    this.setState({title: e.target.value})
  }

  checkForErrors() {
    var error = false
    if (this.state.title.length === 0) {
      $(this.refs.ballotTitle).css('borderColor', 'red').attr(
        'placeholder',
        'Please enter a title'
      )
      error = true
    }

    return error
  }

  save() {
    const error = this.checkForErrors()
    if (error === false) {
      $.post('election/Admin/Single', {
        command: 'save',
        singleId: this.props.singleId,
        electionId: this.props.electionId,
        title: this.state.title,
      }, null, 'json').done(function () {
        this.props.reload()
      }.bind(this)).fail(function () {
        alert('Could not save single chair ballot')
      }.bind(this)).always(function () {
        this.props.hideForm()
      }.bind(this))
    }
  }

  resetBorder(node) {
    $(node.target).removeAttr('style')
  }

  render() {
    var heading = (
      <div className="row">
        <div className="col-sm-8">
          <input
            ref="singleTitle"
            type="text"
            className="form-control"
            defaultValue={this.props.title}
            id="single-title"
            onFocus={this.resetBorder}
            onChange={this.updateTitle}
            placeholder="Ballot title (e.g. President/Vice President)"/>
        </div>
        <div className="col-sm-4">
          <div className="pull-right">
            <button className="btn btn-primary pad-right" onClick={this.save}>
              <i className="fa fa-save"></i>&nbsp;
              Save</button>
            <button className="btn btn-danger" onClick={this.props.hideForm}>
              <i className="fa fa-times"></i>&nbsp;
              Cancel</button>
          </div>
        </div>
      </div>
    )

    return (<Panel type="success" heading={heading}/>)
  }
}

SingleBallotForm.propTypes = {
  id: PropTypes.string,
  singleId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  electionId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  title: PropTypes.string,
  hideForm: PropTypes.func,
  reload: PropTypes.func
}

SingleBallotForm.defaultProps = {
  singleId: 0,
  electionId: 0,
  title: '',
  hideForm: null,
  reload: null
}
