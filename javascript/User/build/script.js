'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Panel = React.createClass({
    displayName: 'Panel',

    getDefaultProps: function getDefaultProps() {
        return {
            type: 'default',
            heading: '',
            body: '',
            footer: '',
            footerClick: null,
            headerClick: null
        };
    },

    render: function render() {
        var heading = null;
        if (this.props.heading) {
            heading = React.createElement(
                'div',
                { className: 'panel-heading', onClick: this.props.headerClick },
                this.props.heading
            );
        }

        var body = null;
        if (this.props.body) {
            body = React.createElement(
                'div',
                { className: 'panel-body' },
                this.props.body
            );
        }

        var footer = null;
        if (this.props.footer) {
            footer = React.createElement(
                'div',
                { className: 'panel-footer', onClick: this.props.footerClick },
                this.props.footer
            );
        }

        var panelType = 'panel panel-' + this.props.type;
        return React.createElement(
            'div',
            { className: panelType },
            heading,
            React.createElement(
                ReactCSSTransitionGroup,
                { transitionName: 'expand', transitionEnterTimeout: 500, transitionLeaveTimeout: 500 },
                body
            ),
            footer
        );
    }
});

var BreakIt = function BreakIt(text) {
    if (typeof text === 'undefined') {
        throw 'BreakIt text parameter is undefined';
    }
    var broken = text.split("\n").map(function (item, i) {
        return React.createElement(
            'span',
            { key: i },
            item,
            React.createElement('br', null)
        );
    });
    return broken;
};

var AbstainButton = function AbstainButton(props) {
    return React.createElement(
        'div',
        { className: 'btn btn-warning btn-lg', onClick: props.handleClick },
        'Abstain from ',
        props.title,
        ' ',
        React.createElement('i', { className: 'fa fa-arrow-right' })
    );
};

var Review = React.createClass({
    displayName: 'Review',

    getDefaultProps: function getDefaultProps() {
        return {
            election: {},
            singleVote: [],
            multipleVote: [],
            referendumVote: [],
            resetStage: null
        };
    },

    render: function render() {
        var singleResult = null;
        if (this.props.singleVote.length > 0) {
            singleResult = React.createElement(SingleResult, { vote: this.props.singleVote, resetStage: this.props.resetStage });
        }

        var multipleResult = null;
        if (this.props.multipleVote.length > 0) {
            multipleResult = React.createElement(MultipleResult, { vote: this.props.multipleVote, resetStage: this.props.resetStage });
        }

        var referendumResult = null;
        if (this.props.referendumVote.length > 0) {
            referendumResult = React.createElement(ReferendumResult, { vote: this.props.referendumVote, resetStage: this.props.resetStage });
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                'Review'
            ),
            React.createElement(
                'div',
                { className: 'review-warning' },
                React.createElement(
                    'p',
                    null,
                    'You\'re almost done'
                ),
                React.createElement(
                    'p',
                    null,
                    'Since you may only vote once, let\'s review your selections.'
                )
            ),
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'button',
                    { className: 'btn btn-lg btn-block btn-success', onClick: this.props.finalVote },
                    'Place my Vote'
                )
            ),
            React.createElement(
                'div',
                null,
                ' '
            ),
            React.createElement(
                'div',
                { className: 'vote-results' },
                singleResult,
                multipleResult,
                referendumResult
            ),
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'button',
                    { className: 'btn btn-lg btn-block btn-success', onClick: this.props.finalVote },
                    'Place my Vote'
                )
            )
        );
    }

});

var SingleResult = React.createClass({
    displayName: 'SingleResult',

    getDefaultProps: function getDefaultProps() {
        return {
            vote: [],
            resetStage: null
        };
    },

    render: function render() {
        var rows = this.props.vote.map(function (value, key) {
            return React.createElement(SingleResultRow, _extends({ key: key }, value, { resetStage: this.props.resetStage.bind(null, 'single', value.single.id) }));
        }.bind(this));

        return React.createElement(
            'div',
            null,
            rows
        );
    }
});

