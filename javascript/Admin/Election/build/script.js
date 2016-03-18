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
            type: 'ticket',
            showAdd: true
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
            }.bind(this)).fail(function () {
                alert('Failed to delete candidate');
            });
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

        if (this.state.currentForm === 0 && this.props.showAdd && allowChange) {
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
                    React.createElement('img', { src: this.props.picture, className: 'img-responsive candidate-pic' })
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
                    { className: 'btn btn-danger', disabled: !allowChange, onClick: this.props.delete, title: 'Delete candidate' },
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
'use strict';

var electionTypes = {};
var categoryTypes = {};

var getElectionTypes = function () {
    $.getJSON('election/Admin/Election', {
        command: 'getElectionTypes'
    }).done(function (data) {
        electionTypes = data;
        sortCategoryTypes();
    }.bind(this));
};

$(document).ready(function () {
    getElectionTypes();
});

var sortCategoryTypes = function () {
    electionTypes.electionTypes.forEach(function (value) {
        value.subcategory.forEach(function (subval) {
            categoryTypes[subval.type] = subval.name;
        });
    });
};

var Election = React.createClass({
    displayName: 'Election',

    mixins: [DateMixin],

    getInitialState: function () {
        return {
            editTitle: false,
            showDateForm: false,
            title: '',
            startDate: '',
            endDate: '',
            unixStart: 0,
            unixEnd: 0,
            past: false
        };
    },

    componentDidMount: function () {
        this.load();
        this.initStartDate();
        this.initEndDate();
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (this.state.showDateForm) {
            this.initStartDate();
            this.initEndDate();
        }
    },

    load: function () {
        // electionId loaded higher in script
        $.getJSON('election/Admin/Election', {
            command: 'getElection',
            electionId: electionId
        }).done(function (data) {
            this.setState({
                id: electionId,
                title: data.title,
                startDate: data.startDateFormatted,
                endDate: data.endDateFormatted,
                unixStart: data.startDate,
                unixEnd: data.endDate,
                editTitle: false,
                showDateForm: false
            });
        }.bind(this));
    },

    editTitle: function () {
        this.setState({
            editTitle: true
        });
    },

    cancelUpdate: function () {
        this.setState({
            editTitle: false,
            title: this.state.title
        });
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    saveTitle: function () {
        if (this.state.title.length > 0) {
            $.post('election/Admin/Election', {
                command: 'saveTitle',
                title: this.state.title,
                electionId: electionId
            }, null, 'json').done(function (data) {
                this.load();
            }.bind(this));
        }
    },

    showDateForm: function () {
        this.setState({
            showDateForm: true
        });
    },

    hideDateForm: function () {
        this.setState({
            showDateForm: false
        });
    },

    saveDates: function () {
        var error = this.hasDateErrors();
        if (error === false) {
            var conflict = this.checkForConflict();
            conflict.done(function (data) {
                if (data.conflict === false) {
                    $.post('election/Admin/Election', {
                        command: 'saveDates',
                        electionId: this.state.id,
                        startDate: this.state.unixStart,
                        endDate: this.state.unixEnd
                    }, null, 'json').done(function (data) {
                        this.load();
                    }.bind(this)).always(function () {
                        this.hideDateForm();
                    }.bind(this));
                } else {
                    $(this.refs.startDate).css('borderColor', 'red').attr('placeholder', 'Date conflict');
                    $(this.refs.endDate).css('borderColor', 'red').attr('placeholder', 'Date conflict');
                    this.setState({
                        startDate: '',
                        unixStart: 0,
                        endDate: '',
                        unixEnd: 0
                    });
                }
            }.bind(this));
        }
    },

    render: function () {
        var electionTitle = React.createElement(
            'h3',
            { className: 'election-title', title: 'Click to change title', onClick: this.editTitle },
            this.state.title
        );
        var save = null;

        if (this.state.editTitle) {
            electionTitle = React.createElement(
                'div',
                { className: 'input-group' },
                React.createElement('input', { type: 'text', className: 'form-control election-title', placeholder: 'Election title', value: this.state.title, onChange: this.updateTitle }),
                React.createElement(
                    'span',
                    { className: 'input-group-btn' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-success', title: 'Update title',
                            disabled: this.state.title.length === 0 ? true : false,
                            onClick: this.saveTitle },
                        React.createElement('i', { className: 'fa fa-save' })
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-danger', title: 'Cancel update', onClick: this.cancelUpdate },
                        React.createElement('i', { className: 'fa fa-times' })
                    )
                )
            );
        }

        if (!this.state.past) {
            if (this.state.showDateForm) {
                var date = React.createElement(
                    'div',
                    { className: 'row date-change pad-top' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-5' },
                        React.createElement(
                            'div',
                            { className: 'input-group' },
                            React.createElement('input', { placeholder: 'Voting start date and time', ref: 'startDate', type: 'text', className: 'form-control datepicker', id: 'start-date',
                                onFocus: this.resetBorder, onChange: this.changeStartDate, value: this.state.startDate }),
                            React.createElement(
                                'div',
                                { className: 'input-group-addon' },
                                React.createElement('i', { className: 'fa fa-calendar', onClick: this.showStartCalendar })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-5' },
                        React.createElement(
                            'div',
                            { className: 'input-group' },
                            React.createElement('input', { placeholder: 'Voting deadline', ref: 'endDate', type: 'text', className: 'form-control datepicker', id: 'end-date',
                                onFocus: this.resetBorder, onChange: this.changeEndDate, value: this.state.endDate }),
                            React.createElement(
                                'div',
                                { className: 'input-group-addon' },
                                React.createElement('i', { className: 'fa fa-calendar', onClick: this.showEndCalendar })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-2' },
                        React.createElement(
                            'button',
                            { className: 'btn btn-success btn-sm', onClick: this.saveDates },
                            React.createElement('i', { className: 'fa fa-save' })
                        ),
                        ' ',
                        React.createElement(
                            'button',
                            { className: 'btn btn-danger btn-sm', onClick: this.hideDateForm },
                            React.createElement('i', { className: 'fa fa-times' })
                        )
                    )
                );
            } else {
                var date = React.createElement(
                    'h4',
                    { onClick: this.showDateForm, title: 'Click to change dates' },
                    React.createElement(
                        'span',
                        { className: 'date-edit' },
                        this.state.startDate
                    ),
                    ' - ',
                    React.createElement(
                        'span',
                        { className: 'date-edit' },
                        this.state.endDate
                    )
                );
            }
        } else {
            var date = React.createElement(
                'h4',
                { className: 'date-view' },
                this.state.startDate,
                ' - ',
                this.state.endDate
            );
        }

        var details = React.createElement(
            'div',
            { className: 'text-center pad-top' },
            React.createElement('i', { className: 'fa fa-spinner fa-spin fa-5x' })
        );
        if (this.state.id) {
            details = React.createElement(
                'div',
                { className: 'pad-top' },
                React.createElement(SingleBallot, { electionId: this.state.id }),
                React.createElement(MultipleBallot, { electionId: this.state.id }),
                React.createElement(Referendum, { electionId: this.state.id })
            );
        }

        return React.createElement(
            'div',
            null,
            electionTitle,
            date,
            allowChange ? null : React.createElement(
                'p',
                null,
                React.createElement(
                    'em',
                    null,
                    'This is an ongoing election. Some options are disabled.'
                )
            ),
            React.createElement(
                'div',
                null,
                details
            )
        );
    }
});

ReactDOM.render(React.createElement(Election, null), document.getElementById('election-dashboard'));
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var MultipleBallot = React.createClass({
    displayName: 'MultipleBallot',

    mixins: ['Panel'],

    getInitialState: function () {
        return {
            multipleList: [],
            itemCount: 0,
            panelOpen: false,
            showForm: false,
            categoryList: []
        };
    },

    getDefaultProps: function () {
        return {
            electionId: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Multiple', {
            command: 'list',
            electionId: this.props.electionId
        }).done(function (data) {
            this.setState({
                itemCount: data.length,
                multipleList: data
            });
        }.bind(this));
    },

    toggleExpand: function () {
        this.setState({
            panelOpen: !this.state.panelOpen
        });
    },

    showForm: function (e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            panelOpen: true,
            showForm: true
        });
    },

    hideForm: function () {
        this.setState({
            showForm: false
        });
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-9' },
                React.createElement(
                    'h4',
                    null,
                    'Multiple chair - ',
                    this.state.itemCount,
                    ' ballot',
                    this.state.itemCount !== 1 ? 's' : null
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-primary', onClick: this.showForm, disabled: !allowChange },
                    React.createElement('i', { className: 'fa fa-plus' }),
                    ' New ballot'
                )
            )
        );
        if (this.state.panelOpen) {
            var form = null;
            if (this.state.showForm) {
                form = React.createElement(MultipleForm, { electionId: this.props.electionId, reload: this.load, hideForm: this.hideForm });
            }
            var body = React.createElement(
                'div',
                null,
                form,
                React.createElement(MultipleList, { electionId: this.props.electionId, reload: this.load, listing: this.state.multipleList })
            );
            var arrow = React.createElement('i', { className: 'fa fa-chevron-up' });
        } else {
            var body = null;
            var arrow = React.createElement('i', { className: 'fa fa-chevron-down' });
        }

        var footer = React.createElement(
            'div',
            { className: 'text-center pointer', onClick: this.toggleExpand },
            arrow
        );

        return React.createElement(Panel, { type: 'info', heading: heading, body: body, footer: footer,
            headerClick: this.toggleExpand, footerClick: this.toggleExpand });
    }
});

