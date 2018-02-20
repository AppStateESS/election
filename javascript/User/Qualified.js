'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

const Qualified = ({ qualified }) => {
  
  let clubList = <em>No participation</em>
  
  if (qualified['Club Affiliation'] != null && qualified['Club Affiliation'].length > 0) {
    let clubs = qualified['Club Affiliation'].map(function(value, key){
      return (
        <li key={key}>{value}</li>
      )
    }.bind(this))
    clubList = <ul>{clubs}</ul>
  }
  
  let greekList = <em>No participation</em>
  if (qualified['Greek Life'] != null && qualified['Greek Life'].length > 0) {
    let greeks = qualified['Greek Life'].map(function(value, key){
      return (
        <li key={key}>{value}</li>
      )
    }.bind(this))
    greekList = <ul>{greeks}</ul>
  }
  
  let transfer = <em>Not a transfer</em>
  if (qualified.Transfer == true) {
    transfer = <span>Transfer student</span>
  }
  
  return (
    <div>
      <h3>Your classifications</h3>
      <table className="table table-striped qualified">
        <tbody>
          <tr>
            <th>Class</th>
            <td>{qualified.Class}</td>
            <td>Determines which class seat (Senior, Junior, etc.) for which you can vote. Depending on the election, you may not vote for senators of the same class (i.e. a Junior may vote for a senior sentator next semester but not a junior)</td>
          </tr>
          <tr>
            <th>Club participation categories</th>
            <td>{clubList}</td>
            <td>Club participatation determines category voting. If your club category is not seen here, you are not registered in AppSync or your club is not considered part of that category.</td>
          </tr>
          <tr>
            <th>Greek Affiliation</th>
            <td>{greekList}</td>
            <td>Determines your voting privilege for specific Greek council seats.</td>
          </tr>
          <tr>
            <th>Transfer</th>
            <td>{transfer}</td>
            <td>This status allows students to vote for transfer senate seats.</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

Qualified.propTypes = {qualified:PropTypes.object,}

Qualified.defaultProps = {}

export default Qualified
