'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class ResetForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      checking: false,
    }
    this.updateSearch = this.updateSearch.bind(this)
    this.sendSearch = this.sendSearch.bind(this)
  }

  updateSearch(event) {
    let value = event.target.value.replace(/[^\d]/, '')
    this.setState({search: value})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.studentFound != null) {
      this.setState({checking: false})
    }
    if (nextProps.resetOpen == false) {
      this.setState({search: ''})
    }
  }

  sendSearch() {
    this.setState({checking: true})
    this.props.searchVotes(this.state.search)
  }

  render() {
    let message = null
    if (this.state.checking) {
      message = (
        <div className="alert alert-default">
          <i className="fa fa-spinner fa-spin fa-2x fa-fw"></i>&nbsp;Searching for vote...</div>
      )
    } else if (this.props.studentFound == false) {
      message = <div className="alert alert-warning">Vote banner id not found</div>
    } else if (this.props.studentFound == true) {
      message = (
        <div className="alert alert-danger">
          Are you sure you want to reset&nbsp;<strong>{this.props.foundName}'s</strong>&nbsp;vote?&nbsp;
          <button className="btn btn-success" onClick={this.props.resetVote}>
            <i className="fa fa-check"></i>&nbsp;Yes</button>&nbsp;
          <button className="btn btn-warning" data-dismiss="modal">
            <i className="fa fa-times"></i>&nbsp;No</button>
        </div>
      )
    }
    return (
      <div>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter student banner id"
            onChange={this.updateSearch}
            value={this.state.search}/>
          <span className="input-group-btn">
            <button className="btn btn-success" type="button" onClick={this.sendSearch}>Search</button>
          </span>

        </div>
        <div>{message}</div>
      </div>
    )
  }
}

ResetForm.propTypes = {
  foundName: PropTypes.string,
  resetVote: PropTypes.func,
  studentFound: PropTypes.bool,
  searchVotes: PropTypes.func,
}

ResetForm.defaultProps = {
  resetOpen: false
}