var MultipleList = React.createClass({
    displayName: 'MultipleList',

    getInitialState: function () {
        return {
            currentEdit: -1,
            openMultiple: 0
        };
    },

    getDefaultProps: function () {
        return {
            listing: [],
            reload: null,
            electionId: 0
        };
    },

    editRow: function (multipleId) {
        this.setState({
            currentEdit: multipleId
        });
    },

    openMultiple: function (multipleId) {
        if (multipleId === this.state.openMultiple) {
            multipleId = 0;
        }

        this.setState({
            openMultiple: multipleId
        });
    },

    render: function () {
        var multipleList = React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'No multiple chair ballots found.'
            )
        );

        var shared = {
            electionId: this.props.electionId,
            reload: this.props.reload,
            hideForm: this.editRow.bind(null, -1),
            openMultiple: this.openMultiple
        };

        var multipleList = this.props.listing.map(function (value) {
            if (value.id === this.state.currentEdit) {
                return React.createElement(MultipleForm, _extends({ key: value.id }, value, {
                    multipleId: value.id }, shared));
            } else {
                return React.createElement(MultipleListRow, _extends({ key: value.id }, value, {
                    isOpen: this.state.openMultiple === value.id,
                    multipleId: value.id, edit: this.editRow.bind(null, value.id)
                }, shared));
            }
        }.bind(this));

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'pad-top' },
                multipleList
            )
        );
    }

});

