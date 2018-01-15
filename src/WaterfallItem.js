import React from 'react';
import PropTypes from 'prop-types';


class WaterfallItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    console.log('componentDidMount:waterfall-item-' + this.props.index);
  }

  shouldComponentUpdate (newProps) {
    return this.props.index !== newProps.index;
  }

  componentDidUpdate () {
    console.log('componentDidUpdate:waterfall-item-' + this.props.index);
  }

  render () {
    const { index = 0, cIndex = 0, img = '', renderItem, columnWidth } = this.props;
    return <div style={{ display: 'block', width: columnWidth }}>
      {renderItem(cIndex, index, img)}
    </div>;
  }
}

WaterfallItem.propTypes = {
  index: PropTypes.number,
  cIndex: PropTypes.number,
  img: PropTypes.string,
  renderItem: PropTypes.func,
  columnWidth: PropTypes.number
};

export default WaterfallItem;
