import React from 'react'
import PropTypes from 'prop-types'

class WaterfallItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate (newProps) {
    return this.props.index !== newProps.index
  }

  render () {
    const {index = 0, cIndex = 0, img = '', renderItem, columnWidth} = this.props
    return <div style={{display: 'block', width: columnWidth}}>
      {renderItem(cIndex, index, img)}
    </div>
  }
}

WaterfallItem.propTypes = {
  index: PropTypes.number,
  cIndex: PropTypes.number,
  img: PropTypes.string,
  renderItem: PropTypes.func,
  columnWidth: PropTypes.number
}

export default WaterfallItem
