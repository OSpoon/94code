---
date: 2023-01-11
title: LogicFlow自定义边（Edge）
tags:
- LogicFlow
- 流程图
description: LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。
---

# LogicFlow自定义边（Edge）

>LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。

这一节将讲解快速上手 LogicFlow 流程图编辑框架的自定义边（Edge），`Edge` 就是连接 `Node` 与 `Node` 之间的元素。项目整体基于[Vue3+Vite3+Ts4](https://1024code.com/codecubes/0z9xIZl)开发，为帮助还为熟练使用 Vue3 和 Typescript 语法的小伙伴提供便利，如果你已经很熟练在Vue3中的开发习惯，建议直接访问 [LogicFlow](http://logic-flow.org/) 将获取完整的入门指南。

## 1. 认识自定义边（Edge）模板：
同上一节的自定义业务节点模板一样，`Edge` 同样是需要继承自内置的 `XxxNode` 和 `XxxEdgeModel` 类，并且导出 `type` 、`view` 和 `model` 三个选项，我相信上一节的代码你能运行成功，这一节就更加简单。	

下面这段代码继承自内置的 `PolylineEdge` 和 `PolylineEdgeModel` 实现本节的自定义 `Edge`：
```typescript
// 源码位置：./src/CustomEdge.ts
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

class CustomEdgeNode extends PolylineEdge {
	// 官网指示：由于边的编辑复杂度问题，绝大多数情况下，自定义边时不推荐自定义view
}

class CustomEdgeModel extends PolylineEdgeModel {

}

export default {
    type: "CustomEdge",
    view: CustomEdgeNode,
    model: CustomEdgeModel,
}
```

## 2. 优先进行注册和使用：

优先进行注册的原因和上一节中提到的一样，这里就不再赘述了，请接着往下操作吧。

### 2.1 注册自定义 Edge：

注册过程依旧是两个步骤：
- 第一要将上面编写的 `CustomEdge.ts` 导入到 `App.vue`；
- 第二要将 `CustomEdge` 对象通过 lf 实例中的 `register()` 函数在 `render()` 前注册；

```typescript
// 导入自定义 Edge
import CustomEdge from "./CustomEdge";

// 准备两个Node，并使用自定义Edge来连接它们俩
const graphData = {}

onMounted(() => {
  // 在执行 render 前进行注册
  lf.value.register(CustomEdge);
  lf.value.render();
})
```

### 2.2 如何使用自定义 Edge：

与 `Node` 的定义相同，但是要将自定义的 `Edge` 放置到 `edges` 中，区别是 edge 需要明确 `源节点 ID` 和 `目标节点 ID` 两个值，通过这两个值来定位被 `Edge` 连接的到底是谁，`type` 同样需要指定为自定义 `Edge` 的 `type` 属性值；

```typescript
// 准备两个Node，并使用自定义Edge来连接它们俩
const graphData = {
  nodes: [
    {
      id: '242b1b6c-1721-4b10-b4ad-c895094cf332',
      type: 'rect',
      x: 100,
      y: 100
    },
    {
      id: 'e59d6ecd-68f7-4d50-8e3f-29e67b6e5f16',
      type: 'circle',
      x: 300,
      y: 200
    }
  ],
  edges: [
    {
      sourceNodeId: '242b1b6c-1721-4b10-b4ad-c895094cf332',
      targetNodeId: 'e59d6ecd-68f7-4d50-8e3f-29e67b6e5f16',
      type: 'CustomEdge',
    }
  ]
}
```

## 3. 自定义 Edge 的 Text & Outline 的风格：

对于 `Edge` 风格的自定义同样是通过重写不同的函数来实现，如重写：`getEdgeStyle()`、`getTextStyle()` 和 `getOutlineStyle()`，还有最后对箭头风格的自定义；

```typescript
class CustomEdgeModel extends PolylineEdgeModel {
  
	getEdgeStyle() {
      const style = super.getEdgeStyle();
      const { properties } = this;
      if (properties.isActived) {
          style.strokeDasharray = "4 4";
      }
      style.stroke = "orange";
      return style;
  }
  
  getTextStyle() {
      const style = super.getTextStyle();
      style.color = "#3451F1";
      style.fontSize = 20;
      style.background && (style.background.fill = "#F2F131");
      return style;
  }
  
  getOutlineStyle() {
      const style = super.getOutlineStyle();
      style.stroke = "red";
      style.hover && (style.hover.stroke = "red");
      return style;
  }
}
```

当你完成了上面几个函数的重写后就得到的下面截图的效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ade23075144c42f6b5aefac8c2420673~tplv-k3u1fbpfcp-zoom-1.image)

