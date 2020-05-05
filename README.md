# ab-better-move

支持 PC 和 Mobile 端

## 引入方式
```javascript
import { Move } from 'autobest-common-ui';
```

## 使用方式

```javascript
export default class MoveDemo extends React.Component {
  render() {
    return (
      <div className="demo-modal">
        <Move>
          <div style={{ backgroundColor: '#0fcc40', width: '100px', height: '100px' }}>content</div>
        </Move>
      </div>
    );
  }
}
```

## 参数说明

| 属性 | 必传  | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ | ------ |
| children | 是 | 无 | number | 移动的元素，必须是HTMLElement元素 |
| scalable | 非 | true | boolean | 是否支持移动端缩放功能 |
| minScalable | 非 | 1 | number | 缩放的最小值 |
| maxScalable | 非 | 2 | number | 缩放的最大值 |
| horizontalPlacement | 非 | left | string | 内容水平位置，`left` `center` `right` |
| verticalPlacement | 非 | top | string | 内容垂直位置，`top` `center` `bottom` |
| onAfterChange | 非 | 无 | 切换后的回调函数 | 参数：（name?:string) |

## 注意

无