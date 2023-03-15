---
date: 2023-01-30
title: LogicFlow内置插件使用
tags:
- LogicFlow
- 流程图
description: LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。
---

# LogicFlow内置插件使用

>LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。

这一节将讲解快速上手 LogicFlow 流程图编辑框架的内置插件使用，项目整体基于[Vue3+Vite3+Ts4](https://1024code.com/codecubes/0z9xIZl)开发，为帮助还为熟练使用 Vue3 和 Typescript 语法的小伙伴提供便利，如果你已经很熟练在Vue3中的开发习惯，建议直接访问 [LogicFlow](http://logic-flow.org/) 将获取完整的入门指南。

## 1. 内置插件介绍：

这里介绍三个比较常见的功能，这样的功能也被 LF 做了内置的插件来进行简单的实现，在你的实际业务中还是需要通过插件的扩展来实现更加丰富的功能。那么这三个功能和每个功能对应的插件分别是：

- 第一个功能是通常在页面左侧的拖拽面板，对应的插件是 `DndPanel`，用来将代表不同业务的节点拖至流程画布中；
- 第二个功能就是框选功能，对应的插件是 `SelectionSelect` ，用来框选一个或多个业务节点，以便下一步的操作；
- 第三个功能就是分组，对应的插件是 `Group` ，用来将一组具有关联性的节点放到一个分组。

这三个插件的配置已经在上一节中完成，你只需要**fork**上一节的代码就可以开始本节的学习了，准备好就要开始了~

## 2. 拖拽面板插件的配置&使用：

拖拽面板的插件配置相对简单，只需要掌握下面这几个配置就可以搞定了：

|		名称	|		类型	|		描述		|
|---------|---------|-----------|
|	type	|	string	|	指定用户鼠标可以拖入的节点类型，包括自定义节点类型， 不传则不会创建节点，只会触发callback |
|	text	|	string	|	创建节点的文本 |
|	properties	|	object|	创建节点的properties |
|	label	|	string	|	拖拽面板节点文本描述 |
|	icon	|	string	|	拖拽面板上显示的图标，可以传入图标url地址或base64编码 |
|	className	|	string	|	额外传入可以拖拽项的class, 用于自定义拖拽项的样式 |
|	callback	|	fn	|	用户鼠标按下拖拽项后触发的回调 |

### 2.1 配置拖拽面板数据：

案例配置中准备了三中业务节点类型，分别是开始节点、用户任务节点和结束节点，它们的配置如下：
```typescript
const patternItems = [
    {
      type: 'circle',
      text: '开始',
      label: '开始节点',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAABQVJREFUWEfNWF1oHFUU/s5sUhVTyc5GUBqlpDObWol9UYr2webNIqQgQrA1LdZgsjNNpBZbsQHrTy2VaqXdnU2qVhEsgpW2CmkFSQtqffGvNBKT2QYLUhCzs9EoKN2ZI3d2NzvZ7M9ksxEH9mXvOd/55tw7557vEKp8moZ+vt120i0SuIWZwyBaDYcCAE8yMEmgyfrlDV/8uvW2v6oJQQtxajz8fSMtu7kTRJ0EtPvyJRqGg/NSHY9M9ajf+fIB4ItY4+DkWsm2uyChE4xmD/iomx3GFEk0Jf5nh5uY0ESglQDf47FNA4jaaUR/71evVCJYkVjIMHUmvASG7AYGvpWYTzmSdCYVUUbLBbg1llAcwkYGbwQgfgIhCeaopbfuK+dblpgcT5wA82M5QgAdS2nKsUpvW2xdjo13gqQ+AOvFOgGfJjW1oxRWSWJyPHEVzHe6IEwDSV3ZXw2hQp9QLLGXiV/J/n/N0tQVxXCLEpONiR8AWpvJFG9JaeETtSCVwwgaE5sJ9EFmZ/knSw/fVYg/j5gcN3eC8YYwtDS14hlcDGHZMDnr/6alqTu9WHMChwbNTezgtGvg4AFrh/r1YgJX8pWj5v2QcDGTOedF7wcxSyw4dKWN0s4wCM0gPGNF1MOVgGuxnt8hTtppWpcrJbPE5Jh5CIRdohykNPXeWgT1iyEb5pfZr3V2S11ioqJLNzZcFsWTQT1+SkJjfGwloW4Xk/P2dG/rJb8kypSSDwGkpQDWiRvCJRaMTfQQ0eBCsiXHxveBpBcATDI721J6q3jrqh/ZMM8CeChXmjLEDHNE3H3MvD+lhwf8oHuIiWL5GzNttXTlnB/fYjbBmPkcEQ4wcCGlqe0Uio+vYJZ+EcaSJN031bvqGz/gXmJZ+78hBbqs3paTfvwLbeRBcw0c/OjymLFvocaj5gYpgPMAxixNXeMXtAixrCtvt7Twu35xvHayYYq7924wbSTZMLsBvMXAJylN3eQXsDQxcQ9Sf1JTjvrFytkFDfMMAR3M0CkUmzjIRLvBOG7p6pN+wcoRExgEPJ/U1AN+8YSdHDPfAWE7GK+TbCQ+BvgRInotGVH2+AWqREzgODbap/vUC34xQ/HEQWbeDaZTJMfNj8B4dCmIEfMTST38XnXEjImXARqo9VaC6HK6/oYNf3TfYfklNmcrQ3Gzixnv1/LwA7joLAtsnu5uueqXVLae5g9/MJ5YT8yiao9amtrmF6jMGfvsunPTlpkdzUm/WDk72UhccnWCKBdChjn29WtikYnaKvXxsyD5Kykfn/mkbNPjiX71n4WSEvrAJjaFX33D8oY5VxIxDyT1sK8Wel7GCMetiP9yU0g8ZCT6GHwERMNWRHm4Fpc4QHTEiihPLzRLBVV/2FVSTM9aunKo6rYnaCSeIvAQE72aiih7F0Uqo6Dmtz3Zqvv/axQFMVdtsz0ihG0t5VqlTOblXInWWgC4qhuIul/oEsi2QpJzZVwJMTJbBjzq+7+Sb8VUeXHB61HhSyHj5sg2oKgaLz0i8KjxWso5r6AupcKzbVPp4+kFEUKllkMVAPPUt5dJxRGAq85tRF0hnB1DgflcIBA4XUkfiD6ebXQQ4UGhgDKBazCGyr1BVqVvKzK4G2PALD64wyq3f88/tR3cedNbzahTyDGJ6XOq47M1H3UWO4VC9tlpSZUCUIhZZZIUsGj188Nh6c/0V1N7Vs9UKrLF1v8FJ5yEXcWLNvkAAAAASUVORK5CYII=',
    },
    {
      type: 'rect',
      label: '用户任务',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAABeNJREFUWEfNWH+IFHUU/7zZ0grCdu4iFD3Km9mL7J/8QWQX9IvSLIukMisyNc6d8YIif0RFRkZmUpDu7B1l2Q9NsyKy8gf9pDMJT4PQ6Hb2TDSM4Pa7WZB4uvNiZnb2ZuZmd+fOf+7BwN5837z3+b7f7wgjlGiE4sJZAbtonXm9lIBCzCqTpAAWM0m/SeAeJuwXi9Vfh3vxIQOTM/kZAN8Mwr0AJtRRfIgI29mi74Wu7BwKyNjAktn8tcRoB/i+gAJCPxh/OY9NhEuchzEqCIS2MmFdMa3siQMwFjA5Y74KwuM+gTvB9LXE/E3fEvVAlKLG9eZki+hGEN8EYEaFh/Ga0NUn6oGrC0zOmj+CcY0riHtAtEak1bfqCfafy1lzAZiXAdRStupekVan15JRE5hsmOz7eNvphKX929bSNxRQHu+FnT2N55YkA8A93juhqVX1Vz1oMMxNDMxzwoaxqaCrD0a6zMhPKYGmEfHVjk2ZfkqA9/Vpyv4o/oaM+T4THnDDEZsLmur8DlMksGQ2t4qYnna9Zz0v9JaVUR8njdzrBGqPOmPwuqKWeizqTM70rARJzzniiV8splPP1AXmZh93uTfijoKWSkcKN3KvAPRk+Ww32/HnfOPE0S3lmFwrtNTSSMsZuSyDFrvgqDWcrYMsJhv5LW5J4J7TCW6Niqlkpvd+ImtzNYsGLMLSvKLe/EEYXGPnkbFW6XQ3gHEAbRWaMtfPEwCWXN9zG0nSFw4DYWG17JMN80M7iAn4eXTiROvxtqn/+YWO6+y+4FRpTBcDVwHYJjTVLsaDKHABy5pVXNLypccUACZn8h0gbgOwS2jqQO0JiZQz5jEQxoPxltDVhdFKzQ0gLADjD6GrkR3CtVr/QYBkMHUKXXFc69rFR3I2fxzMY2sFvM3uAasV4JXEqAHMllXJUqI/RVoZNwhYuSF/6xxImC4Wq3ujLOEAK7sSwG6hqbdGWswwd5WToKor7e+S2d7bia3t9m+rhBv+ble/C1hMNsxFAN4AoV+k1dHVQLkWG0j3qFh0Kz02ODJqlBtPh5w1T9m9lZjnFPTUJwFgDZncy0y0DMAxoalNtYCVrXYQwCRPOeOccrk40+LVKACHhKZeGUPW0fKk8qjQ1DdDFst/DPDdYHQLXZ1WT1jIpVHsNV0YiO2MuQ+EqUy0vJhW1oSA5T4CaM5QgDnBmzUfYsYdlUZP2GvPYIW0+l6cy5WTyQXGvLyop4LAktn8KmK221AsV8ZVGodPNkzXlb7aWSkX5Zu/Gyf44ygbCo8X/BJwZ5+mfhZ0ZYd5BSwccqqFhSnVBkC/wmRn7xj0owmJUpMEaaKT8rAOo5Q4ilE4WmxrPlEPYKhMTfL2hGCBNUw305iWCl1ZW01o0sjNkkDzvLGoGp891ljgzUUt5ba5CEpmzAwRtHAGB4A1ZM2XmLECwE6hqTPDchoyuflMWAhQa+jsJECm+45VAOcHz7mLGBsKempjyOJNOGN1E+FiIqwupNWnvPNwr5wB4h2ufF4q9FTFanI2/zaY5w8I5h/A9I5Eia4+baJTwzxqNA63WFxqBfHDAF1XOSDaKNLKI97fcibXASK7N9uzz0z/JlVj7MHJM6POG//PoglCNkwbrNPUmXBAYnqhoCmf1osf+7zByN9lET9LjMllfscbsi+m64499of+QRHgr8C8x1fJI10cB6D/cnabAkn2Rd1xPM6gaDNGrGtAyA1xwIR5BoeDjSp6nau6jATXNjoiNOWy4YAZBM7I/w7wpc57QtU1Lv76RtjF7CwYVVO/FnC7xBBROxiVMWlY65unxL/GuZdE1kpIq4ttzXYbqUvJzt4mqWStYKCy1NRa2zyBdTdxNyF865yb24KYdliStKWYbv48Cp09AEqWNZeJZzqjc5mqrWthGbGADWTrCPuniv82ziZFidmQMNvZD2oQA3nALtjSjqKmuIU7JsW2WJQ8uwEnJJaZyHlgWSCJ+iRGXwmlI0Xt8l9i4hjEdlbAhqs0zncjFtj/TvCsRdmJzTwAAAAASUVORK5CYII=',
    },
    {
      type: 'circle',
      text: '结束',
      label: '结束节点',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAA+ZJREFUWEfNmF+oFHUUx7/nt3rpIeTO3MQMfLGZNRBS0JesBy1D8soVMyqKnrypO5tCPSRk4A1UsIcCb/tb/FMPgoJRkaXlg5ebgvmSiILi3d/US0Rl985chB5aunNidnZ2Z9bdnb17dZuFfdj9nT+fOef3O+fMj5DSD6WUC3MC6x9VazOCdSaqfOF5IEGTgjHpCdjOTvNWtw8+azDtk4mNRJkhCAyBeXGC45tE+JY9uujkjfOzgewYTCvaTxNjF8CvzMZBXZZOM2HUzRmXO9HvCEwrlvYT094Gg3cBXCHgEjP+ZBJ/+OvE3qNEWMTgNSB6Hoy+mB7jYydvvpMElwg2INVJBl6rGSIa85gPTz9SPo+Xl5fbOVhw/Fc9U/7nJYC3E7CqbgNXnJy5pp1uWzBdKm5QftOxzONJT9tsXZP2dgIfia45ltnSf8sFvah+BOOp0BAjs8K1lt7oBirU0aT9AoG/C38TcGrKMl9vZrMpmF5QH4HwdqjQ7sm6AY1mgokPuLns+4127gHTZGmQQGfrkaKNrmV83w1AKx1N/vIkYeZ6zQfRM42nNQ42zvP0W/YlUJBCBu1wLeNoKwd6YWIEQjA8j5z8spHZwMf3HJ12LOPVqH4MrOKIxL4AClddy1zdzpkm1TgBa32ZbtKtSfVTeFoZ8czEwDSpzhAw1Em0fJm5g9VPKoNHXSu7O3Iw6jHRpXIB9INQ/nf+Q4vvDi9xHmTEHj6sFvbNw28A5jNgu5Zp3gPWXyitFETXggU+51jZTUl7Zq4R8+3rUo0BeDbI0swK13qiUpJqqRwoqjeYcaL6594pyzzYC7ABqd5j4IDvSwCbJy3zmxiYVrT3E3PQDxnDTt78tBdgekFtAyHoJoRtTs78LAamy9IXAG0NuMQm13r8XC/ANPnzIMGr1E1m3uPmsx82gNlfAvzi/wpGtMfNGXGwgULpEBO9220qk6LrzWDd9C7zh0a5WCqB2pBQ2/y6VMMAjnW7+bsFi25+Yt46lc9+FUulP7+LDMaDVNLXrmVsSXLml4skmXCdZ/BB04hJ5Y/cG3y5aFTrld/vk7ftv6sT57Rzp7wII+0HwU6hWsp9frNPn+z7C8ACEP3u5IzHQtl4r5T2WYAHK/TA5ulqTZkzQAsD/VINCeBMsK/piJM3djYHizRxEI05OWP9g4Ly7epF+wKYn6twed6g+9ay6BAZcd0w9iBySu43YPSwAQljj+88nYNiNSypHK3DlKXyZaQGl8bXtxAulS+8IVwqrwjqcCm8VInWsNRdQzUrsNXGbxCzySQMwGMmcVuAJ5hwtacXd/e7A7Syl3gN1SuQRj//ARDQB0UouH96AAAAAElFTkSuQmCC',
    }
  ]
```
### 2.2 将配置完成的数据装载到LF：

插件正确安装后就可以在LF实例的extension属性中读取对应的插件对象了，这里要通过 `dndPanel.setPatternItems(data)` 函数来为LF实例装载数据：

```typescript
// 在执行render前配置
lf.value.extension.dndPanel.setPatternItems(patternItems);
lf.value.render();
```

数据配置成功后就可以看到页面左侧的拖拽面板了，在你的项目中试一下吧~

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05fc4353aaca45c580d1abb87bc71316~tplv-k3u1fbpfcp-zoom-1.image)