var MultipleListRow = React.createClass({
    displayName: 'MultipleListRow',

    mixins: ['Panel'],

    getDefaultProps: function () {
        return {
            electionId: 0,
            reload: null,
            hideForm: null,
            multipleId: 0,
            title: '',
            seatNumber: 0,
            category: '',
            isOpen: true
        };
    },

    getInitialState: function () {
        return {
            formId: -1,
            candidates: [],
            candidateCount: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Candidate', {
            command: 'candidateList',
            multipleId: this.props.multipleId
        }).done(function (data) {
            this.setState({
                candidates: data,
                candidateCount: data.length
            });
        }.bind(this));
    },

    toggleExpand: function () {
        this.props.openMultiple(this.props.multipleId);
    },

    handleDelete: function (event) {
        if (confirm('Are you sure you want to delete this ballot?')) {
            $.post('election/Admin/Multiple', {
                command: 'delete',
                ballotId: this.props.id
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this));
        }
    },

    edit: function (e) {
        e.stopPropagation();
        this.props.edit();
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-9' },
                React.createElement(
                    'div',
                    { className: 'ballot-title' },
                    this.props.title,
                    ' - ',
                    this.state.candidateCount,
                    ' candidate',
                    this.state.candidateCount !== 1 ? 's' : null
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Available seats:'
                    ),
                    ' ',
                    this.props.seatNumber
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Voting category:'
                    ),
                    ' ',
                    React.createElement(CategoryTitle, { category: this.props.category })
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                React.createElement(
                    'button',
                    { className: 'btn btn-success btn-block', onClick: this.edit, title: 'Edit ballot' },
                    React.createElement('i', { className: 'fa fa-edit' }),
                    ' Edit'
                ),
                React.createElement(
                    'button',
                    { disabled: !allowChange, className: 'btn btn-danger btn-block', onClick: this.handleDelete },
                    React.createElement('i', { className: 'fa fa-trash-o', title: 'Remove ballot' }),
                    ' Delete'
                )
            )
        );

        if (this.props.isOpen) {
            var body = React.createElement(Candidates, { type: 'multiple', electionId: this.props.electionId, multipleId: this.props.multipleId,
                candidates: this.state.candidates, reload: this.load });
            var arrow = React.createElement('i', { className: 'fa fa-chevron-up' });
        } else {
            var body = null;
            var arrow = React.createElement('i', { className: 'fa fa-chevron-down' });
        }

        var footer = React.createElement(
            'div',
            { className: 'text-center pointer' },
            arrow
        );

        return React.createElement(Panel, { type: 'success', heading: heading,
            body: body, footer: footer,
            footerClick: this.toggleExpand,
            headerClick: this.toggleExpand });
    }

});

var CategoryTitle = function (props) {
    return React.createElement(
        'span',
        null,
        categoryTypes[props.category]
    );
};

var MultipleForm = React.createClass({
    displayName: 'MultipleForm',

    getInitialState: function () {
        return {
            title: '',
            seatNumber: '2',
            category: ''
        };
    },

    getDefaultProps: function () {
        return {
            multipleId: 0,
            electionId: 0,
            title: '',
            seatNumber: '2',
            category: '',
            hideForm: null,
            reload: null
        };
    },

    componentWillMount: function () {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    componentDidMount: function () {
        if (!this.state.category.length) {
            this.setState({
                category: electionTypes.electionTypes[0]['subcategory'][0].type
            });
        }
    },

    copyPropsToState: function () {
        this.setState({
            title: this.props.title,
            seatNumber: this.props.seatNumber,
            category: this.props.category
        });
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    updateSeatNumber: function (e) {
        var seatNumber = e.target.value;
        if (seatNumber < 1) {
            e.target.value = '1';
            return;
        }
        this.setState({
            seatNumber: e.target.value
        });
    },

    updateCategory: function (e) {
        this.setState({
            category: e.target.value
        });
    },

    checkForErrors: function () {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.multipleTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }
        if (this.state.seatNumber < 1) {
            error = true;
        }

        return error;
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Multiple', {
                command: 'save',
                multipleId: this.props.multipleId,
                electionId: this.props.electionId,
                title: this.state.title,
                seatNumber: this.state.seatNumber,
                category: this.state.category
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this)).always(function () {
                this.props.hideForm();
            }.bind(this));
        }
    },

    resetBorder: function (node) {
        $(node.target).removeAttr('style');
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-9' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-12' },
                        React.createElement(
                            'label',
                            null,
                            'Ballot title (e.g. Sophomore Senate)'
                        ),
                        React.createElement('input', { ref: 'multipleTitle', type: 'text', className: 'form-control',
                            defaultValue: this.props.title, id: 'multiple-title', min: '2',
                            onFocus: this.resetBorder, onChange: this.updateTitle })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-4' },
                        React.createElement(
                            'label',
                            null,
                            'Available seats'
                        ),
                        React.createElement('input', { ref: 'seatNumber', type: 'number', className: 'form-control',
                            onChange: this.updateSeatNumber,
                            defaultValue: this.props.seatNumber })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-8' },
                        React.createElement(
                            'label',
                            null,
                            'Filter'
                        ),
                        React.createElement(CategoryList, { 'default': this.state.category, handleChange: this.updateCategory })
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'button',
                        { className: 'btn btn-block btn-primary', onClick: this.save },
                        React.createElement('i', { className: 'fa fa-save' }),
                        ' Save'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-block btn-danger', onClick: this.props.hideForm },
                        React.createElement('i', { className: 'fa fa-times' }),
                        ' Cancel'
                    )
                )
            )
        );

        return React.createElement(Panel, { type: 'success', heading: heading });
    }

});