var SingleResultRow = React.createClass({
    displayName: 'SingleResultRow',

    getDefaultProps: function getDefaultProps() {
        return {
            vote: {},
            resetStage: null,
            single: {},
            ticket: {}
        };
    },

    render: function render() {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-xs-10' },
                React.createElement(
                    'h3',
                    null,
                    this.props.single.title
                )
            ),
            React.createElement(
                'div',
                { className: 'col-xs-2' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-default',
                        onClick: this.props.resetStage.bind(null, 'single', this.props.single.id) },
                    React.createElement('i', { className: 'fa fa-pencil' }),
                    ' Edit'
                )
            )
        );

        if (this.props.ticket) {
            var icon = React.createElement('i', { className: 'fa fa-check-circle text-success fa-5x pull-right' });
            var title = React.createElement(
                'h4',
                null,
                this.props.ticket.title
            );
            var candidates = this.props.ticket.candidates.map(function (value, key) {
                return React.createElement(
                    'div',
                    { className: 'pull-left pad-right', key: key },
                    React.createElement(SingleCandidate, value)
                );
            });
        } else {
            var icon = null;
            var title = React.createElement(
                'h4',
                null,
                'No ticket chosen'
            );
            var candidates = React.createElement(
                'p',
                null,
                'Abstained'
            );
        }

        var body = React.createElement(
            'div',
            null,
            icon,
            title,
            React.createElement(
                'div',
                null,
                candidates
            )
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});

var MultipleResult = React.createClass({
    displayName: 'MultipleResult',

    getDefaultProps: function getDefaultProps() {
        return {
            vote: [],
            resetStage: null
        };
    },

    render: function render() {
        var multiples = this.props.vote.map(function (vote, key) {
            return React.createElement(MultipleResultRow, _extends({}, vote, { key: key, resetStage: this.props.resetStage }));
        }.bind(this));

        var heading = React.createElement(
            'h3',
            null,
            'Senate Seats'
        );

        var body = React.createElement(
            'div',
            null,
            multiples
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});

var MultipleResultRow = React.createClass({
    displayName: 'MultipleResultRow',

    getDefaultProps: function getDefaultProps() {
        return {
            chairs: [],
            multiple: {},
            resetStage: null
        };
    },

    render: function render() {
        var heading = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-xs-10' },
                React.createElement(
                    'h4',
                    null,
                    this.props.multiple.title
                )
            ),
            React.createElement(
                'div',
                { className: 'col-xs-2' },
                React.createElement(
                    'button',
                    { className: 'btn btn-default btn-block',
                        onClick: this.props.resetStage.bind(null, 'multiple', this.props.multiple.id) },
                    React.createElement('i', { className: 'fa fa-pencil' }),
                    ' Edit'
                )
            )
        );
        if (this.props.chairs.length === 0) {
            var candidates = React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    'No candidates chosen.'
                ),
                React.createElement(
                    'p',
                    null,
                    'Abstained.'
                )
            );
        } else {
            var candidateListing = this.props.multiple.candidates.map(function (candidate, key) {
                if ($.inArray(candidate.id, this.props.chairs) !== -1) {
                    return React.createElement(MultipleCandidateRow, _extends({}, candidate, { key: key }));
                }
            }.bind(this));
            var candidates = React.createElement(
                'ul',
                { className: 'list-group' },
                candidateListing
            );
        }

        var body = React.createElement(
            'div',
            { className: 'multiple-ticket-vote' },
            candidates
        );
        return React.createElement(Panel, { heading: heading, body: body });
    }

});

var MultipleCandidateRow = React.createClass({
    displayName: 'MultipleCandidateRow',

    getDefaultProps: function getDefaultProps() {
        return {
            firstName: '',
            lastName: '',
            picture: ''
        };
    },

    render: function render() {
        var icon = React.createElement('i', { className: 'pull-right text-success fa fa-check-circle fa-2x' });

        var picture = React.createElement(
            'div',
            { className: 'no-photo' },
            React.createElement(
                'span',
                null,
                'No photo'
            )
        );

        if (this.props.picture.length > 0) {
            picture = React.createElement('img', { className: 'img-circle', src: this.props.picture });
        }

        return React.createElement(
            'li',
            { className: 'list-group-item', onClick: this.props.select },
            icon,
            picture,
            this.props.firstName,
            ' ',
            this.props.lastName
        );
    }

});

