'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {BreakIt} from '../Mixin/Mixin.jsx'
import Panel from '../Mixin/Panel.jsx'

const Referendum = (props) => {
  const title = <h2>{props.referendum.title}</h2>
  let body = BreakIt(props.referendum.description)
  const footer = (
    <div className="row">
      <div className="col-sm-4">
        <button
          className="btn btn-block btn-lg btn-outline-dark"
          onClick={props.updateVote.bind(null, 'yes')}>
          <i className="fa fa-check"></i>&nbsp;
          Yes
        </button>
      </div>
      <div className="col-sm-4">
        <button
          className="btn btn-block btn-lg btn-outline-dark"
          onClick={props.updateVote.bind(null, 'no')}>
          <i className="fa fa-times"></i>&nbsp;
          No
        </button>
      </div>
      <div className="col-sm-4">
        <button
          className="btn btn-block btn-lg btn-outline-dark"
          onClick={props.updateVote.bind(null, 'abstain')}>
          Abstain
        </button>
      </div>
    </div>
  )
  return (<Panel heading={title} body={body} footer={footer}/>)
}

Referendum.propTypes = {
  referendum: PropTypes.object,
  updateVote: PropTypes.func
}

export default Referendum