var CategoryList = React.createClass({
    displayName: 'CategoryList',


    getDefaultProps: function () {
        return {
            default: '',
            handleChange: null
        };
    },

    render: function () {
        var options = electionTypes.electionTypes.map(function (value, key) {
            return React.createElement(CategoryOption, { key: key, category: value.category, subcategory: value.subcategory });
        });
        return React.createElement(
            'select',
            { className: 'form-control', defaultValue: this.props.defValue, onChange: this.props.handleChange, value: this.props.default },
            options
        );
    }
});

var CategoryOption = React.createClass({
    displayName: 'CategoryOption',


    getDefaultProps: function () {
        return {
            category: '',
            subcategory: []
        };
    },

    render: function () {
        var suboptions = this.props.subcategory.map(function (value, key) {
            return React.createElement(
                'option',
                { key: key, value: value.type },
                value.name
            );
        }.bind(this));
        return React.createElement(
            'optgroup',
            { label: this.props.category },
            suboptions
        );
    }

});
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Referendum = React.createClass({
    displayName: 'Referendum',

    getInitialState: function () {
        return {
            referendumList: [],
            itemCount: 0,
            showForm: false,
            panelOpen: false
        };
    },

    getDefaultProps: function () {
        return {
            electionId: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Referendum', {
            command: 'list',
            electionId: this.props.electionId
        }).done(function (data) {
            this.setState({
                itemCount: data.length,
                referendumList: data
            });
        }.bind(this));
    },

    toggleExpand: function () {
        this.setState({
            panelOpen: !this.state.panelOpen
        });
    },

    showForm: function (e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            panelOpen: true,
            showForm: true
        });
    },

    hideForm: function () {
        this.setState({
            showForm: false
        });
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-8' },
                React.createElement(
                    'h4',
                    null,
                    'Referendum - ',
                    this.state.itemCount,
                    ' measure',
                    this.state.itemCount !== 1 ? 's' : null
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-4' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-primary', onClick: this.showForm, disabled: !allowChange },
                    React.createElement('i', { className: 'fa fa-plus' }),
                    ' New referendum'
                )
            )
        );
        if (this.state.panelOpen) {
            var form = null;
            if (this.state.showForm) {
                form = React.createElement(ReferendumForm, { electionId: this.props.electionId, reload: this.load, hideForm: this.hideForm });
            }
            var body = React.createElement(
                'div',
                null,
                form,
                React.createElement(ReferendumList, { electionId: this.props.electionId, reload: this.load,
                    listing: this.state.referendumList })
            );
            var arrow = React.createElement('i', { className: 'fa fa-chevron-up' });
        } else {
            var body = null;
            var arrow = React.createElement('i', { className: 'fa fa-chevron-down' });
        }

        var footer = React.createElement(
            'div',
            { className: 'text-center pointer', onClick: this.toggleExpand },
            arrow
        );

        return React.createElement(Panel, { type: 'info', heading: heading, body: body, footer: footer,
            headerClick: this.toggleExpand, footerClick: this.toggleExpand });
    }

});

var ReferendumList = React.createClass({
    displayName: 'ReferendumList',

    getInitialState: function () {
        return {
            currentEdit: -1,
            openReferendum: 0
        };
    },

    getDefaultProps: function () {
        return {
            listing: [],
            reload: null,
            electionId: 0
        };
    },

    editRow: function (id) {
        this.setState({
            currentEdit: id
        });
    },

    openReferendum: function (referendumId) {
        if (referendumId === this.state.openreferendum) {
            referendumId = 0;
        }

        this.setState({
            openReferendum: referendumId
        });
    },

    render: function () {
        var listing = React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'No referendums found.'
            )
        );

        var shared = {
            electionId: this.props.electionId,
            reload: this.props.reload,
            hideForm: this.editRow.bind(null, -1),
            openReferendum: this.openReferendum
        };

        var referendumList = this.props.listing.map(function (value) {
            if (value.id === this.state.currentEdit) {
                return React.createElement(ReferendumForm, _extends({ key: value.id }, value, {
                    referendumId: value.id }, shared));
            } else {
                return React.createElement(ReferendumListRow, _extends({ key: value.id }, value, {
                    isOpen: this.state.openReferendum === value.id,
                    referendumId: value.id, edit: this.editRow.bind(null, value.id)
                }, shared));
            }
        }.bind(this));

        return React.createElement(
            'div',
            { className: 'pad-top' },
            referendumList
        );
    }
});

