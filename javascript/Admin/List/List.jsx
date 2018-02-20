'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Modal from '../../Mixin/Modal.jsx'
import ElectionRow from './ElectionRow'
import ElectionForm from './ElectionForm'
import ResetForm from './ResetForm'

/* global $ */

export default class ElectionList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      elections: [],
      showForm: false,
      currentElectionId: 0,
      studentFound: null,
      foundName: null,
      resetOpen: false,
      currentStudent: 0,
      message: null
    }
    this.showForm = this.showForm.bind(this)
    this.load = this.load.bind(this)
    this.showResetForm = this.showResetForm.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.searchVotes = this.searchVotes.bind(this)
    this.resetVote = this.resetVote.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.getJSON('election/Admin/Election', {command: 'list'}).done(function (data) {
      this.setState({elections: data})
    }.bind(this))
  }

  showForm() {
    this.setState({showForm: true})
  }

  hideForm() {
    this.setState({showForm: false})
  }

  closeModal() {
    $('#reactModal').modal('hide')
    this.setState(
      {studentFound: null, foundName: null, currentElectionId: 0, currentStudent: 0, resetOpen: false}
    )
  }

  showResetForm(electionId) {
    this.setState({currentElectionId: electionId, resetOpen: true})
    $('#reactModal').modal('show')
  }

  searchVotes(searchFor) {
    $.getJSON('election/Admin/Election', {
      command: 'findVote',
      electionId: this.state.currentElectionId,
      searchFor: searchFor
    }).done(function (data) {
      if (data === null) {
        this.setState({studentFound: false, foundName: null,})
      } else {
        this.setState(
          {studentFound: true, foundName: data['student'], currentStudent: searchFor,}
        )
      }
    }.bind(this))
  }

  resetVote() {
    $.post('election/Admin/Election', {
      command: 'resetVote',
      electionId: this.state.currentElectionId,
      bannerId: this.state.currentStudent
    }).done(function () {
      this.setState({message: 'Vote reset'})
      this.closeModal()
      this.load()
    }.bind(this), 'json')
  }

  render() {
    let rows = this.state.elections.map(function (value, key) {
      return (
        <ElectionRow
          key={key}
          {...value}
          hideForm={this.hideForm}
          reload={this.load}
          showResetForm={this.showResetForm}/>
      )
    }.bind(this))
    let form = <button className="btn btn-success" onClick={this.showForm}>
      <i className="fa fa-plus"></i>&nbsp; Add Election
    </button>
    if (this.state.showForm) {
      form = <ElectionForm hideForm={this.hideForm} load={this.load}/>
    }

    let message = null
    if (this.state.message != null) {
      message = <div className="alert alert-success">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        {this.state.message}
      </div>
      setTimeout(function () {
        this.setState({message: null})
      }.bind(this), 4000)
    }

    let modalBody = (
      <ResetForm
        searchVotes={this.searchVotes}
        studentFound={this.state.studentFound}
        foundName={this.state.foundName}
        resetOpen={this.state.resetOpen}
        resetVote={this.resetVote}/>
    )
    let modal = <Modal body={modalBody} header="Reset student vote" onClose={this.closeModal}/>
    return (
      <div>
        {message}
        {form}
        {modal}
        <table className="table table-striped pad-top">
          <tbody>
            <tr>
              <th>Title</th>
              <th>Date range</th>
              <th>Total votes</th>
              <th>&nbsp;</th>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}

ReactDOM.render(<ElectionList/>, document.getElementById('election-listing'))
