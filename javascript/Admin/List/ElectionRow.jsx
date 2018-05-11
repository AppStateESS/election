'use strict'
import React from 'react'
import PropTypes from 'prop-types'

/* global $, admin */

const ElectionRow = (props) => {
  const deleteElection = () => {
    if (prompt('Are you sure you want to delete this election? Type Y-E-S if sure.') == 'YES') {
      $.post('election/Admin/Election', {
        command: 'delete',
        electionId: props.id,
      }, null, 'json').done(function () {
        props.reload()
      }.bind(this))
    }
  }

  const showForm = () => {
    props.showResetForm(props.id)
  }

  let buttons
  let href
  // admin defined in <head> by Admin/Election class.
  if (props.past && admin) {
    buttons = <button className="btn btn-danger btn-sm" onClick={deleteElection}>
      <i className="far fa-trash-alt"></i>&nbsp; Delete</button>
  } else {
    href = 'election/Admin/?command=edit&electionId=' + props.id
    buttons = (
      <span>
        <a href={href} className="btn btn-primary btn-sm">
          <i className="fa fa-edit"></i>&nbsp;Edit</a>&nbsp;
        <button className="btn btn-warning btn-sm" onClick={showForm}>
          <i className="fa fa-refresh"></i>&nbsp;Reset vote</button>
      </span>
    )
  }
  const reportHref = 'election/Admin/Report/?command=show&electionId=' + props.id
  return (
    <tr>
      <td>{props.title}</td>
      <td>{props.startDateFormatted}&nbsp;-&nbsp;{props.endDateFormatted}</td>
      <td>{props.totalVotes}</td>
      <td>{buttons}&nbsp;
        <a href={reportHref} className="btn btn-info btn-sm">
          <i className="far fa-envelope"></i>&nbsp;Report</a>
      </td>
    </tr>
  )
}

ElectionRow.propTypes = {
  title: PropTypes.string,
  startDateFormatted: PropTypes.string,
  endDateFormatted: PropTypes.string,
  totalVotes: PropTypes.string,
  id: PropTypes.string,
  past: PropTypes.bool,
  showResetForm: PropTypes.func,
}

ElectionRow.defaultProps = {
  id: 0,
  title: '',
  startDateFormatted: '',
  endDateFormatted: '',
  totalVotes: 0,
  past: false,
}

export default ElectionRow