var ReferendumForm = React.createClass({
    displayName: 'ReferendumForm',

    getInitialState: function () {
        return {
            title: '',
            description: ''
        };
    },

    getDefaultProps: function () {
        return {
            referendumId: 0,
            electionId: 0,
            title: '',
            description: '',
            hideForm: null,
            reload: null
        };
    },

    componentWillMount: function () {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function () {
        this.setState({
            title: this.props.title,
            description: this.props.description
        });
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    updateDescription: function (e) {
        this.setState({
            description: e.target.value
        });
    },

    checkForErrors: function () {
        var error = false;
        if (!this.state.title.length) {
            $(this.refs.referendumTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        if (!this.state.description.length) {
            $(this.refs.referendumDescription).css('borderColor', 'red').attr('placeholder', 'Please enter a description');
            error = true;
        }

        return error;
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Referendum', {
                command: 'save',
                electionId: this.props.electionId,
                referendumId: this.props.referendumId,
                title: this.state.title,
                description: this.state.description
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this)).always(function () {
                this.props.hideForm();
            }.bind(this));
        }
    },

    resetBorder: function (node) {
        $(node.target).removeAttr('style');
    },

    render: function () {
        var heading = React.createElement(
            'div',
            null,
            React.createElement('input', { ref: 'referendumTitle', type: 'text', className: 'form-control',
                defaultValue: this.props.title, id: 'referendum-title',
                onFocus: this.resetBorder, onChange: this.updateTitle,
                placeholder: 'Title of referendum' })
        );

        var body = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                null,
                React.createElement('textarea', { ref: 'referendumDescription', className: 'form-control',
                    defaultValue: this.props.description, id: 'referendum-description',
                    onFocus: this.resetBorder, onChange: this.updateDescription,
                    placeholder: 'Description of referendum' })
            ),
            React.createElement(
                'div',
                { className: 'pad-top' },
                React.createElement(
                    'button',
                    { className: 'btn btn-primary pull-left pad-right', onClick: this.save },
                    React.createElement('i', { className: 'fa fa-save' }),
                    ' Save'
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-danger', onClick: this.props.hideForm },
                    React.createElement('i', { className: 'fa fa-times' }),
                    ' Cancel'
                )
            )
        );

        return React.createElement(Panel, { type: 'success', heading: heading, body: body });
    }

});

var ReferendumListRow = React.createClass({
    displayName: 'ReferendumListRow',

    mixins: ['Panel'],

    getInitialState: function () {
        return {
            formId: -1
        };
    },

    getDefaultProps: function () {
        return {
            electionId: 0,
            reload: null,
            hideForm: null,
            referendumId: 0,
            title: '',
            description: '',
            isOpen: true,
            edit: null,
            openReferendum: null
        };
    },

    deleteReferendum: function () {
        if (confirm('Are you sure you want to delete this referendum?')) {
            $.post('election/Admin/Referendum', {
                command: 'delete',
                referendumId: this.props.referendumId
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this));
        }
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-8' },
                React.createElement(
                    'h3',
                    null,
                    this.props.title
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-4 text-right' },
                React.createElement(
                    'button',
                    { className: 'btn btn-success pad-right', onClick: this.props.edit },
                    React.createElement('i', { className: 'fa fa-edit' }),
                    ' Edit'
                ),
                React.createElement(
                    'button',
                    { disabled: !allowChange, className: 'btn btn-danger', onClick: this.deleteReferendum },
                    React.createElement('i', { className: 'fa fa-trash-o' }),
                    ' Delete'
                )
            )
        );

        var body = React.createElement(
            'p',
            null,
            this.props.description.split("\n").map(function (item, i) {
                return React.createElement(
                    'span',
                    { key: i },
                    item,
                    React.createElement('br', null)
                );
            })
        );
        return React.createElement(Panel, { type: 'success', heading: heading,
            body: body });
    }

});
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var SingleBallot = React.createClass({
    displayName: 'SingleBallot',

    mixins: ['Panel'],

    getInitialState: function () {
        return {
            singleList: [],
            itemCount: 0,
            showForm: false,
            panelOpen: true
        };
    },

    getDefaultProps: function () {
        return {
            electionId: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Single', {
            command: 'list',
            electionId: this.props.electionId
        }).done(function (data) {
            this.setState({
                itemCount: data.length,
                singleList: data
            });
        }.bind(this));
    },

    toggleExpand: function () {
        this.setState({
            panelOpen: !this.state.panelOpen
        });
    },

    showForm: function (e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            panelOpen: true,
            showForm: true
        });
    },

    hideForm: function () {
        this.setState({
            showForm: false
        });
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-9' },
                React.createElement(
                    'h4',
                    null,
                    'Single chair - ',
                    this.state.itemCount,
                    ' ballot',
                    this.state.itemCount !== 1 ? 's' : null
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-primary', disabled: !allowChange, onClick: this.showForm },
                    React.createElement('i', { className: 'fa fa-plus' }),
                    ' New ballot'
                )
            )
        );
        if (this.state.panelOpen) {
            var form = null;
            if (this.state.showForm) {
                form = React.createElement(SingleBallotForm, { electionId: this.props.electionId, reload: this.load, hideForm: this.hideForm });
            }
            var body = React.createElement(
                'div',
                null,
                form,
                React.createElement(SingleList, { electionId: this.props.electionId, reload: this.load, hideForm: this.hideForm, listing: this.state.singleList })
            );
            var arrow = React.createElement('i', { className: 'fa fa-chevron-up' });
        } else {
            var body = null;
            var arrow = React.createElement('i', { className: 'fa fa-chevron-down' });
        }

        var footer = React.createElement(
            'div',
            { className: 'text-center pointer', onClick: this.toggleExpand },
            arrow
        );

        return React.createElement(Panel, { type: 'info', heading: heading, body: body, footer: footer,
            headerClick: this.toggleExpand, footerClick: this.toggleExpand });
    }

});

