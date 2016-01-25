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

    render: function () {
        var heading = React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                null,
                'Multiple chair - ',
                this.state.itemCount,
                ' ballot',
                this.state.itemCount !== 1 ? 's' : null
            )
        );
        if (this.state.panelOpen) {
            var body = React.createElement(
                'div',
                null,
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

        var form = React.createElement(
            'button',
            { className: 'btn btn-primary', onClick: this.editRow.bind(null, 0) },
            React.createElement('i', { className: 'fa fa-plus' }),
            ' Add new multiple'
        );
        if (this.state.currentEdit === 0) {
            form = React.createElement(MultipleForm, shared);
        }

        return React.createElement(
            'div',
            null,
            form,
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
                    { className: 'btn btn-danger btn-block', onClick: this.handleDelete },
                    React.createElement('i', { className: 'fa fa-trash-o', title: 'Remove ballot' }),
                    ' Delete'
                )
            )
        );

        if (this.props.isOpen) {
            var body = React.createElement(Candidates, { type: 'multiple', multipleId: this.props.multipleId, candidates: this.state.candidates, reload: this.load });
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

var CategoryTitle = props => React.createElement(
    'span',
    null,
    categoryTypes[props.category]
);

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
                            defaultValue: this.props.title, id: 'multiple-title',
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
                        React.createElement('input', { type: 'number', className: 'form-control',
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
            defValue: '',
            handleChange: null
        };
    },

    render: function () {
        var options = electionTypes.electionTypes.map(function (value, key) {
            return React.createElement(CategoryOption, { key: key, category: value.category, subcategory: value.subcategory });
        });
        return React.createElement(
            'select',
            { className: 'form-control', defaultValue: this.props.defValue, onChange: this.props.handleChange },
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