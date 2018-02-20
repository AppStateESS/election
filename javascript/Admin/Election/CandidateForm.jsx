'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CandidateInfo from './CandidateInfo'
import Photo from './Photo'

/* global $ */

export default class CandidateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      title: '',
      photo: [],
      picture: null,
    }
    this.save = this.save.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.updatePhoto = this.updatePhoto.bind(this)
    this.updateFirstName = this.updateFirstName.bind(this)
    this.updateLastName = this.updateLastName.bind(this)
  }

  componentWillMount() {
    if (this.props.candidateId > 0) {
      this.setState(
        {firstName: this.props.firstName, lastName: this.props.lastName, picture: this.props.picture, title: this.props.title,}
      )
    }
  }

  updateFirstName(e) {
    this.setState({firstName: e.target.value})
  }

  updateLastName(e) {
    this.setState({lastName: e.target.value})
  }

  updatePhoto(photo) {
    this.setState({photo: photo})
  }

  updateTitle(e) {
    this.setState({title: e.target.value})
  }

  save() {
    var data = new FormData()
    data.append('command', 'save')
    data.append('type', this.props.type)

    $.each(this.state.photo, function (key, value) {
      data.append(key, value)
    })

    if (this.props.ticketId > 0) {
      data.append('ticketId', this.props.ticketId)
    } else {
      data.append('multipleId', this.props.multipleId)
    }
    data.append('candidateId', this.props.candidateId)
    data.append('firstName', this.state.firstName)
    data.append('lastName', this.state.lastName)
    data.append('title', this.state.title)

    $.ajax({
      url: 'election/Admin/Candidate',
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function() {
        this.props.reload()
      }.bind(this),
      error: function() {
        alert('Failed to save candidate')
        this.props.reload()
      }.bind(this),
    })
  }

  render() {

    var disabledButton = (
      this.state.firstName.length === 0 || this.state.lastName.length === 0
    )

    return (
      <div className="candidate-form text-center">
        <Photo
          photo={this.state.photo}
          update={this.updatePhoto}
          picture={this.state.picture}/>
        <CandidateInfo
          updateFirstName={this.updateFirstName}
          updateLastName={this.updateLastName}
          updateTitle={this.updateTitle}
          {...this.state}
          useTitle={this.props.type == 'ticket'}/>
        <div className="pad-top">
          <button
            className="btn btn-success btn-sm"
            title="Save candidate"
            onClick={this.save}
            disabled={disabledButton}>
            <i className="fa fa-save"></i>&nbsp;
            Save</button>
          &nbsp;
          <button
            className="btn btn-danger btn-sm"
            title="Cancel"
            onClick={this.props.reset}>
            <i className="fa fa-times"></i> &nbsp;
            Clear</button>
        </div>
      </div>
    )
  }
}

CandidateForm.propTypes = {
  ticketId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  multipleId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  type: PropTypes.string,
  candidateId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  reload: PropTypes.func,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  title: PropTypes.string,
  picture: PropTypes.string,
  reset: PropTypes.func,
  useTitle: PropTypes.bool,
}

CandidateForm.defaultProps = {
  ticketId: 0,
  multipleId: 0,
  type: 'ticket',
  candidateId: 0,
  reload: null,
  firstName: '',
  lastName: '',
  title: '',
  picture: null,
  useTitle: true,
}