var ReferendumResult = React.createClass({
    displayName: 'ReferendumResult',

    getDefaultProps: function getDefaultProps() {
        return {
            vote: [],
            resetStage: null
        };
    },

    getInitialState: function getInitialState() {
        return {};
    },

    render: function render() {
        var rows = this.props.vote.map(function (value, key) {
            return React.createElement(ReferendumResultRow, _extends({ key: key }, value, { resetStage: this.props.resetStage }));
        }.bind(this));

        var heading = React.createElement(
            'h3',
            null,
            'Referenda'
        );

        var body = React.createElement(
            'div',
            null,
            rows
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }
});

var ReferendumResultRow = React.createClass({
    displayName: 'ReferendumResultRow',

    getDefaultProps: function getDefaultProps() {
        return {};
    },

    render: function render() {
        var voted = '';
        switch (this.props.answer) {
            case 'yes':
                voted = React.createElement(
                    'span',
                    { className: 'text-success' },
                    React.createElement('i', { className: 'fa fa-check-circle' }),
                    ' Yes'
                );
                break;

            case 'no':
                voted = React.createElement(
                    'span',
                    { className: 'text-danger' },
                    React.createElement('i', { className: 'fa fa-times-circle' }),
                    ' No'
                );
                break;

            case 'abstain':
                voted = React.createElement(
                    'span',
                    { className: 'text-primary' },
                    React.createElement('i', { className: 'fa fa-question-circle' }),
                    ' Abstain'
                );
                break;
        }

        return React.createElement(
            'div',
            { className: 'row referendum-result' },
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                this.props.referendum.title
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                voted
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-default',
                        onClick: this.props.resetStage.bind(null, 'referendum', this.props.referendum.id) },
                    React.createElement('i', { className: 'fa fa-pencil' }),
                    ' Edit'
                )
            )
        );
    }

});

var Referendum = React.createClass({
    displayName: 'Referendum',

    getDefaultProps: function getDefaultProps() {
        return {
            election: {},
            updateVote: null,
            vote: [],
            referendum: {}
        };
    },

    render: function render() {
        var title = React.createElement(
            'h2',
            null,
            this.props.referendum.title
        );
        var body = BreakIt(this.props.referendum.description);
        var footer = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-4' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-lg btn-default',
                        onClick: this.props.updateVote.bind(null, 'yes') },
                    React.createElement('i', { className: 'fa fa-check' }),
                    ' Yes'
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-4' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-lg btn-default',
                        onClick: this.props.updateVote.bind(null, 'no') },
                    React.createElement('i', { className: 'fa fa-times' }),
                    ' No'
                )
            ),
            React.createElement(
                'div',
                { className: 'col-sm-4' },
                React.createElement(
                    'button',
                    { className: 'btn btn-block btn-lg btn-default',
                        onClick: this.props.updateVote.bind(null, 'abstain') },
                    'Abstain'
                )
            )
        );

        return React.createElement(Panel, { heading: title, body: body, footer: footer });
    }

});

var Multiple = React.createClass({
    displayName: 'Multiple',

    getDefaultProps: function getDefaultProps() {
        return {
            election: {},
            updateVote: null,
            vote: [],
            ballot: {},
            unqualified: [],
            supportLink: null
        };
    },

    render: function render() {
        return React.createElement(MultipleBallot, _extends({ multipleId: this.props.ballot.id
        }, this.props.ballot, {
            updateVote: this.props.updateVote,
            vote: this.props.vote,
            unqualified: this.props.unqualified, supportLink: this.props.supportLink }));
    }
});

