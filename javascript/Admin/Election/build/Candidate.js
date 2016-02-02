'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Candidates = React.createClass({
    displayName: 'Candidates',

    getInitialState: function () {
        return {
            currentForm: 0
        };
    },

    getDefaultProps: function () {
        return {
            candidates: [],
            ticketId: 0,
            multipleId: 0,
            type: 'ticket'
        };
    },

    load: function () {
        this.props.reload();
        this.setState({
            currentForm: 0
        });
    },

    setCurrentForm: function (id) {
        this.setState({
            currentForm: id
        });
    },

    delete: function (candidateId) {
        if (confirm('Are you sure you want to delete this candidate?')) {
            $.post('election/Admin/Candidate', {
                command: 'delete',
                candidateId: candidateId
            }, null, 'json').done(function (data) {
                this.load();
            }.bind(this));
        }
    },

    render: function () {
        var candidates = this.props.candidates.map(function (value) {
            if (value.id === this.state.currentForm) {
                return React.createElement(
                    'div',
                    { key: value.id, className: 'col-sm-4 col-xs-6 pad-bottom' },
                    React.createElement(CandidateForm, _extends({}, this.props, value, { candidateId: value.id, reload: this.load,
                        reset: this.setCurrentForm.bind(null, 0) }))
                );
            } else {
                return React.createElement(CandidateProfile, _extends({ key: value.id }, value, {
                    'delete': this.delete.bind(null, value.id),
                    edit: this.setCurrentForm.bind(null, value.id) }));
            }
        }.bind(this));

        if (this.state.currentForm === 0) {
            var form = React.createElement(
                'div',
                null,
                React.createElement(
                    'button',
                    { className: 'btn btn-primary', onClick: this.setCurrentForm.bind(null, -1) },
                    React.createElement('i', { className: 'fa fa-user-plus fa-5x' }),
                    React.createElement('br', null),
                    'Add candidate'
                )
            );
        } else if (this.state.currentForm === -1) {
            var form = React.createElement(CandidateForm, _extends({}, this.props, { reload: this.load, reset: this.setCurrentForm.bind(null, 0) }));
        }

        return React.createElement(
            'div',
            null,
            candidates,
            form
        );
    }

});

var CandidateProfile = React.createClass({
    displayName: 'CandidateProfile',

    getDefaultProps: function () {
        return {
            firstName: null,
            lastName: null,
            title: null,
            picture: null
        };
    },

    render: function () {
        return React.createElement(
            'div',
            { className: 'candidate-profile' },
            React.createElement(
                'div',
                { className: 'photo-matte' },
                this.props.picture.length > 0 ? React.createElement(
                    'div',
                    null,
                    React.createElement('span', { className: 'helper' }),
                    React.createElement('img', { src: this.props.picture, className: 'candidate-pic' })
                ) : React.createElement(
                    'div',
                    { className: 'no-picture text-muted' },
                    React.createElement('i', { className: 'fa fa-user fa-5x' }),
                    React.createElement('br', null),
                    'No picture'
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        this.props.firstName,
                        ' ',
                        this.props.lastName
                    ),
                    React.createElement('br', null),
                    this.props.title
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-primary', title: 'Edit candidate', onClick: this.props.edit },
                    React.createElement('i', { className: 'fa fa-edit' })
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-danger', onClick: this.props.delete, title: 'Delete candidate' },
                    React.createElement('i', { className: 'fa fa-times' })
                )
            )
        );
    }

});

var CandidateForm = React.createClass({
    displayName: 'CandidateForm',

    getInitialState: function () {
        return {
            firstName: '',
            lastName: '',
            title: '',
            photo: []
        };
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
        };
    },

    componentWillMount: function () {
        if (this.props.candidateId > 0) {
            this.setState({
                firstName: this.props.firstName,
                lastName: this.props.lastName,
                picture: this.props.picture,
                title: this.props.title
            });
        }
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

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    save: function () {
        var data = new FormData();
        data.append('command', 'save');
        data.append('type', this.props.type);

        $.each(this.state.photo, function (key, value) {
            data.append(key, value);
        });
        if (this.props.ticketId) {
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
            }.bind(this)
        });
    },

    render: function () {

        var saveButton = null;
        var disabledButton = this.state.firstName.length === 0 || this.state.lastName.length === 0;

        var props = { firstName: this.state.firstName, lastName: this.state.lastName };
        return React.createElement(
            'div',
            { className: 'candidate-form text-center' },
            React.createElement(Photo, { photo: this.state.photo, update: this.updatePhoto, picture: this.state.picture }),
            React.createElement(CandidateInfo, _extends({ updateFirstName: this.updateFirstName, updateLastName: this.updateLastName,
                updateTitle: this.updateTitle }, this.state, {
                useTitle: this.props.type == 'ticket' })),
            React.createElement(
                'div',
                { className: 'pad-top' },
                React.createElement(
                    'button',
                    { className: 'btn btn-success btn-sm', title: 'Save candidate', onClick: this.save, disabled: disabledButton },
                    React.createElement('i', { className: 'fa fa-save' }),
                    ' Save'
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-danger btn-sm', title: 'Cancel', onClick: this.props.reset },
                    React.createElement('i', { className: 'fa fa-times' }),
                    ' Clear'
                )
            )
        );
    }

});

var CandidateInfo = React.createClass({
    displayName: 'CandidateInfo',

    getDefaultProps: function () {
        return {
            firstName: null,
            lastName: null,
            title: null,
            useTitle: true
        };
    },

    render: function () {
        var title = null;
        if (this.props.useTitle) {
            title = React.createElement('input', { type: 'text', className: 'form-control', name: 'title', value: this.props.title, placeholder: 'Position title',
                onChange: this.props.updateTitle, value: this.props.title });
        }

        return React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', className: 'form-control', name: 'firstName', value: this.props.firstName, placeholder: 'First name',
                onChange: this.props.updateFirstName, value: this.props.firstName }),
            React.createElement('input', { type: 'text', className: 'form-control', name: 'lastName', value: this.props.lastName, placeholder: 'Last name',
                onChange: this.props.updateLastName, value: this.props.lastName }),
            title
        );
    }

});

var Photo = React.createClass({
    displayName: 'Photo',

    getDefaultProps: function () {
        return {
            photo: [],
            picture: ''
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
        } else if (this.props.picture.length) {
            photo = React.createElement('img', { src: this.props.picture, className: 'img-responsive' });
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