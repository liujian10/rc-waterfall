import React from 'react'
import PropTypes from 'prop-types'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
import Item from './WaterfallItem.jsx'
import './Waterfall.less'

class Waterfall extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: []
    }
  }

  componentWillMount () {
    this.container = null // 组件顶层容器
    this.imageIndex = 0 // 当前加载图片位置
    this.domColumns = [] // 瀑布列dom列表
    this.imageCaches = {
      current: 0,
      pending: false,
      end: false
    } // 图片缓存集合
    this.cacheImage() // 提前缓存图片
    this.scrollTop = 0
  }

  componentDidMount () {
    const target = this.props.getTarget ? this.getScrollTarget() : window
    this.scrollEvent = addEventListener(target, 'scroll', this.handleScroll.bind(this))
    this.resizeEvent = addEventListener(window, 'resize', this.adaptiveToUpdate.bind(this))
    this.adaptiveToUpdate()
  }

  shouldComponentUpdate () {
    const newColumnNum = this.getColumnNum()
    return !this.isLoadEnd() && this.columnNum !== 0 && newColumnNum === this.columnNum
  }

  componentWillUpdate () {
  }

  componentDidUpdate () {
//    console.log('componentDidUpdate:waterfall')
    if (this.domColumns.length === 0) {
      this.initDomColumns()
    }
    this.doAppend()
  }

  componentWillUnmount () {
    this.scrollEvent && this.scrollEvent.remove()
    this.resizeEvent && this.resizeEvent.remove()
  }

  /**
   * 获取滚动监听目标元素
   * @returns {*}
   */
  getScrollTarget () {
    const {getTarget} = this.props
    if (typeof getTarget === 'function') {
      return getTarget()
    } else {
      return window.document.documentElement
    }
  }

  /**
   * 初始化this.domColumns
   */
  initDomColumns () {
    const {columns} = this.state
    const {isOnlyImg} = this.props
    if (!isOnlyImg) return
    columns.forEach((column, index) => {
      this.domColumns[index] = []
      column.forEach(item => {
        const img = this.imageCaches[item.index]
        img && this.domColumns[index].push(img)
      })
    })
  }

  /**
   * 获取列高度
   * @param column
   * @returns {number}
   */
  getColumnHeight (column = []) {
    let columnHeight = 0
    const {columnWidth, isOnlyImg} = this.props
    if (isOnlyImg) { // 只基于图片计算高度模式
      // 累加列中所有图片高度
      column.forEach(img => {
        // 获取图片真实宽度，高度
        const {width, height} = img
        // 算出图片插入dom后高度
        columnHeight += width / columnWidth * height
      })
    } else {
      // 此时column为渲染后列的dom
      columnHeight = column.clientHeight
    }
    return columnHeight
  }

  /**
   * 获取最短列序号
   * @returns {element}
   */
  getShortestIndex () {
    let column, minIndex, minHeight
    // 遍历:找出高度最短的列
    for (let index in this.domColumns) {
      column = this.domColumns[index]
      if (!column) continue;
      // 获取列的高度
      const columnHeight = this.getColumnHeight(column)
      // 如果为第一个元素
      if (parseInt(index) === 0) {
        minIndex = 0
        minHeight = columnHeight
      }
      // 比较当前列高度与当前最小高度
      if (columnHeight < minHeight) {
        minIndex = index
        minHeight = columnHeight
      }
    }
    return minIndex
  }

  /**
   * 是否加载完成
   */
  isLoadEnd () {
    const {source} = this.props
    return source.length < this.imageIndex
  }

  /**
   * 是否应该执行添加图片操作
   * @returns {boolean}
   */
  shouldAppend () {
    // 获取最小高度列序号
    const shortestIndex = this.getShortestIndex()
    // 最小高度列
    const shortestColumn = this.domColumns[shortestIndex]
    // 如果最后一个图片已经append 或 未获取到最小高度列 或 瀑布流容器未渲染完成
    if (this.props.source.length <= this.imageIndex || !shortestColumn || !this.container) return false
    // 获取瀑布流容器高度
    const clientHeight = window.document.documentElement.clientHeight
    // 获取滚动条滚动高度
    const scrollTop = this.getScrollTarget().scrollTop
    // 获取最短列高度
    const shortestColumnHeight = this.getColumnHeight(shortestColumn)

    // 比较滚动条是否到达最小需要添加图片高度
    return shortestColumn && shortestColumnHeight < 100 + scrollTop + clientHeight * 1.5
  }

  /**
   * 是否需要缓存图片
   * @param num
   * @returns {boolean}
   */
  shouldCache (num) {
    const {current} = this.imageCaches
    const {source} = this.props
    let shouldCache = false
    if (current > source.length) {
      this.imageCaches.end = true
    } else {
      shouldCache = current <= this.imageIndex + num
    }
    this.imageCaches.pending = shouldCache
    return shouldCache
  }

  /**
   * 缓存图片
   */
  cacheImage () {
    const {source, isOnlyImg} = this.props
    const CACHE_IMAGE_NUM = 3 * this.columnNum || 10 //一次缓存图片数量
    if (this.shouldCache(CACHE_IMAGE_NUM)) {
      const nextIndex = this.imageCaches.current++
      if (!this.imageCaches[nextIndex]) {
        const url = source[nextIndex]
        let img = new Image()
        let timer
        img.onload = () => {
          this.imageCaches[nextIndex] = img
//          console.log('nextIndex height:' + img.height)
          if (nextIndex < this.columnNum && isOnlyImg) {
            this.domColumns[nextIndex] = [img]
          }
          clearInterval(timer)
          if (this.shouldCache(CACHE_IMAGE_NUM)) this.cacheImage()
        }
        img.src = url
      } else {
        if (this.shouldCache(CACHE_IMAGE_NUM)) this.cacheImage()
      }
    }
  }

  /**
   * 执行添加图片操作
   */
  doAppend () {
    const index = this.imageIndex
    const cacheImg = this.imageCaches[index]
    if (!cacheImg || this.domColumns.length === 0) {
      if (!this.imageCaches.pending) {
        this.cacheImage()
      }
      setTimeout(() => {
        this.doAppend()
      }, 100)
      return
    }
    if (!this.shouldAppend()) return
    const shortestIndex = this.getShortestIndex()
    const {columns} = this.state
    const {source, isOnlyImg} = this.props

    isOnlyImg && this.domColumns[shortestIndex].push(cacheImg)

    const shortestColumn = columns[shortestIndex]
    shortestColumn.push({
      img: source[index],
      index
    })
    columns[shortestIndex] = shortestColumn
    this.imageIndex++
    this.setState({
      columns
    })
  }

  /**
   * 获取列数
   * @returns {number}
   */
  getColumnNum () {
    const {columnWidth} = this.props
    let containerWidth = this.container.clientWidth
    return Math.floor((containerWidth - 20) / (columnWidth + 20))
  }

  /**
   * 初始化操作
   */
  adaptiveToUpdate () {
    if (!this.container) return
    const newColumnNum = this.getColumnNum()
    if (newColumnNum === this.columnNum) return
    const {source} = this.props
    this.domColumns = [] // 瀑布列dom列表
    this.columnNum = newColumnNum
    this.imageIndex = 0
    const columns = []
    for (let i = 0; i < this.columnNum; i++) {
      columns.push([
        {
          img: source[i],
          index: this.imageIndex++
        }
      ])
    }
    this.setState({columns}) // 初始化瀑布列
  }

  /**
   * 处理滚动事件
   */
  handleScroll () {
    // 为提高性能，滚动前后距离大于100像素再处理
    const scrollTop = this.getScrollTarget().scrollTop
    if (!this.isLoadEnd() && Math.abs(scrollTop - this.scrollTop) > 100) {
      this.scrollTop = scrollTop
      this.cacheImage()
      this.doAppend()
    }
  }

  render () {
    const {
      columnWidth,
      isOnlyImg,
      renderItem = (ci, img) => {
        return <img src={img}/>
      }
    } = this.props
    const {columns} = this.state
    const prefixCls = 'waterfall'
    return <div
      className={`${prefixCls}-container`}
      ref={e => {this.container = e}}
    >
      {
        columns.map((column = [], index) => {
          return <div
            key={index}
            ref={
              column => {
                if (!isOnlyImg) {
                  this.domColumns[index] = column
                }
              }
            }
          >{
            column.map((item, cIndex) => <Item key={item.index} {...{...item, cIndex, renderItem, columnWidth}}/>)
          }
          </div>
        })
      }
    </div>
  }
}

Waterfall.defaultProps = {
  source: [],
  columnWidth: 210,
  isOnlyImg: false
}

Waterfall.propTypes = {
  source: PropTypes.array,
  columnWidth: PropTypes.number,
  renderItem: PropTypes.func,
  getTarget: PropTypes.func,
  isOnlyImg: PropTypes.bool
}

export default Waterfall