var MultipleBallot = React.createClass({
    displayName: 'MultipleBallot',

    getInitialState: function getInitialState() {
        return {
            selectedRows: [],
            totalSelected: 0
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            updateVote: null,
            seatNumber: 2,
            title: null,
            candidates: [],
            vote: null,
            multipleId: 0,
            supportLink: null
        };
    },

    select: function select(candidateId) {
        var selectedRows = this.state.selectedRows;
        var found = $.inArray(candidateId, selectedRows);
        var totalSelected = this.state.totalSelected;
        var totalSeats = this.props.seatNumber * 1;

        if (found === -1) {
            if (totalSelected !== totalSeats) {
                totalSelected++;
                selectedRows.push(candidateId);
            }
        } else {
            if (totalSelected > 0) {
                totalSelected--;
            }
            selectedRows.splice(found, 1);
        }

        this.setState({
            selectedRows: selectedRows,
            totalSelected: totalSelected
        });
    },

    saveVotes: function saveVotes() {
        this.props.updateVote(this.state.selectedRows);
        this.setState({
            selectedRows: [],
            totalSelected: 0
        });
    },

    render: function render() {
        var seatNumber = this.props.seatNumber * 1;
        var candidates = this.props.candidates.map(function (value) {
            if ($.inArray(value.id, this.state.selectedRows) !== -1) {
                var selected = true;
            } else {
                var selected = false;
            }
            return React.createElement(MultipleCandidate, _extends({ key: value.id }, value, {
                selected: selected, select: this.select.bind(null, value.id) }));
        }.bind(this));

        if (this.state.totalSelected > 0) {
            var button = React.createElement(
                'button',
                { className: 'pull-right btn btn-success', onClick: this.saveVotes },
                'Continue ',
                React.createElement('i', { className: 'fa fa-arrow-right' })
            );
        } else {
            var button = React.createElement(
                'button',
                { className: 'pull-right btn btn-warning', onClick: this.saveVotes },
                'Abstain from ',
                this.props.title,
                ' ',
                React.createElement('i', { className: 'fa fa-arrow-right' })
            );
        }

        var unqualified = null;
        if (this.props.unqualified.length > 0) {
            var supportLink = 'mailto:' + this.props.supportLink;
            unqualified = React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-6' },
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'strong',
                            null,
                            'You were not qualified to vote in the following ballots because of your class, college, or organizational affiliation.'
                        )
                    ),
                    React.createElement(
                        'div',
                        { style: { height: '300px', overflow: 'auto' } },
                        React.createElement(
                            'table',
                            { className: 'table table-striped' },
                            React.createElement(
                                'tbody',
                                null,
                                this.props.unqualified.map(function (value, key) {
                                    return React.createElement(
                                        'tr',
                                        { key: key },
                                        React.createElement(
                                            'td',
                                            null,
                                            value
                                        )
                                    );
                                })
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-6 well' },
                    React.createElement(
                        'div',
                        { className: 'alert alert-danger' },
                        React.createElement(
                            'strong',
                            null,
                            'Is there ballot you should be able to vote on?'
                        )
                    ),
                    React.createElement(
                        'ol',
                        null,
                        React.createElement(
                            'li',
                            null,
                            'STOP! Do not complete your vote'
                        ),
                        React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'a',
                                { href: supportLink },
                                React.createElement(
                                    'strong',
                                    null,
                                    'click here'
                                ),
                                ' and email your ASU username and the missing ballot name.'
                            )
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        'We will check your account and get back to you.'
                    )
                )
            );
        }

        return React.createElement(
            'div',
            { className: 'multiple-ticket-vote' },
            React.createElement(
                'h2',
                null,
                this.props.title
            ),
            React.createElement(
                'div',
                { className: 'container remaining-seats alert alert-success' },
                button,
                'You have selected ',
                this.state.totalSelected,
                ' of the allowed ',
                this.props.seatNumber,
                ' seat',
                this.props.seatNumber === '1' ? null : 's',
                '.'
            ),
            React.createElement(
                'ul',
                { className: 'list-group' },
                candidates
            ),
            React.createElement('hr', null),
            React.createElement(
                'div',
                null,
                button
            ),
            React.createElement(
                'div',
                { style: { clear: 'both' } },
                unqualified
            )
        );
    }
});

var MultipleCandidate = React.createClass({
    displayName: 'MultipleCandidate',

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {
            firstName: '',
            lastName: '',
            picture: '',
            title: '',
            selected: false,
            select: null
        };
    },

    render: function render() {
        if (this.props.selected) {
            var _className = 'list-group-item pointer active';
            var icon = React.createElement(
                'button',
                { className: 'pull-right btn btn-default btn-lg' },
                React.createElement('i', { className: 'fa fa-check' }),
                ' Selected'
            );
        } else {
            var _className = 'list-group-item pointer';
            var icon = React.createElement(
                'button',
                { className: 'pull-right btn btn-default btn-lg' },
                'Select'
            );
        }

        var picture = React.createElement(
            'div',
            { className: 'no-photo' },
            React.createElement(
                'span',
                null,
                'No photo'
            )
        );

        if (this.props.picture.length > 0) {
            picture = React.createElement('img', { className: 'img-circle', src: this.props.picture });
        }

        return React.createElement(
            'li',
            { className: _className, onClick: this.props.select },
            icon,
            picture,
            this.props.firstName,
            ' ',
            this.props.lastName
        );
    }

});

