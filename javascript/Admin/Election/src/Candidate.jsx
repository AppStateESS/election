import React from 'react'
import Dropzone from 'react-dropzone'

/* global $ */

Candidates = React.createClass({
  getInitialState: function () {
    return {currentForm: 0}
  },

  getDefaultProps: function () {
    return {candidates: [], ticketId: 0, multipleId: 0, type: 'ticket', showAdd: true}
  },

  load: function () {
    this.props.reload()
    this.setState({currentForm: 0})
  },

  setCurrentForm: function (id) {
    this.setState({currentForm: id})
  },

  delete: function (candidateId) {
    if (confirm('Are you sure you want to delete this candidate?')) {
      $.post('election/Admin/Candidate', {
        command: 'delete',
        candidateId: candidateId
      }, null, 'json').done(function () {
        this.load()
      }.bind(this)).fail(function () {
        alert('Failed to delete candidate')
      })
    }
  },

  render: function () {
    var candidates = this.props.candidates.map(function (value) {
      if (value.id === this.state.currentForm) {
        return (
          <div key={value.id} className="col-sm-4 col-xs-6 pad-bottom">
            <CandidateForm
              {...this.props}
              {...value}
              candidateId={value.id}
              reload={this.load}
              reset={this.setCurrentForm.bind(null, 0)}/>
          </div>
        )
      } else {
        return <CandidateProfile
          key={value.id}
          {...value}
          delete={this.delete.bind(null, value.id)}
          edit={this.setCurrentForm.bind(null, value.id)}/>
      }
    }.bind(this))

    let form = null
    let allowButton = this.state.currentForm == 0 && this.props.showAdd && allowChange
    let button = null
    if (allowButton) {
      button = (
        <button
          className="btn btn-block btn-primary"
          onClick={this.setCurrentForm.bind(null, -1)}>
          <i className="fa fa-user-plus fa-2x"></i>&nbsp;
          <span style={{
            fontSize: '1.5em'
          }}>Add candidate</span>
        </button>
    )
    }
    if (this.state.currentForm === -1) {
      form = (<CandidateForm
        {...this.props}
        reload={this.load}
        reset={this.setCurrentForm.bind(null, 0)}/>)
    }

    return (
      <div>
        {candidates}
        {form}
        {button}
      </div>
    )
  }
})


var CandidateProfile = React.createClass({
  getDefaultProps: function () {
    return {firstName: null, lastName: null, title: null, picture: null};
  },

  render: function () {
    return (
      <div className="candidate-profile">
        <div className="photo-matte">
          {this.props.picture.length > 0
            ? (
              <div>
                <span className="helper"></span>
                <img src={this.props.picture} className="img-responsive candidate-pic"/>
              </div>
            )
            : (
              <div className="no-picture text-muted">
                <i className="fa fa-user fa-5x"></i><br/>No picture</div>
            )}
        </div>
        <div>
          <p>
            <strong>{this.props.firstName} {this.props.lastName}</strong><br/> {this.props.title}
          </p>
          <button
            className="btn btn-primary"
            title="Edit candidate"
            onClick={this.props.edit}>
            <i className="fa fa-edit"></i>
          </button>&nbsp;
          <button
            className="btn btn-danger"
            disabled={!allowChange}
            onClick={this.props.delete}
            title="Delete candidate">
            <i className="fa fa-times"></i>
          </button>
        </div>
      </div>
    )
  }
})

var CandidateForm = React.createClass({
  getInitialState: function () {
    return {firstName: '', lastName: '', title: '', photo: [], picture: null}
  },

  getDefaultProps: function () {
    return {
      ticketId: 0,
      multipleId: 0,
      type: 'ticket',
      candidateId: 0,
      reload: null,
      firstName: '',
      lastName: '',
      title: '',
      picture: null,
      useTitle: true
    }
  },

  componentWillMount: function () {
    if (this.props.candidateId > 0) {
      this.setState({firstName: this.props.firstName, lastName: this.props.lastName, picture: this.props.picture, title: this.props.title})
    }
  },

  updateFirstName: function (e) {
    this.setState({firstName: e.target.value});
  },

  updateLastName: function (e) {
    this.setState({lastName: e.target.value})
  },

  updatePhoto: function (photo) {
    this.setState({photo: photo})
  },

  updateTitle: function (e) {
    this.setState({title: e.target.value})
  },

  save: function () {
    var data = new FormData();
    data.append('command', 'save');
    data.append('type', this.props.type);

    $.each(this.state.photo, function (key, value) {
      data.append(key, value);
    });

    if (this.props.ticketId > 0) {
      data.append('ticketId', this.props.ticketId);
    } else {
      data.append('multipleId', this.props.multipleId);
    }
    data.append('candidateId', this.props.candidateId);
    data.append('firstName', this.state.firstName);
    data.append('lastName', this.state.lastName);
    data.append('title', this.state.title);

    $.ajax({
      url: 'election/Admin/Candidate',
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (data) {
        this.props.reload();
      }.bind(this),
      error: function () {
        alert('Failed to save candidate');
        this.props.reload();
      }.bind(this)
    });
  },

  render: function () {

    var saveButton = null;
    var disabledButton = (this.state.firstName.length === 0 || this.state.lastName.length === 0);

    var props = {
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };
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
            <i className="fa fa-save"></i>
            Save</button>
          &nbsp;
          <button
            className="btn btn-danger btn-sm"
            title="Cancel"
            onClick={this.props.reset}>
            <i className="fa fa-times"></i>
            Clear</button>
        </div>
      </div>
    );
  }
});

var CandidateInfo = React.createClass({

  getDefaultProps: function () {
    return {firstName: null, lastName: null, title: null, useTitle: true};
  },

  render: function () {
    var title = null;
    if (this.props.useTitle) {
      title = (<input
        type="text"
        className="form-control"
        name="title"
        value={this.props.title}
        placeholder="Position title"
        onChange={this.props.updateTitle}
        value={this.props.title}/>);
    }

    return (
      <div>
        <input
          type="text"
          className="form-control"
          name="firstName"
          value={this.props.firstName}
          placeholder="First name"
          onChange={this.props.updateFirstName}
          value={this.props.firstName}/>
        <input
          type="text"
          className="form-control"
          name="lastName"
          value={this.props.lastName}
          placeholder="Last name"
          onChange={this.props.updateLastName}
          value={this.props.lastName}/> {title}
      </div>
    );
  }
});

var Photo = React.createClass({
  getDefaultProps: function () {
    return {photo: [], picture: ''}
  },

  onDrop: function (photo) {
    this.props.update(photo);
  },

  onOpenClick: function () {
    this.refs.dropzone.open();
  },

  render: function () {
    var photo;
    var imageSrc = null;
    var name;

    if (this.props.photo.length > 0) {
      imageSrc = this.props.photo[0].preview;
      photo = (<img src={imageSrc} className="img-responsive"/>);
    } else if (this.props.picture.length) {
      photo = (<img src={this.props.picture} className="img-responsive"/>);
    } else {
      photo = (
        <div className="clickme">
          <i className="fa fa-camera fa-5x"></i><br/>
          <p>Click or drag image here</p>
        </div>
      );
    }
    return (
      <Dropzone ref="dropzone" onDrop={this.onDrop} className="dropzone text-center">
        {photo}
      </Dropzone>
    );
  }
});

export default Candidates;