var SingleList = React.createClass({
    displayName: 'SingleList',

    getInitialState: function () {
        return {
            currentEdit: -1,
            openSingle: 0
        };
    },

    getDefaultProps: function () {
        return {
            listing: [],
            reload: null,
            electionId: 0
        };
    },

    setCurrentEdit: function (singleId) {
        this.props.hideForm();
        this.setState({
            currentEdit: singleId
        });
    },

    openSingle: function (singleId) {
        if (singleId === this.state.openSingle) {
            singleId = 0;
        }

        this.setState({
            openSingle: singleId
        });
    },

    componentDidUpdate: function (prevProps, prevState) {},

    render: function () {
        var singleList = React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'No single ballots found.'
            )
        );

        var shared = {
            electionId: this.props.electionId,
            reload: this.props.reload,
            hideForm: this.setCurrentEdit.bind(null, -1),
            openSingle: this.openSingle
        };

        var singleList = this.props.listing.map(function (value) {
            if (value.id === this.state.currentEdit) {
                return React.createElement(SingleBallotForm, _extends({ key: value.id }, value, {
                    singleId: value.id }, shared));
            } else {
                return React.createElement(SingleListRow, _extends({ key: value.id }, value, {
                    isOpen: this.state.openSingle === value.id,
                    singleId: value.id, edit: this.setCurrentEdit.bind(null, value.id)
                }, shared));
            }
        }.bind(this));

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'pad-top' },
                singleList
            )
        );
    }

});

var SingleListRow = React.createClass({
    displayName: 'SingleListRow',

    mixins: ['Panel'],

    getDefaultProps: function () {
        return {
            electionId: 0,
            reload: null,
            hideForm: null,
            singleId: 0,
            title: '',
            isOpen: true
        };
    },

    getInitialState: function () {
        return {
            formId: -1,
            tickets: [],
            ticketCount: 0
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Ticket', {
            command: 'list',
            singleId: this.props.singleId
        }).done(function (data) {
            this.setState({
                tickets: data,
                ticketCount: data.length
            });
        }.bind(this));
    },

    toggleExpand: function () {
        this.props.openSingle(this.props.singleId);
    },

    handleDelete: function (event) {
        if (confirm('Are you sure you want to delete this ballot?')) {
            $.post('election/Admin/Single', {
                command: 'delete',
                singleId: this.props.id
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this));
        }
    },

    edit: function (e) {
        e.stopPropagation();
        this.props.edit();
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                    'div',
                    { className: 'ballot-title' },
                    this.props.title,
                    ' - ',
                    this.state.ticketCount,
                    ' ticket',
                    this.state.ticketCount !== 1 ? 's' : null
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                    'div',
                    { className: 'pull-right' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-success pad-right', onClick: this.edit, title: 'Edit ballot' },
                        React.createElement('i', { className: 'fa fa-edit' }),
                        ' Edit'
                    ),
                    React.createElement(
                        'button',
                        { disabled: !allowChange, className: 'btn btn-danger', onClick: this.handleDelete },
                        React.createElement('i', { className: 'fa fa-trash-o', title: 'Remove ballot' }),
                        ' Delete'
                    )
                )
            )
        );

        if (this.props.isOpen) {
            var body = React.createElement(
                'div',
                null,
                React.createElement(Tickets, { singleId: this.props.singleId, tickets: this.state.tickets, load: this.load })
            );
            var arrow = React.createElement('i', { className: 'fa fa-chevron-up' });
        } else {
            var body = null;
            var arrow = React.createElement('i', { className: 'fa fa-chevron-down' });
        }

        var footer = React.createElement(
            'div',
            { className: 'text-center pointer' },
            arrow
        );

        return React.createElement(Panel, { type: 'success', heading: heading,
            body: body, footer: footer,
            footerClick: this.toggleExpand,
            headerClick: this.toggleExpand });
    }

});