## 4. 开启边（Edge）动画：

增加动画可以体现从一个 `Node` 到流向另一个 `Node` 的过程，在大多数的流程图编辑软件中都有这样的功能存在。

在LF中可以通过 `lf.openEdgeAnimation(edgeId)` 启动默认动画，也可以通过重写 `getEdgeAnimationStyle()` 函数来自定义动画的属性；

- 开启默认动画：为需要开启动画的 `Edge` 增加 `id` 字段，并在执行渲染函数 `render()` 后开启动画：
  
```typescript
const graphData = {
  edges: [
    {
    	// 增加 id 字段
      id: '702a4d2f-b516-4769-adb0-5a4f4f5c07a9',
      sourceNodeId: '242b1b6c-1721-4b10-b4ad-c895094cf332',
      targetNodeId: 'e59d6ecd-68f7-4d50-8e3f-29e67b6e5f16',
      type: 'CustomEdge',
    }
  ]
}

onMounted(() => {
  lf.value.render(graphData);
  // 执行渲染后开启动画
  lf.value.openEdgeAnimation("702a4d2f-b516-4769-adb0-5a4f4f5c07a9");
})
```

- 自定义动画属性：重写 `getEdgeAnimationStyle()` 函数设置动画属性，重写 `setAttributes()` 函数开启动画：

```typescript
class CustomEdgeModel extends PolylineEdgeModel {

		// ... 省略部分代码
  
  	setAttributes(): void {
        this.isAnimation = true;
    }
    
    getEdgeAnimationStyle() {
        const style = super.getEdgeAnimationStyle();
        style.strokeDasharray = "5 5";
        style.animationDuration = "10s";
        return style;
    }
}
```


## 5. 自定义节点间边（Edge）的类型：

默认 `Edge` 的类型可以在实例化 LF 时通过 `edgeType` 选项进行调整，也可以使用 `lf.setDefaultEdgeType(edgeType)` 函数来指定；除此之外，为了满足不同的业务节点使用不同类型的边来表示还可以通过实例化LF时通过设置 `edgeGenerator` 函数进行显示规则的定义。

- 通过函数设置默认类型：
```typescript
lf.value.setDefaultEdgeType("CustomEdge");
```

- 通过选项设置默认类型：
```typescript
lf.value = new LogicFlow({
  edgeType: "CustomEdge",
})
```

- 按同节点类型设置不同的类型：
```typescript
lf.value = new LogicFlow({
  edgeGenerator(sourceNode, targetNode, currentEdge?) {
    if (sourceNode.type === 'rect') return 'CustomEdge'
  },
})
```

## 6. 自定义箭头的类型：

通过 `setTheme()` 函数中提供的 `arrow` 选项，可以指定默认 `Edge` 箭头的风格；也可以在继承 `PolylineEdge` 后通过重写`getEndArrow()` 函数来实现更多显示风格。

- 通过 `setTheme()` 函数设置剪头的风格：
```typescript
f.value.setTheme({
  arrow: {
    offset: 4, // 箭头垂线长度
    verticalLength: 2, // 箭头底线长度
  }
})
```

- 通过重写 `getEndArrow()` 函数，按 `properties` 传递的类型来实现不同的效果：
```typescript
class CustomEdgeNode extends PolylineEdge {
    getEndArrow() {
        const { model } = this.props;
        const { properties: { arrowType } } = model;
        const { stroke, strokeWidth } = this.getArrowStyle();
        const pathAttr = {
            stroke,
            strokeWidth
        }
        if (arrowType === 'half') { // 半箭头
            return (
                h('path', {
                    ...pathAttr,
                    d: 'M 0 0 -10 5'
                })
            )
        }
        return h('path', {
            ...pathAttr,
            d: 'M 0 0 -10 -5 -10 5 z'
        })
    }
}
```

## 总结

这一节的内容就到此结束了，你的代码都运行起来了吗，文中缺少了一些运行的效果图，你可以直接访问我在[1024code](https://1024code.com/codecubes/FkuC19u)的项目在线预览效果来与你的代码进行对比学习。下一节将带来 LF 使用时更多的配置选项介绍。

<Comment />