var Single = React.createClass({
    displayName: 'Single',

    getDefaultProps: function getDefaultProps() {
        return {
            election: {},
            updateVote: null,
            vote: [],
            ballot: {}
        };
    },

    render: function render() {
        return React.createElement(SingleBallot, _extends({ singleId: this.props.ballot.id }, this.props.ballot, {
            updateVote: this.props.updateVote, vote: this.props.vote }));
    }

});

var SingleBallot = React.createClass({
    displayName: 'SingleBallot',

    getDefaultProps: function getDefaultProps() {
        return {
            updateVote: null,
            title: null,
            tickets: [],
            vote: null,
            singleId: 0
        };
    },

    render: function render() {
        var tickets = this.props.tickets.map(function (value) {
            return React.createElement(SingleBallotTicket, _extends({ key: value.id }, value, {
                updateVote: this.props.updateVote.bind(null, value) }));
        }.bind(this));
        return React.createElement(
            'div',
            { className: 'single-ticket-vote' },
            React.createElement(
                'h1',
                null,
                this.props.title
            ),
            React.createElement(
                'p',
                { className: 'warning' },
                'Vote for ',
                React.createElement(
                    'strong',
                    null,
                    'ONE'
                ),
                ' ticket. We\'ll review your decision at the end.'
            ),
            tickets,
            React.createElement('hr', null),
            React.createElement(
                'div',
                { className: 'text-right' },
                React.createElement(AbstainButton, { title: this.props.title, handleClick: this.props.updateVote.bind(null, null) })
            )
        );
    }
});

var SingleBallotTicket = React.createClass({
    displayName: 'SingleBallotTicket',

    mixins: ['panel'],

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {
            title: null,
            platform: null,
            siteAddress: null,
            candidates: [],
            updateVote: null,
            vote: []
        };
    },

    render: function render() {
        var candidateCount = this.props.candidates.length;
        if (candidateCount > 0) {
            var candidates = this.props.candidates.map(function (value) {
                return React.createElement(SingleCandidate, _extends({ key: value.id }, value, { candidateLength: candidateCount }));
            }.bind(this));
        } else {
            var candidates = null;
        }

        var heading = React.createElement(
            'h2',
            null,
            this.props.title
        );

        var platform = BreakIt(this.props.platform);

        var website = null;

        if (this.props.siteAddress.length) {
            website = React.createElement(
                'div',
                { className: 'website' },
                React.createElement(
                    'a',
                    { href: this.props.siteAddress, target: '_blank' },
                    this.props.siteAddress,
                    ' ',
                    React.createElement('i', { className: 'fa fa-external-link' })
                )
            );
        }

        var body = React.createElement(
            'div',
            { className: 'ticket' },
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-6' },
                    platform,
                    React.createElement('hr', null),
                    website
                ),
                candidates
            ),
            React.createElement(
                'button',
                { className: 'btn btn-primary btn-block btn-lg', onClick: this.props.updateVote },
                React.createElement('i', { className: 'fa fa-check-square-o' }),
                ' Vote for ',
                this.props.title
            )
        );

        return React.createElement(Panel, { heading: heading, body: body });
    }

});

var SingleCandidate = React.createClass({
    displayName: 'SingleCandidate',

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {
            firstName: '',
            lastName: '',
            picture: '',
            title: '',
            candidateLength: 1
        };
    },

    render: function render() {
        switch (this.props.candidateLength) {
            case 1:
                var colSize = 'col-sm-6';
                break;
            case 2:
                var colSize = 'col-sm-3';
        }
        return React.createElement(
            'div',
            { className: colSize },
            React.createElement(
                'div',
                null,
                this.props.picture.length > 0 ? React.createElement(
                    'div',
                    { className: 'photo-matte' },
                    React.createElement('span', { className: 'helper' }),
                    React.createElement('img', { src: this.props.picture, className: 'img-responsive candidate' })
                ) : React.createElement(
                    'div',
                    { className: 'no-picture text-muted' },
                    React.createElement('i', { className: 'fa fa-user fa-5x' }),
                    React.createElement('br', null),
                    'No picture'
                )
            ),
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
            )
        );
    }

});

