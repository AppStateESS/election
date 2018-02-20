'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Panel from '../../Mixin/Panel'

/* global $, allowChange */

export default class ReferendumListRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formId: -1
    }
    this.deleteReferendum = this.deleteReferendum.bind(this)
  }

  deleteReferendum() {
    if (confirm('Are you sure you want to delete this referendum?')) {
      $.post('election/Admin/Referendum', {
        command: 'delete',
        referendumId: this.props.referendumId
      }, null, 'json').done(function () {
        this.props.reload()
      }.bind(this)).fail(function () {
        alert('Cannot delete referendum')
        this.props.reload()
      }.bind(this))

    }
  }

  render() {
    const heading = (
      <div className="row">
        <div className="col-sm-8">
          <h3>{this.props.title}</h3>
        </div>
        <div className="col-sm-4 text-right">
          <button className="btn btn-success pad-right" onClick={this.props.edit}>
            <i className="fa fa-edit"></i>&nbsp; Edit
          </button>
          <button
            disabled={!allowChange}
            className="btn btn-danger"
            onClick={this.deleteReferendum}>
            <i className="fa fa-trash-o"></i>&nbsp;
            Delete
          </button>
        </div>
      </div>
    )

    const body = (
      <p>{
          this.props.description.split("\n").map(function (item, i) {
            return (<span key={i}>{item}
              <br/>
            </span>)
          })
        }
      </p>
    )
    return (<Panel type="success" heading={heading} body={body}/>)
  }
}

ReferendumListRow.propTypes = {
  electionId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  hideForm: PropTypes.func,
  referendumId: PropTypes.oneOfType([PropTypes.string,PropTypes.number,]),
  title: PropTypes.string,
  description: PropTypes.string,
  isOpen: PropTypes.bool,
  edit: PropTypes.func,
  openReferendum: PropTypes.func,
  reload: PropTypes.func,
}

ReferendumListRow.defaultProps = {
  electionId: 0,
  referendumId: 0,
  title: '',
  description: '',
}
