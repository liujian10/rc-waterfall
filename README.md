# rc-waterfall
[![Build Status](https://travis-ci.org/liujian10/rc-waterfall.svg?branch=master)](https://travis-ci.org/liujian10/rc-waterfall)

![demo](assets/sheet.jpg)

## Install

[![rc-waterfall](https://nodei.co/npm/rc-waterfall.png)](https://npmjs.org/package/rc-waterfall)

## Ideas



## Development

```bash
# install
npm install --save rc-waterfall

# run
npm run dev

# build
npm run build
```

## Example

local: http://localhost:3002/

online: http://mapleliu.com/rc-waterfall/

## Ideas

### 初始化
* 通过列宽【columnWidth】与容器【父级元素】宽度算出可显示列数columnNum，生成对应数量的列元素列表columns，且每列有一个图片元素【如果图片数量足够】
* 执行图片缓存与添加图片元素操作

### 添加图片元素操作【图片元素实际指renderItem方法返回的ReactDom元素】
* 判断如果需要添加图片元素，查找最短列并添加图片元素，执行完成后，继续执行添加图片元素操作
* 判断如果不需要添加图片元素，操作停止

### 查找最短列
* 如果根据图片高度排版【isOnlyImg:true】，图片缓存完成后会被添加到一个虚拟dom列表domColumns中，根据domColumns中各列的图片高度和查找最短列
* 如果根据实际元素高度排版【isOnlyImg:false】，列元素渲染完成后的dom元素会被添加domColumns中，根据domColumns中各列dom元素的实际高度查找最短列

### 执行添加图片元素时机
* 初始化完成
* 上一次添加图片元素渲染完成后
* getTarget返回的dom滚动条监听事件触发时

### 判断是否需要添加图片元素
* 图片是否已用完
* 图片元素是否已渲染到指定位置

### 优化处理
* 图片提前缓存，提示滚动时的流畅度
* 图片元素渲染时shouldComponentUpdate中判断是否需要重新渲染，避免重复渲染

## Usage [demo](./demo/Demo.js)

```js
import Waterfall from 'rc-waterfall';
...
<Waterfall
    source = {[...]}
    columnWidth = {200}
    isOnlyImg
    renderItem = (ci,si,url)=><div><img src={url}/><h4>{si}</h4></div>
    getTarget = ()=>window
/>
```

## API

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
|-----------|-----------|-----------|-------------|-------------|
| source | 图片资源列表 | array<string> | - | - |
| columnWidth | 单列宽度【单位px】 | number | 210 | - |
| isOnlyImg | 是否只根据图片高度进行排版 | boolean | false | true,false |
| renderItem | 渲染瀑布流块元素,回调参数【图片在列中位置ci:number,图片在source中位置si:number,图片url:string】 | function(ci,si,url):ReactNode | (ci,si,url)=>`<img src={url}/>` | - |
| getTarget | 设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 | function():HTMLElement | ()=>window | - |