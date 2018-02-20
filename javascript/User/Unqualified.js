'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Unqualified = (props) => {
  let supportLink = 'mailto:' + props.supportLink
  return (
    <div>
      <div className="well">
        <div className="alert alert-danger">
          <strong>Is there ballot you should be able to vote on?</strong>
        </div>
        <ol>
          <li>STOP! Do not complete your vote</li>
          <li>
            <a href={supportLink}>
              <strong>click here</strong>&nbsp;and email your ASU username and the missing ballot name.</a>
          </li>
        </ol>
        <p>We will check your account and get back to you.</p>
      </div>
      <p>
        <strong>You were not qualified to vote in the following ballots because of your
          class, college, or organizational affiliation.</strong>
      </p>
      <div>
        <table className="table table-striped">
          <tbody>
            {
              props.unqualified.map(function (value, key) {
                return <tr key={key}>
                  <td>{value}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

Unqualified.propTypes = {
  unqualified: PropTypes.array,
  supportLink: PropTypes.string
}

Unqualified.defaultTypes = {
  unqualified: []
}

export default Unqualified