## 3. 框选插件的配置&使用：

框选插件在使用时必须要提到的是，开启框选功能的方式有两种，其中一种是通过LF实例化时的选项进行开启和关闭、第二种就是通过插件提供的开启和关闭的函数动态实现。

### 3.1 开启&关闭框选：

- 通过选项开闭：因为框选功能和画布拖拽功能属于互斥功能，所以是通过 `stopMoveGraph` 一个选项控制的，如果选项开启则表示禁止移动画布（开启框选），反之则是开启移动画布（禁止框选），我在源码处预留了这个选项，你可以打开注释尝试一下；

- 通过插件提供的函数开闭：需要结合前面的拖拽面板，这也是符合使用习惯的一种方式，当需要框选节点时点击拖拽面板的框选图标开启框选功能，在框选结束后关闭框选功能，后面的案例会展示这一块；

开启函数：
```typescript
lf.extension.selectionSelect.openSelectionSelect();
```

关闭函数：
```typescript
lf.extension.selectionSelect.closeSelectionSelect();
```

### 3.2 框选的灵敏区域：

- 默认需要框选整个节点才选中节点
- 默认需要框选边的起点、终点才选中边

可以使用 `setSelectionSense` 函数调整：
```typescript
lf.extension.selectionSelect.setSelectionSense(false, true);
```

