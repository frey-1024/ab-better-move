# Carousel 走马灯组件

支持 PC 和 Mobile 端

## 引入方式
```javascript
import { Carousel } from 'autobest-common-ui';
```

## 使用方式

```javascript
export default class CarouselDemo extends React.Component {
  onNext = () => {
      this.carouselEl.next();
    };
    onPrev = () => {
      this.carouselEl.prev();
    };
    render() {
      return (
        <div className="demo-carousel">
          <Carousel {...this.props} ref={el => (this.carouselEl = el)}>
            <p style={{ backgroundColor: '#0fcc40' }}>1111113333333333331111</p>
            <p style={{ backgroundColor: '#ccc' }}>222222</p>
            <p style={{ backgroundColor: '#ccc422' }}>3333333</p>
            <p style={{ backgroundColor: '#32a3cc' }}>4444444</p>
            <p style={{ backgroundColor: '#cc2097' }}>55555555</p>
          </Carousel>
          <button onClick={this.onPrev}>prev</button>
          <button onClick={this.onNext}>next</button>
        </div>
      );
    }
}
```

## 参数说明

| 属性 | 必传  | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ | ------ |
| defaultValue | 非 | 1 | number | 走马灯初始显示的索引值 |
| width | 非 | 无 | 宽度 | 组件宽度， 可以不写，不写情况下，自动获取宽度 |
| height | 非 | 无 | 高度 | 组件高度， 可以不写，不写情况下，自动获取高度 |
| className | 非 | 无 | class样式名 | 该组件样式 |
| autoplay | 非 | false | boolean | 用于控制是否自动播放 |
| delay | 非 | 3000 | number（毫秒） | 自动播放的间隔时间 |
| onBeforeChange | 非 | 无 | 切换前的回调函数 | 参数：（currentIndex) |
| onAfterChange | 非 | 无 | 切换后的回调函数 | 参数：（currentIndex) |
| pagination | 非 | 无 | React.ReactNode 或者 ((instance: React.ReactInstance) => React.ReactNode) | 分页按钮 |
| controllable | 非 | true | boolean | 是否可以手动控制 只支持移动端 |
| fadeEffect | 非 | false | boolean | 开启渐变， 默认是scroll-x |
| sensitivity | 非 | 30 | number | 敏感值，设置多少后可以进行切换, 只有在 controllable = true时， 有作用|

## 注意

该组件更新比较多，具体看参数说明