var SingleBallotForm = React.createClass({
    displayName: 'SingleBallotForm',


    getInitialState: function () {
        return {
            title: ''
        };
    },

    getDefaultProps: function () {
        return {
            singleId: 0,
            electionId: 0,
            title: '',
            hideForm: null,
            reload: null
        };
    },

    componentWillMount: function () {
        if (this.props.id) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function () {
        this.setState({
            title: this.props.title
        });
    },

    updateTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    checkForErrors: function () {
        var error = false;
        if (this.state.title.length === 0) {
            $(this.refs.ballotTitle).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        return error;
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false) {
            $.post('election/Admin/Single', {
                command: 'save',
                singleId: this.props.singleId,
                electionId: this.props.electionId,
                title: this.state.title
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this)).fail(function () {
                alert('Could not save single chair ballot');
            }).always(function () {
                this.props.hideForm();
            }.bind(this));
        }
    },

    resetBorder: function (node) {
        $(node.target).removeAttr('style');
    },

    render: function () {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-8' },
                React.createElement('input', { ref: 'singleTitle', type: 'text', className: 'form-control',
                    defaultValue: this.props.title, id: 'single-title',
                    onFocus: this.resetBorder, onChange: this.updateTitle,
                    placeholder: 'Ballot title (e.g. President/Vice President)' })
            ),
            React.createElement(
                'div',
                { className: 'col-sm-4' },
                React.createElement(
                    'div',
                    { className: 'pull-right' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-primary pad-right', onClick: this.save },
                        React.createElement('i', { className: 'fa fa-save' }),
                        ' Save'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-danger', onClick: this.props.hideForm },
                        React.createElement('i', { className: 'fa fa-times' }),
                        ' Cancel'
                    )
                )
            )
        );

        return React.createElement(Panel, { type: 'success', heading: heading });
    }
});
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Tickets = React.createClass({
    displayName: 'Tickets',

    getInitialState: function () {
        return {
            ticketFormId: -1
        };
    },

    getDefaultProps: function () {
        return {
            singleId: 0,
            tickets: []
        };
    },

    editFormId: function (ticketId) {
        this.setState({
            ticketFormId: ticketId
        });
    },

    delete: function (ticketId) {
        if (confirm('Are you sure you want to delete this ticket?')) {
            $.post('election/Admin/Ticket', {
                command: 'delete',
                ticketId: ticketId
            }, null, 'json').done(function (data) {
                this.props.load();
            }.bind(this)).fail(function () {
                alert('Unable to delete this ticket.');
                this.props.load();
            });
        }
    },

    render: function () {

        var shared = {
            close: this.editFormId.bind(null, -1),
            load: this.props.load,
            singleId: this.props.singleId
        };
        var form = null;
        if (this.state.ticketFormId === 0) {
            form = React.createElement(TicketForm, _extends({}, shared, { singleId: this.props.singleId }));
        } else {
            form = React.createElement(
                'button',
                { disabled: !allowChange, className: 'btn btn-primary', onClick: this.editFormId.bind(null, 0) },
                React.createElement('i', { className: 'fa fa-plus' }),
                ' Add a new ticket'
            );
        }

        var ticketList = React.createElement(
            'div',
            null,
            'No tickets yet!'
        );

        if (this.props.tickets.length > 0) {
            ticketList = this.props.tickets.map(function (value) {
                if (value.id === this.state.ticketFormId) {
                    return React.createElement(TicketForm, _extends({ key: value.id, ticketId: value.id }, value, shared));
                } else {
                    return React.createElement(TicketRow, _extends({ key: value.id }, value, { handleEdit: this.editFormId.bind(null, value.id), handleDelete: this.delete.bind(null, value.id) }));
                }
            }.bind(this));
        }

        return React.createElement(
            'div',
            null,
            form,
            React.createElement(
                'div',
                { className: 'pad-top' },
                ticketList
            )
        );
    }
});

