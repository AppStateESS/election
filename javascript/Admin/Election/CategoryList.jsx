'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import {electionTypes} from './types.js'

const CategoryList = (props) => {
  let otherOptions = []
  electionTypes.electionTypes.map(function (value) {
    value.subcategory.map(function (subval) {
      otherOptions.push({
        value: subval.type,
        label: subval.matchName + ': ' + subval.name
      })
    })
  })
  return (
    <div>
      <Select
        multi={true}
        simpleValue={true}
        name="filter"
        options={otherOptions}
        value={props.default}
        onChange={props.handleChange}/>
    </div>
  )
}

CategoryList.defaultProps = {
  default: '',
  handleChange: null
}

CategoryList.propTypes = {
  default : PropTypes.string,
  handleChange: PropTypes.func,
}

export default CategoryList