'use strict';

var Election = React.createClass({
    displayName: 'Election',

    getInitialState: function getInitialState() {
        return {
            election: null,
            currentSingle: 0,
            currentMultiple: 0,
            currentReferendum: 0,
            single: [],
            multiple: [],
            referendum: [],
            ballotCount: 0,
            referendumCount: 0,
            stage: 'loading',
            singleVote: [],
            multipleVote: [],
            referendumVote: [],
            unqualified: [],
            backToReview: false,
            surveyLink: null,
            supportLink: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.load();
    },

    load: function load() {
        $.getJSON('election/User/Election', {
            command: 'list'
        }).done(function (data) {
            var stage = this.state.stage;
            if (!data.election) {
                this.setStage('empty');
            } else if (data.hasVoted) {
                this.setState({
                    stage: 'finished',
                    election: data.election
                });
            } else {
                var singleLength = data.single.length;
                var multipleLength = data.multiple.length;
                var referendumLength = data.referendum.length;
                console.log(singleLength);
                console.log(multipleLength);
                console.log(referendumLength);
                /* If there are no single-type elections, then skip to multiple type */
                if (singleLength === 0) {
                    if (multipleLength === 0) {
                        if (referendumLength === 0) {
                            stage = 'empty';
                        } else {
                            stage = 'referendum';
                        }
                    } else {
                        stage = 'multiple';
                    }
                } else {
                    stage = 'single';
                }
                var ballotCount = singleLength + multipleLength;
                this.setState({
                    stage: stage,
                    hasVoted: data.hasVoted,
                    election: data.election,
                    single: data.single,
                    multiple: data.multiple,
                    referendum: data.referendum,
                    ballotCount: ballotCount,
                    referendumCount: referendumLength,
                    unqualified: data.unqualified,
                    supportLink: data.supportLink
                });
            }
        }.bind(this));
    },

    setStage: function setStage(stage) {
        window.scrollTo(0, 0);
        this.setState({
            stage: stage
        });
    },

    getSingleKey: function getSingleKey(id) {
        var found = 0;
        $.each(this.state.single, function (index, value) {
            if (id === value.id) {
                found = index;
            }
        });
        return found;
    },

    getMultipleKey: function getMultipleKey(id) {
        var found = 0;
        $.each(this.state.multiple, function (index, value) {
            if (id === value.id) {
                found = index;
            }
        });
        return found;
    },

    getReferendumKey: function getReferendumKey(id) {
        var found = 0;
        $.each(this.state.referendum, function (index, value) {
            if (id === value.id) {
                found = index;
            }
        });
        return found;
    },

    setCurrentSingle: function setCurrentSingle(id) {
        this.setState({
            currentSingle: id
        });
    },

    setCurrentMultiple: function setCurrentMultiple(id) {
        this.setState({
            currentMultiple: id
        });
    },

    setCurrentReferendum: function setCurrentReferendum(id) {
        this.setState({
            currentReferendum: id
        });
    },

    resetStage: function resetStage(stage, id) {
        switch (stage) {
            case 'single':
                this.setCurrentSingle(this.getSingleKey(id));
                break;

            case 'multiple':
                this.setCurrentMultiple(this.getMultipleKey(id));
                break;

            case 'referendum':
                this.setCurrentReferendum(this.getReferendumKey(id));
                break;
        }
        this.setState({
            backToReview: true,
            stage: stage
        });
    },

    updateSingleVote: function updateSingleVote(ticket) {
        var stage = this.state.stage;
        var current = this.state.currentSingle;
        var nextSingle = current + 1;
        var singleVote = this.state.singleVote;
        var currentVote = singleVote[current];
        currentVote = {
            single: this.state.single[this.state.currentSingle],
            ticket: ticket
        };
        singleVote[current] = currentVote;

        if (this.state.backToReview) {
            stage = 'review';
        } else if (typeof this.state.single[nextSingle] === 'undefined') {
            if (this.state.multiple.length > 0) {
                stage = 'multiple';
            } else if (this.state.referendum.length > 0) {
                stage = 'referendum';
            } else {
                stage = 'review';
            }
        }
        window.scrollTo(0, 0);
        this.setState({
            stage: stage,
            singleVote: singleVote,
            currentSingle: nextSingle
        });
    },

    updateMultipleVote: function updateMultipleVote(chairs) {
        var stage = this.state.stage;
        var current = this.state.currentMultiple;
        var nextMultiple = current + 1;
        var multipleVote = this.state.multipleVote;
        var currentVote = multipleVote[current];

        currentVote = {
            multiple: this.state.multiple[current],
            chairs: chairs
        };

        multipleVote[current] = currentVote;

        window.scrollTo(0, 0);
        if (this.state.backToReview) {
            stage = 'review';
        } else if (typeof this.state.multiple[nextMultiple] === 'undefined') {
            if (this.state.referendum.length > 0) {
                stage = 'referendum';
            } else {
                stage = 'review';
            }
        }

        this.setState({
            stage: stage,
            multipleVote: multipleVote,
            currentMultiple: nextMultiple
        });
    },

    updateReferendumVote: function updateReferendumVote(vote) {
        var stage = this.state.stage;
        var current = this.state.currentReferendum;
        var nextReferendum = current + 1;
        var referendumVote = this.state.referendumVote;
        var currentVote = referendumVote[current];

        currentVote = {
            referendum: this.state.referendum[current],
            answer: vote
        };

        referendumVote[current] = currentVote;

        window.scrollTo(0, 0);
        if (this.state.backToReview) {
            stage = 'review';
        } else if (typeof this.state.referendum[nextReferendum] === 'undefined') {
            stage = 'review';
        }

        this.setState({
            stage: stage,
            referendumVote: referendumVote,
            currentReferendum: nextReferendum
        });
    },

    finalVote: function finalVote() {
        var singleResult = [];
        $.each(this.state.singleVote, function (index, value) {
            if (value.single && typeof value.single.id !== 'undefined' && value.ticket && typeof value.ticket.id !== 'undefined') {
                singleResult.push({
                    singleId: value.single.id,
                    ticketId: value.ticket.id
                });
            }
        });

        var multipleResult = [];
        $.each(this.state.multipleVote, function (index, value) {
            multipleResult.push({
                multipleId: value.multiple.id,
                chairs: value.chairs
            });
        });

        var referendumResult = [];
        $.each(this.state.referendumVote, function (index, value) {
            referendumResult.push({
                referendumId: value.referendum.id,
                answer: value.answer
            });
        });
        $.post('election/User/Vote', {
            command: 'save',
            electionId: this.state.election.id,
            single: singleResult,
            multiple: multipleResult,
            referendum: referendumResult
        }, null, 'json').done(function (data) {
            if (data.success === true) {
                this.setState({
                    backToReview: false,
                    stage: 'finished',
                    surveyLink: data.surveyLink
                });
            } else {
                this.setState({
                    backToReview: false,
                    stage: 'failure'
                });
            }
        }.bind(this)).fail(function (data) {
            this.setStage('failure');
        }.bind(this));
    },

    render: function render() {
        var content = null;
        var review = null;

        if (this.state.backToReview) {
            review = React.createElement(
                'button',
                { className: 'btn btn-lg btn-block btn-info', onClick: this.setStage.bind(null, 'review') },
                'Return to review without saving'
            );
        }

        switch (this.state.stage) {
            case 'loading':
                content = React.createElement(
                    'div',
                    { className: 'text-center pad-top' },
                    React.createElement('i', { className: 'fa fa-spinner fa-spin fa-5x' })
                );
                break;

            case 'empty':
                content = React.createElement(Empty, null);
                break;

            case 'finished':
                content = React.createElement(Finished, { election: this.state.election, surveyLink: this.state.surveyLink });
                break;

            case 'single':
                content = React.createElement(Single, { election: this.state.election,
                    ballot: this.state.single[this.state.currentSingle],
                    updateVote: this.updateSingleVote, vote: this.state.singleVote });
                break;

            case 'multiple':
                content = React.createElement(Multiple, { election: this.state.election,
                    ballot: this.state.multiple[this.state.currentMultiple],
                    updateVote: this.updateMultipleVote, vote: this.state.multipleVote,
                    unqualified: this.state.unqualified, supportLink: this.state.supportLink });
                break;

            case 'referendum':
                content = React.createElement(Referendum, { election: this.state.election,
                    referendum: this.state.referendum[this.state.currentReferendum],
                    updateVote: this.updateReferendumVote, vote: this.state.referendumVote });
                break;

            case 'failure':
                content = React.createElement(Failure, null);
                break;

            case 'review':
                review = null;
                content = React.createElement(Review, { election: this.state.election,
                    single: this.state.single,
                    multiple: this.state.multiple,
                    referendum: this.state.referendum,
                    singleVote: this.state.singleVote,
                    multipleVote: this.state.multipleVote,
                    referendumVote: this.state.referendumVote,
                    finalVote: this.finalVote,
                    resetStage: this.resetStage });
                break;
        }

        var countdown = null;

        if (this.state.stage === 'single' && this.state.singleVote.length === 0 && this.state.multipleVote.length === 0 && this.state.referendumVote.length === 0) {
            countdown = React.createElement(Countdown, { ballotCount: this.state.ballotCount, referendumCount: this.state.referendumCount });
        }

        return React.createElement(
            'div',
            null,
            countdown,
            review,
            content
        );
    }

});

var Empty = function Empty() {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h3',
            null,
            'No elections are available. Please check back later.'
        )
    );
};

