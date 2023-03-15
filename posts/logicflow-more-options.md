---
date: 2023-01-12
title: LogicFlow更多配置选项
tags:
- LogicFlow
- 流程图
description: LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。
---

# LogicFlow更多配置选项

>LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。

这一节将讲解快速上手 LogicFlow 流程图编辑框架的更多配置选项，项目整体基于[Vue3+Vite3+Ts4](https://1024code.com/codecubes/0z9xIZl)开发，为帮助还为熟练使用 Vue3 和 Typescript 语法的小伙伴提供便利，如果你已经很熟练在Vue3中的开发习惯，建议直接访问 [LogicFlow](http://logic-flow.org/) 将获取完整的入门指南。

## 1. 设置主题 Theme：

LF设置主题时提供了两种方式的实现，分别是在实例化LF对象时通过 `style` 选项进行配置，另一种方式是在实例化LF对象后使用内置的 `lf.setTheme({})` 函数进行配置

设置主题的常用属性列表（完整的选项列表参见[ThemeApi](http://logic-flow.org/api/themeApi.html)）：
| 属性名	| 说明 |
| ----- | ---- |
| stroke	| 属性定义了给定图形元素的外轮廓的颜色 |
| stroke-dasharray	| 属性可控制用来描边的点划线的图案范式 |
| stroke-width	| 属性指定了当前对象的轮廓的宽度 |
| fill	| 属性用来定义给定图形元素内部的颜色 |
| fill-opacity	| 属性指定了填色的不透明度或当前对象的内容物的不透明度 |
| font-size	| 属性定义文本字体大小 |
| color	| 属性定义文本颜色 |

- 实例化LF时配置：
```typescript
const styleConfig = {} // 主题配置项

lf.value = new LogicFlow({
  container: container.value,
  grid: true,
  // 实例化LF时配置主题
  style: styleConfig,
})
```

- 实例化LF后配置：
```typescript
const styleConfig = {} // 主题配置项

lf.value.setTheme(styleConfig);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72b756308bc54e85bf2a44e5577fc3aa~tplv-k3u1fbpfcp-zoom-1.image)

PS：节点的 `width`、`height`、`r` 等类似属性统一归类为形状属性，因其会对锚点位置、连线计算产生影响，顾不能通过主题进行设置，仅支持在自定义时调整。

## 2. 设置网格 Gird：

网格在LF中主要起到的作用是对节点的中心点和移动时的定位，默认网格选项关闭，中心点和移动的最小单位为`1px`，当开启网格选项后，渲染的中心点和移动时的最小单位将调整为`20px`。在自定义节点的宽高时为了更好的与网格对齐，建议设置为网格最小单位的整数倍。

```typescript
const gridConfig = {
  size: 20,
  visible: true,
  type: 'mesh',
  config: {
    color: '#ababab',
    thickness: 1,
  },
}

lf.value = new LogicFlow({
  container: container.value,
  grid: gridConfig,
})
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cd81718e0c04c88bd615376384c00c9~tplv-k3u1fbpfcp-zoom-1.image)

## 3. 设置对齐线 Snapline：

网格解决了一个节点的中心点和移动时的定位对齐问题，那么多个节点的位置调整就需要用到对齐线辅助进行了，该`snapline`选项默认开启，对齐线的样式可以通过设置主题中的选项来自定义；

```typescript
const styleConfig = {
  snapline: {
    stroke: '#1E90FF', // 对齐线颜色
    strokeWidth: 1, // 对齐线宽度
  },
}

lf.value.setTheme(styleConfig);
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/940225a839524fd2a50400869a97ca08~tplv-k3u1fbpfcp-zoom-1.image)

## 4. 设置背景 Background：

在前面的示例中一直是启用了Gird来充当着背景的角色，LF对象在实例化的时候同样可以通过选项来控制背景，默认是关闭的状态，修改的选项是`background`；

```typescript
lf.value = new LogicFlow({
  container: container.value,
  // grid: true, // 关闭网格
  background: {
    backgroundImage: "url(../grid.svg)",
    backgroundRepeat: "repeat"
  }
})
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec2ceb686e594a69bde0e10a3c011ba0~tplv-k3u1fbpfcp-zoom-1.image)

## 5. 设置键盘快捷键 Keyboard：

快捷键在流程图产品中也是比不可少的一块功能，可以大大方便使用者的体验，在LF中默认关闭了快捷键的使用，可以在实例化LF时通过启用`enabled`选项来支持；LF除内置的快捷键外也支持自定义来扩展快捷键的使用；

- 内置快捷键

| 快捷键	|  功能  |
| ----- | ----- |
| cmd + c 或 ctrl + c	| 复制节点
| cmd + v 或 ctrl + v	| 粘贴节点
| cmd + z 或 ctrl + z	| 撤销操作
| cmd + y 或 ctrl + y	| 回退操作
| backspace	          | 删除操作

- 启用快捷键
```typescript
lf.value = new LogicFlow({
  container: container.value,
  keyboard: {
    enabled: true
  },
})
```

- 自定义快捷键：快捷键keys的定义规则同`mousetrap`；下面使用官网的示例来演示自义定删除节点的快捷键触发时增加二次确认的提醒；
```typescript
lf.value = new LogicFlow({
  container: container.value,
  keyboard: {
    enabled: true,
    shortcuts: [
      {
        keys: ["backspace"],
        callback: () => {
          const r = window.confirm("确定要删除吗？");
          if (r) {
            const elements = lf.value!.getSelectElements(true);
            lf.value?.clearSelectElements();
            elements.edges.forEach((edge: EdgeConfig) => lf.value!.deleteEdge(edge.id || ''));
            elements.nodes.forEach((node: NodeConfig) => lf.value!.deleteNode(node.id || ''));
          }
        }
      }
    ]
  },
})
```
	
## 6. 设置图编辑方式：

LF提供了更多方便控制图编辑方式的选项，同样是可以在实例化LF时通过选项初始化，也支持实例化LF后通过`lf.updateEditConfig`函数进行调整；

图编辑模式支持的选项列举（完整的选项列表详见[editConfigModelApi](http://logic-flow.org/api/editConfigModelApi.html)）：

| 属性名	          | 默认值	| 说明                 |
| ----------------|-------|---------------------|
| isSilentMode	  | false	| 是否为静默模式        |
| stopZoomGraph	  | false	| 禁止缩放画布          |
| stopScrollGraph	| false	| 禁止鼠标滚动移动画布   |
| stopMoveGraph	  | false	| 禁止拖动画布          |

- 如下启用了只读的静默模式、禁止缩放、禁止鼠标滚动移动画布、禁止拖动画布：
```typescript
lf.value = new LogicFlow({
  container: container.value,
  isSilentMode: true, // 静默模式
  stopZoomGraph: true, // 禁止缩放
  stopScrollGraph: true, // 禁止鼠标滚动移动画布
  stopMoveGraph: true, // 禁止拖动画布
})
```

- 通过`lf.updateEditConfig`更灵活的调整：
```typescript
lf.value.updateEditConfig({
	isSilentMode: false
});
```

## 总结

这一节的内容就到此结束了，现在对主题、网格、对齐线、背景、快捷键和图编辑方式都了解了吗？这些选项并非是必须的，但是在需要的时候要知道怎么配置，下一节开始要着手准备插件部分的学习了，加油~

<Comment />
