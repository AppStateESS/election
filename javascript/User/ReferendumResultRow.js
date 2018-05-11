'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const ReferendumResultRow = (props) => {
  var voted = ''
  switch (props.answer) {
    case 'yes':
      voted = <span className="text-success">
        <i className="fa fa-check-circle"></i>&nbsp;
        Yes</span>
      break

    case 'no':
      voted = <span className="text-danger">
        <i className="fa fa-times-circle"></i>&nbsp;
        No</span>
      break

    case 'abstain':
      voted = <span className="text-primary">
        <i className="fa fa-question-circle"></i>&nbsp;
        Abstain</span>
      break
  }

  return (
    <div className="row referendum-result">
      <div className="col-sm-6">{props.referendum.title}</div>
      <div className="col-sm-3">{voted}</div>
      <div className="col-sm-3">
        <button
          className="btn btn-block btn-outline-dark"
          onClick={props.resetStage.bind(null, 'referendum', props.referendum.id)}>
          <i className="fas fa-pencil-alt"></i>&nbsp;
          Edit
        </button>
      </div>
    </div>
  )
}

ReferendumResultRow.propTypes = {
  referendum: PropTypes.object,
  resetStage: PropTypes.func,
  answer: PropTypes.string
}

export default ReferendumResultRow