| 参数 | 默认值 | 描述 |
|-----| ------ |--- |
| isWholeEdge |	true |	是否要边的起点终点都在选区范围才算选中 |
| isWholeNode |	true |	是否要节点的全部点都在选区范围才算选中 |

### 3.3 结合 DndPanel 控制框选功能：

在 `Dndpanel` 示例的 `patternItems` 数据中新增下面的配置，通过点击元素后触发的 `callback` 事件启用框选，并监听选中事件后关闭框选来完成功能的切换；

```typescript
const patternItems = [{
  label: '选区',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAUdJREFUWEftV9ENwiAQPXAB7Q7GMWzX0TiDdgZjHcd2DNMd1AHsYWgCuTbFlFw/aANfDfCOxzt4PQQE2kSgvCAS881MVGwyxTZF/egHUw3kn9O21P10XCisXsfdRfevr3UqVnA22Pdhm5nvoZh0nK7nTKUOIgBSOhkbyCgxO64wp8TkCtpNKYCSLpwUtaLx+uMLIqYw17tBlKVRLLnXZ0C0incUk2iVNv0abzFCtqnmK0ZS5XuI+/OT2/MCHGJcAlx89DFfBf/ahQlGfcp3gaEzpoTcD/mcv12EdPg7BhsSMZdPTZFKGoP63KhUcglw8fOzi9ahSXNJ7qvM2LjjqouQDn+wt9JVCPqmbnKD5RLg4ud3K7k75uLnfytBSoVfqGxp7fA5/UqSrtLaYDgVbHwlkXfnqJ94sA9e7q3i4qOP+SoYFVuMYj+QKUM2eJOYrwAAAABJRU5ErkJggg==',
  callback: () => {
    lf.value!.extension.selectionSelect.openSelectionSelect();
    lf.value!.once('selection:selected', () => {
      lf.value!.extension.selectionSelect.closeSelectionSelect();
    });
  }
}]
```

