---
date: 2023-01-29
title: LogicFlow插件用前准备
tags:
- LogicFlow
- 流程图
description: LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。
---

# LogicFlow插件用前准备

>LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow支持前端研发自定义开发各种逻辑编排场景，如流程图、ER图、BPMN流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。

这一节将讲解快速上手 LogicFlow 流程图编辑框架的插件用前准备工作，项目整体基于[Vue3+Vite3+Ts4](https://1024code.com/codecubes/0z9xIZl)开发，为帮助还为熟练使用 Vue3 和 Typescript 语法的小伙伴提供便利，如果你已经很熟练在Vue3中的开发习惯，建议直接访问 [LogicFlow](http://logic-flow.org/) 将获取完整的入门指南。

## 1. 安装插件扩展模块：

当你真的需要用到插件的功能时可以安装下面这个模块，每个模块各司其职：
```shell
npm i @logicflow/extension
```

## 2. 注册插件到全局或实例
插件的注册分为两种，分别是**注册到全局**和**注册到实例**，这个就需要按你业务的实际需要来设置了：

- 注册到全局：将如下的代码安装到 `Vue` 的 `main.ts` 入口文件中即可
```typescript
import { BpmnElement } from '@logicflow/extension';
LogicFlow.use(BpmnElement);
```

- 注册到实例：将扩展包在LF对象实例化后，将需要用到的插件通过 `plugins` 注册
```typescript
import LogicFlow from "@logicflow/core";
import { DndPanel, SelectionSelect, Group } from "@logicflow/extension";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

const lf = new LogicFlow({
  container: document.querySelector("#app"),
  grid: true,
  plugins: [DndPanel, SelectionSelect, Group]
});
```

## 总结

这一节的内容就到此结束了，本小节内容简单，主要是为了提供一份可以为后续内置插件和自定义插件的使用提供一份可以**fork**的代码仓库，本节源码将使用注册到实例的方式操作，搞定后就马上要开始插件部分的学习了~

<Comment />