var Finished = React.createClass({
    displayName: 'Finished',

    getDefaultProps: function getDefaultProps() {
        return {
            election: {},
            surveyLink: null
        };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-6 col-sm-offset-3' },
                React.createElement(
                    'div',
                    { className: 'well text-center' },
                    React.createElement(
                        'h2',
                        null,
                        this.props.election.title
                    ),
                    React.createElement(
                        'h3',
                        null,
                        'Thank you for voting! Watch SGA for results.'
                    ),
                    React.createElement(
                        'a',
                        { href: './index.php?module=users&action=user&command=logout', className: 'btn btn-lg btn-primary' },
                        'Sign out'
                    ),
                    React.createElement('hr', null),
                    React.createElement(
                        'p',
                        null,
                        'What do you think about the voting process? ',
                        React.createElement(
                            'a',
                            { href: this.props.surveyLink },
                            'Let us know!'
                        )
                    )
                )
            )
        );
    }

});

var Countdown = React.createClass({
    displayName: 'Countdown',

    getInitialState: function getInitialState() {
        return {
            seen: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            ballotCount: 0,
            referendumCount: 0,
            vote: null
        };
    },

    plural: function plural(item, single, _plural) {
        if (typeof single === 'undefined' || single.length === 0) {
            single = '';
        }
        if (typeof _plural === 'undefined' || _plural.length === 0) {
            _plural = 's';
        }
        return item != 1 ? _plural : single;
    },

    render: function render() {
        var ballots = null;
        var referendum = null;
        var totalItems = 0;
        var isAre = 'are';
        var and = '';

        if (this.props.ballotCount > 0) {
            totalItems += this.props.ballotCount;
            ballots = this.props.ballotCount + ' ballot' + this.plural(this.props.ballotCount);
        }

        if (this.props.referendumCount > 0) {
            totalItems += this.props.referendumCount;
            referendum = this.props.referendumCount + ' referend' + this.plural(this.props.referendumCount, 'um', 'a');
        }

        if (totalItems < 2) {
            isAre = 'is';
        }

        if (this.props.ballotCount > 0 && this.props.referendumCount > 0) {
            and = 'and';
        }

        return React.createElement(
            'div',
            { className: 'alert alert-info' },
            'There ',
            isAre,
            ' currently ',
            ballots,
            ' ',
            and,
            ' ',
            referendum,
            ' for you to vote on. We will review all your selections later, before your votes are submitted.'
        );
    }

});

var Failure = React.createClass({
    displayName: 'Failure',

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                'Sorry'
            ),
            React.createElement(
                'p',
                null,
                'Your vote failed to register. Please try again or report the problem.'
            )
        );
    }

});

ReactDOM.render(React.createElement(Election, null), document.getElementById('election'));
//# sourceMappingURL=script.js.map