成功配置后就可以点击选区后去选中几个拖拽好的节点了~

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b02f15de87e541f49ace11840ba37387~tplv-k3u1fbpfcp-zoom-1.image)

## 4. 分组插件的配置&使用：

分组插件的使用还是很简单的，这里需要重点关注一下自定义分组，因为这里跟前面小节的自定义业务节点和自定义Edge一样，需要继承内置类去进行各种函数的重写。

### 4.1 默认分组&数据格式：

默认的分组和分组的数据格式如下，通过 `type` 为 `group` 的节点提供的 `children` 属性填充进去需要放到一组的节点ID，就完成了分组；

```typescript
const graphData = {
  nodes: [
    {
      type: 'group',
      x: 200,
      y: 200,
      children: ["node_2"],
    },
    {
      id: 'node_2',
      type: 'circle',
      x: 200,
      y: 200,
    }
  ]
}
```

### 4.2 自定义分组：

- 准备自定义分组的模板：
```typescript
import { GroupNode } from "@logicflow/extension";

class MyGroup extends GroupNode.view { }

class MyGroupModel extends GroupNode.model { }

export default {
    type: "my-group",
    model: MyGroupModel,
    view: MyGroup
};
```

- 优先注册&使用：

```typescript
// 导入模块
import MyGroup from "./MyGroup";

lf.value.register(MyGroup);
```

