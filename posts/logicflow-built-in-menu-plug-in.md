---
date: 2023-01-31
title: LogicFlow内置菜单插件
tags:
- LogicFlow
- 流程图
description: LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。
---

# LogicFlow内置菜单插件

>LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。

这一节将讲解快速上手 LogicFlow 流程图编辑框架的内置菜单插件，项目整体基于[Vue3+Vite3+Ts4](https://1024code.com/codecubes/0z9xIZl)开发，为帮助还为熟练使用 Vue3 和 Typescript 语法的小伙伴提供便利，如果你已经很熟练在Vue3中的开发习惯，建议直接访问 [LogicFlow](http://logic-flow.org/) 将获取完整的入门指南。

## 1. 菜单插件安装配置：

菜单插件的安装和配置同上一节的内置插件配置，同样是将导入的 `Menu` 对象在LF实例化时传入 `plugins` 选项。

默认的菜单支持情况如下：

|             |      |      |         |
| ----------- | ---- | ---- | ------- |
| 节点右键菜单 | 删除 | 复制 | 编辑文案 |
| 边右键菜单 | 删除 | ❌ | 编辑文案 |
| 画布右键菜单 | ❌ | ❌ | ❌ |

## 2. 菜单项配置：

下面表格中列出的就是每个菜单项所支持的配置选项，仅有 `callback` 是必传选项：

| 字段 | 类型 | 作用 | 是否必须 | 描述 |
| --- | ---- | ---- | ---- | ---- |
| text | string | 文案 |  | 菜单项展示的文案 |
| className | string | class名称 |  | 每一项默认class为lf-menu-item，设置了此字段，calss会在原来的基础上添加className。 |
| icon | boolean | 是否创建icon的span展位 |  | 如果简单的文案不能丰富表示菜单，可以加个icon设置为true,对应的菜单项会增加class为lf-menu-icon的span，通过为其设置背景的方式，丰富菜单的表示，一般与className配合使用。 |
| callback | Function | 点击后执行的回调 | ✅ | 三种菜单回调中分别可以拿到节点数据/边数据/事件信息。 |

## 3. 追加菜单选项：

默认的菜单肯定是不能够覆盖实际的业务场景的，所以菜单插件安装后提供了 `addMenuConfig` 来扩充原有的菜单项，扩充菜单仍然需要在渲染前操作：

下面这段代码配置分别为节点右键菜单添加了分享和属性两个菜单，边右键菜单添加了属性菜单，画布右键菜单添加了分享菜单。

```typescript
const menuConfig = {
  nodeMenu: [
    {
      text: '分享',
      callback() {
        alert('分享成功！');
      }
    },
    {
      text: '属性',
      callback(node: any) {
        alert(`
          节点id：${node.id}
          节点类型：${node.type}
          节点坐标：(x: ${node.x}, y: ${node.y})`
        );
      },
    },
  ],
  edgeMenu: [
    {
      text: '属性',
      callback(edge: any) {
        alert(`
          边id：${edge.id}
          边类型：${edge.type}
          边坐标：(x: ${edge.x}, y: ${edge.y})
          源节点id：${edge.sourceNodeId}
          目标节点id：${edge.targetNodeId}`
        );
      },
    },
  ],
  graphMenu: [
    {
      text: '分享',
      callback() {
        alert('分享成功！');
      }
    },
  ],
};

lf.value.extension.menu.addMenuConfig(menuConfig);
```

## 4. 重置菜单选项：

当默认的菜单项不够使用时可以追加新的菜单选项进入，当不需要提供的菜单时就需要重置掉自带的这几个菜单项目，可以按照下面的代码操作：

```typescript
edgeMenu: false, // 删除默认的边右键菜单
graphMenu: [], // 覆盖默认的边右键菜单，与false表现一样
```

## 5. 指定类型元素配置菜单：

上面对菜单的增加和重置都是基于比较大的范围做的操作，菜单项看起来都一模一样的，那么为不同类型的元素如何配置不同的菜单项呢？接着往下操作：

```typescript
lf.value.extension.menu.setMenuByType({
    type: 'rect',
    menu: [
      {
        text: '分享',
        callback() {
          alert('分享成功ByType！');
        }
      },
    ]
})
```

PS：上面的代码把节点类型为 `rect` 的菜单替换为了仅有一个分享菜单项，其它的按类型配置相同。

## 6. 指定业务状态设置菜单：

不同的业务节点会拥有不同的状态，不同的状态下支持的菜单项也是不相同的。

- 在自定义节点时根据不同的业务状态设置菜单项；
- 在自定义节点中无法直接使用LF实例，需要通过 `graphModel` 来派发事件进行消息通知；
- 优先级：指定业务状态设置菜单 > 指定类型元素配置菜单 > 通用菜单配置 > 默认菜单。

下面的代码是很经典的自定义业务节点的代码，其中需要说明的是 `isDisabledNode` 为节点预留的 `properties` 属性挂在的扩展业务节点，`eventCenter.emit()` 自定义业务节点内派发事件的函数，还需要配置对应的接收函数来处理：

```typescript
import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomNodeModel extends RectNodeModel {
  setAttributes() {
    this.stroke = '#1E90FF';
    this.fill = '#F0F8FF';
    this.radius = 10;
    const { properties: { isDisabledNode } } = this;
    if (!isDisabledNode) {
      // 单独为非禁用的元素设置菜单。
      this.menu = [
        {
          text: 'del',
          callback: (node: any) => {
            this.graphModel.deleteNode(node.id);
            this.graphModel.eventCenter.emit('custom:event', node);
          },
        },
        {
          text: 'edit',
          callback: (node: any) => {
            this.graphModel.setElementStateById(node.id, 2);
          },
        },
        {
          text: 'copy',
          callback: (node: any) => {
            this.graphModel.cloneNode(node.id);
          },
        },
      ];
    }
  }
}

export default {
    type: "CustomNode",
    view: RectNode,
    model: CustomNodeModel,
}
```

补充监听事件函数：
```typescript
lf.value.on('custom:event', (r) => {
  console.log(r)
});
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62c12dc8a3de415cab55ea547c3e08ae~tplv-k3u1fbpfcp-zoom-1.image)

## 总结

这一节的内容就到此结束了，代码量相对校多，很多配置也依赖前面几节的学习，还有对于自定义Edge的添加菜单也是类似的操作，到此内置插件的使用就到此告一段落了，接着还有最后一个小节，就是要自定义插件，自定义插件将更有益于代码的复用，期待一下吧~

<Comment />