var TicketForm = React.createClass({
    displayName: 'TicketForm',

    getInitialState: function () {
        return {
            title: null,
            siteAddress: null,
            platform: null,
            siteAddressError: false
        };
    },

    getDefaultProps: function () {
        return {
            close: null,
            load: null,
            singleId: 0,
            ticketId: 0,
            title: null,
            siteAddress: null,
            platform: null
        };
    },

    componentWillMount: function () {
        if (this.props.id > 0) {
            this.copyPropsToState();
        }
    },

    copyPropsToState: function () {
        this.setState({
            title: this.props.title,
            siteAddress: this.props.siteAddress,
            platform: this.props.platform
        });
    },

    checkForErrors: function () {
        var error = false;

        var title = this.refs.title.value;
        if (title.length === 0) {
            $(this.refs.title).css('borderColor', 'red').attr('placeholder', 'Please enter a title');
            error = true;
        }

        return error;
    },

    checkUrl: function () {
        if (this.state.siteAddress && this.state.siteAddress.length > 0) {
            $.getJSON('election/Admin/Ticket', {
                command: 'checkUrl',
                checkUrl: this.state.siteAddress
            }).done(function (data) {
                if (!data.success || data.success === false) {
                    this.setState({
                        siteAddressError: true
                    });
                    $(this.refs.siteAddress).css('borderColor', 'red');
                    return false;
                } else {
                    this.setState({
                        siteAddressError: false
                    });
                    $(this.refs.siteAddress).css('borderColor', 'inherit');
                    return true;
                }
            }.bind(this));
        } else {
            this.setState({
                siteAddressError: false
            });
            $(this.refs.siteAddress).css('borderColor', 'inherit');
            return true;
        }
    },

    save: function () {
        var error = this.checkForErrors();
        if (error === false && this.state.siteAddressError === false) {
            $.post('election/Admin/Ticket', {
                command: 'save',
                singleId: this.props.singleId,
                ticketId: this.props.ticketId,
                title: this.state.title,
                siteAddress: this.state.siteAddress,
                platform: this.state.platform
            }, null, 'json').done(function (data) {
                this.props.load();
            }.bind(this)).always(function () {
                this.props.close();
            }.bind(this)).fail(function () {
                alert('Sorry but an error occurred when trying to save your ticket.');
            });
        }
    },

    changeTitle: function (e) {
        this.setState({
            title: e.target.value
        });
    },

    changeSiteAddress: function (e) {
        var siteAddress = e.target.value;
        if (siteAddress.length === 0) {
            this.setState({
                siteAddressError: false
            });
        }
        this.setState({
            siteAddress: siteAddress
        });
    },

    changePlatform: function (e) {
        this.setState({
            platform: e.target.value
        });
    },

    resetBorder: function (e) {
        $(e.target).css('borderColor', 'inherit');
    },

    render: function () {
        var body = React.createElement(
            'div',
            { className: 'col-xs-12 col-sm-8' },
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'label',
                        { htmlFor: 'title', className: 'control-label pad-right' },
                        'Title:'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-10' },
                    React.createElement('input', { ref: 'title', type: 'text', className: 'form-control', onFocus: this.resetBorder,
                        placeholder: 'Candidate last names (e.g. Jones / Smith)', onChange: this.changeTitle,
                        value: this.state.title })
                )
            ),
            React.createElement(
                'div',
                { className: 'row pad-top' },
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'label',
                        { htmlFor: 'siteAddress', className: 'control-label pad-right' },
                        'Site address:'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-10' },
                    React.createElement('input', { ref: 'siteAddress', type: 'text', className: 'form-control',
                        placeholder: 'http://siteaddress.com', onFocus: this.resetBorder, onBlur: this.checkUrl, onChange: this.changeSiteAddress,
                        value: this.state.siteAddress }),
                    this.state.siteAddressError ? React.createElement(
                        'div',
                        { className: 'text-danger' },
                        'Site address format not accepted.'
                    ) : null
                )
            ),
            React.createElement(
                'div',
                { className: 'row pad-top' },
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'label',
                        { htmlFor: 'platform', className: 'control-label pad-right' },
                        'Platform:'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-10' },
                    React.createElement('textarea', { ref: 'platform', className: 'form-control', onFocus: this.resetBorder,
                        placeholder: 'Ticket\'s election statement', onChange: this.changePlatform,
                        value: this.state.platform, maxLength: 500 }),
                    React.createElement(
                        'span',
                        null,
                        '500 character limit'
                    )
                )
            ),
            React.createElement('hr', null),
            React.createElement(
                'button',
                { className: 'btn btn-primary pad-right', onClick: this.save, disabled: this.state.siteAddressError },
                React.createElement('i', { className: 'fa fa-save' }),
                ' Save ticket'
            ),
            React.createElement(
                'button',
                { className: 'btn btn-danger', onClick: this.props.close },
                React.createElement('i', { className: 'fa fa-times' }),
                ' Cancel'
            )
        );

        return React.createElement(
            'div',
            null,
            React.createElement(Panel, { body: body })
        );
    }
});

var TicketRow = React.createClass({
    displayName: 'TicketRow',

    mixins: ['Panel'],

    getInitialState: function () {
        return {
            candidates: []
        };
    },

    getDefaultProps: function () {
        return {
            id: 0,
            title: null,
            platform: '',
            siteAddress: '',
            handleDelete: null
        };
    },

    componentDidMount: function () {
        this.load();
    },

    load: function () {
        $.getJSON('election/Admin/Candidate', {
            command: 'ticketList',
            ticketId: this.props.id
        }).done(function (data) {
            this.setState({
                candidates: data
            });
        }.bind(this));
    },

    render: function () {
        var platform = React.createElement(
            'em',
            null,
            'No platform'
        );
        if (this.props.platform.length > 0) {
            platform = React.createElement(
                'p',
                null,
                this.props.platform.split("\n").map(function (item, i) {
                    return React.createElement(
                        'span',
                        { key: i },
                        item,
                        React.createElement('br', null)
                    );
                })
            );
        }
        var showAdd = this.state.candidates.length < 2;

        var body = React.createElement(
            'div',
            { className: 'ticket-form-view' },
            React.createElement(
                'div',
                { className: 'change-buttons' },
                React.createElement(
                    'button',
                    { className: 'btn btn-sm btn-success', 'data-tid': this.props.id, onClick: this.props.handleEdit, title: 'Edit ticket' },
                    React.createElement('i', { className: 'fa fa-lg fa-edit' }),
                    ' Edit ticket'
                ),
                React.createElement(
                    'button',
                    { disabled: !allowChange, className: 'btn btn-sm btn-danger', onClick: this.props.handleDelete, title: 'Delete ticket' },
                    React.createElement('i', { className: 'fa fa-lg fa-trash-o' }),
                    ' Delete ticket'
                )
            ),
            React.createElement(
                'div',
                { className: 'ticket-title' },
                this.props.title
            ),
            React.createElement(
                'div',
                null,
                platform,
                React.createElement(
                    'div',
                    null,
                    this.props.siteAddress.length ? React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'strong',
                            null,
                            'Web site:'
                        ),
                        ' ',
                        React.createElement(
                            'a',
                            { href: this.props.siteAddress, target: '_blank' },
                            this.props.siteAddress
                        )
                    ) : React.createElement(
                        'em',
                        null,
                        'No website'
                    )
                )
            ),
            React.createElement('hr', null),
            React.createElement(Candidates, { type: 'ticket', candidates: this.state.candidates, singleId: this.props.singleId, ticketId: this.props.id, reload: this.load, showAdd: showAdd })
        );

        return React.createElement(
            'div',
            null,
            React.createElement(Panel, { body: body })
        );
    }

});