```typescript
const graphData = {
  nodes: [
    {
      type: 'my-group', // 换为自定义分组的type名称
      x: 200,
      y: 200,
      children: ["node_2"]
    },
    // ... 省略部分代码 
  ]
}
```

- 自定义样式：
> 重写`getNodeStyle`函数
```typescript
getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = "#AEAFAE";
    style.strokeWidth = 1;
    return style;
}
```

- 自定义形状：
> 重写`initNodeData`函数
```typescript
initNodeData(data: any) {
    super.initNodeData(data);
    this.isRestrict = true;
    this.resizable = true;
    this.width = 200;
    this.height = 180;
}
```

- 更多的状态：
> groupModel除节点通用的属性外，还有下面这些状态属性的支持，建议在setAttributes函数配置；
```typescript
setAttributes(): void {
    this.isRestrict = true;
    this.resizable = true;
    this.foldable = true;
}
```

| 名称	| 类型	| 描述	|
| ----- | ----- | ----- |
| isRestrict	| boolean	| 是否限制分组子节点拖出分组，默认false	|
| resizable	| boolean	| 分组是否支持手动调整大小，默认false	|
| foldable	| boolean	| 分组是否显示展开收起按钮，默认false	|
| width	| number	| 分组宽度	|
| height	| number	| 分组高度	|
| foldedWidth	| number	| 分组折叠后的宽度	|
| foldedHeight	| number	| 分组折叠后的高度	|
| isFolded	| boolean	| 只读，表示分组是否被折叠。	|
| isGroup	| boolean	| 只读，永远为true, 用于识别model为group。	|

## 总结

这一节的内容就到此结束了，本节中的三个插件都是非常实用的功能，在实际业务中也需要做更多的功能扩展，所有内置的插件使用和自定义是很有必要掌握的，下一节准备了内置插件中一个比较重要的的插件**菜单**，没有成功运行的小伙伴要赶紧调试代码了~

<Comment />
