---
date: 2023-01-09
title: LogicFlow安装与准备工作
tags:
- LogicFlow
- 流程图
description: LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。
---

# LogicFlow安装与准备工作

>LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。

这一节将讲解快速上手 LogicFlow 流程图编辑框架的准备工作，项目整体基于[Vue3+Vite3+Ts4](https://1024code.com/codecubes/0z9xIZl)开发，为帮助还为熟练使用 Vue3 和 Typescript 语法的小伙伴提供便利，如果你已经很熟练在Vue3中的开发习惯，建议直接访问 [LogicFlow](http://logic-flow.org/) 将获取完整的入门指南。

## 1. 初始化项目：

- （1）如果你在本地初始化项目，你可以直接使用 `npm create vite` 创建，并选择 `Vue` 框架及 `TypeScript` 变体;
- （2）如果你使用的是**1024code**在线编写代码，可以直接克隆 [【项目模板】Vue3+Vite3+Ts4](https://1024code.com/codecubes/0z9xIZl)得到一个项目模板；


## 2. 安装LogicFlow核心依赖：

在项目根目录执行 `npm i @logicflow/core` 安装lf的核心模块；如果你使用**1024code**在线编写代码，在右侧的Shell标签页就是你执行安装命令的地方了；

## 3. 初始化目录及容器：

- （1）移除项目中不需要用到的目录（`components/HelloWorld.vue`）以及在`App.vue`中的引用；
- （2）为LF渲染提供渲染的容器（区域），并为容器设置一个固定的宽高属性：
```html
<div ref="container" class="container"></div>
```

```css
.container {
  width: 500px;
  height: 400px;
}
```

## 4. 导入LF核心模块和默认样式文件：

```typescript
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
```

## 5. 声明LF和容器对象并在挂在时初始化：

- 声明container容器对象；
- 声明lf对象；
- 实例化lf对象并在选项中绑定容器对象，为了更明显的看到渲染效果这里专门开启的 `grid` 选项；

```typescript
// 声明容器的对应ref对象和LF对象
const container = ref();
const lf = ref<LogicFlow>();

onMounted(() => {
  lf.value = new LogicFlow({
    // 通过选项指定了渲染的容器和需要显示网格
    container: container.value,
    grid: true,
  })
  lf.value.render();
})
```

## 6. 运行项目

本地搭建的项目就执行 `npm run dev` 启动了，如果你要是使用的是**1024code**在线编写代码，那么在界面顶部的运行按钮点击后将开始启动项目，如果没有任何的报错信息，那么恭喜你项目成功运行好了。


## 总结

这一节的内容就到此结束了，各位小伙伴的项目都运行起来了吗？没有的话要赶紧联系我了，因为后面的案例都将基于第一节的准备工作进行了，加油，各位小伙伴。

<Comment />
