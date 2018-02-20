'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const CandidateInfo = (props) => {
  var title = null
  if (props.useTitle) {
    title = (
      <input
        type="text"
        className="form-control"
        name="title"
        value={props.title}
        placeholder="Position title"
        onChange={props.updateTitle}/>
    )
  }

  return (
    <div>
      <input
        type="text"
        className="form-control"
        name="firstName"
        value={props.firstName}
        placeholder="First name"
        onChange={props.updateFirstName}/>
      <input
        type="text"
        className="form-control"
        name="lastName"
        value={props.lastName}
        placeholder="Last name"
        onChange={props.updateLastName}/> {title}
    </div>
  )
}

CandidateInfo.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  title: PropTypes.string,
  useTitle: PropTypes.bool,
  updateTitle: PropTypes.func,
  updateLastName: PropTypes.func,
  updateFirstName: PropTypes.func,
}

CandidateInfo.defaultTypes = {
  firstName: null,
  lastName: null,
  title: null,
  useTitle: true,
}

export default CandidateInfo
