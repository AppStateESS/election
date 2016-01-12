'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Candidates = React.createClass({
    displayName: 'Candidates',

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            ticketId: 0,
            ballotId: 0
        };
    },

    render: function () {
        return React.createElement(CandidateForm, this.props);
    }

});

var CandidateForm = React.createClass({
    displayName: 'CandidateForm',

    getInitialState: function () {
        return {
            firstName: '',
            lastName: '',
            photo: []
        };
    },

    getDefaultProps: function () {
        return {
            ballotId: 0,
            ticketId: 0,
            candidateId: 0
        };
    },

    updateFirstName: function (e) {
        this.setState({
            firstName: e.target.value
        });
    },

    updateLastName: function (e) {
        this.setState({
            lastName: e.target.value
        });
    },

    updatePhoto: function (photo) {
        this.setState({
            photo: photo
        });
    },

    save: function () {
        var data = new FormData();
        data.append('command', 'save');

        $.each(this.state.photo, function (key, value) {
            data.append(key, value);
        });
        data.append('ballotId', this.props.ballotId);
        data.append('ticketId', this.props.ticketId);
        data.append('candidateId', this.props.candidateId);
        data.append('firstName', this.state.firstName);
        data.append('lastName', this.state.lastName);

        $.ajax({
            url: 'election/Admin/Candidate',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    // Success so call function to process the form
                    //this.submitForm(event, data);
                    console.log('success');
                } else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });
    },

    render: function () {
        var props = { firstName: this.state.firstName, lastName: this.state.lastName };
        return React.createElement(
            'div',
            { className: 'candidateForm text-center' },
            React.createElement(Photo, { photo: this.state.photo, update: this.updatePhoto }),
            React.createElement(CandidateName, _extends({ updateFirstName: this.updateFirstName, updateLastName: this.updateLastName }, props)),
            React.createElement(
                'div',
                { className: 'pad-top' },
                React.createElement(
                    'button',
                    { className: 'btn btn-success btn-sm', title: 'Save candidate', onClick: this.save },
                    React.createElement('i', { className: 'fa fa-save' }),
                    ' Save'
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-danger btn-sm', title: 'Cancel' },
                    React.createElement('i', { className: 'fa fa-times' }),
                    ' Clear'
                )
            )
        );
    }

});

var CandidateName = React.createClass({
    displayName: 'CandidateName',

    getDefaultProps: function () {
        return {
            firstName: null,
            lastName: null
        };
    },

    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', className: 'form-control', name: 'firstName', value: this.props.firstName, placeholder: 'First name',
                onChange: this.props.updateFirstName, value: this.props.firstName }),
            React.createElement('input', { type: 'text', className: 'form-control', name: 'firstName', value: this.props.lastName, placeholder: 'Last name',
                onChange: this.props.updateLastName, value: this.props.lastName })
        );
    }

});

var Photo = React.createClass({
    displayName: 'Photo',

    getDefaultProps: function () {
        return {
            photo: []
        };
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
            photo = React.createElement('img', { src: imageSrc, className: 'img-responsive' });
        } else {
            photo = React.createElement(
                'div',
                { className: 'clickme' },
                React.createElement('i', { className: 'fa fa-camera fa-5x' }),
                React.createElement('br', null),
                React.createElement(
                    'p',
                    null,
                    'Click or drag image here'
                )
            );
        }
        return React.createElement(
            Dropzone,
            { ref: 'dropzone', onDrop: this.onDrop, className: 'dropzone text-center' },
            photo
        );
    }
});