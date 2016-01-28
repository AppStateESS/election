var Candidate = React.createClass({
    displayName: 'Candidate',

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            firstName: '',
            lastName: '',
            picture: ''
        };
    },

    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'photo-matte' },
                React.createElement('span', { className: 'helper' }),
                this.props.picture.length > 0 ? React.createElement('img', { src: this.props.picture, className: 'candidate-pic' }) : React.createElement(
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
                )
            )
        );
    }

});