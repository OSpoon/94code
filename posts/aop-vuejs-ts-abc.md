---
title: 让 Vueer 融入切面编程的队伍
date: '2023-04-21 08:45'
sidebar: 'auto'
categories:
 - AOP
 - Vuejs
tags:
 - Decorator
 - vue-facing-decorator
---

:::tip
切面编程是一种编程范式，它允许你在程序执行的不同阶段注入代码，以实现各种功能，例如日志记录、性能监控、安全性检查等。Typescript 提供的实验性功能 Decorator 就是切面编程的实践，在 Vuejs 开发时可以同时搭配 Typescript 来实现。这里使用 Vuejs 官方推荐的社区项目 [vue-facing-decorator](https://github.com/facing-dev/vue-facing-decorator) 开箱体验。
:::

<!-- more -->

## 1. 前言
------

🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得

切面编程是一种编程范式，它允许你在程序执行的不同阶段注入代码，以实现各种功能，例如日志记录、性能监控、安全性检查等。Typescript 提供的实验性功能 Decorator 就是切面编程的实践，在 Vuejs 开发时可以同时搭配 Typescript 来实现。这里使用 Vuejs 官方推荐的社区项目 [vue-facing-decorator](https://github.com/facing-dev/vue-facing-decorator) 开箱体验。
## 基础项目准备

> 依旧推荐你来1024Code Fork 我的[《【项目模板】Vue3+Vite3+Ts4》](https://1024code.com/codecubes/0z9xIZl) 开始这次学习，如果你不习惯使用在线的IDE，那么可以将项目导出到本地运行~

1. 安装 vue-facing-decorator：
   ```shell
   npm install --save vue-facing-decorator
   ```
3. 启用 decorator：
   ```json
   {
     "compilerOptions": {
        "experimentalDecorators": true
     }
   }
   ```

## 改造 HelloWorld 组件

类组件即一个继承自 Vue 父类并且使用 @Component 装饰器来标记一个类。组件因有的 name、emits、components 等选项需配置到 @Component({ /* options */ }) 中。

首先来尝试将项目内置的 HelloWorld 组件改造成 AOP 形式，主要包括了一个响应式的 count 的和一个组件属性 msg，在 template 中对于这两个属性的调用不需要任何的改动。

1. 特别说明：禁止使用`<script setup>`，所以第一步就是去掉`script`中的`setup`；
2. 定义一个空组件：
   ```typescript
   import { Component, Vue } from "vue-facing-decorator";
   @Component
   export default class HelloWorld extends Vue {}
   ```
3. 定义响应式的数据`count`：
   ```typescript
   const count = ref(0)
   
        ↓↓↓↓↓↓

   import { Component, Vue } from "vue-facing-decorator";
   @Component
   export default class HelloWorld extends Vue {
     count = 0;
   }
   ```
4. 定义组件的属性`msg`：
   ```typescript
   defineProps<{ msg: string }>()

        ↓↓↓↓↓↓

   import { Component, Vue, Prop } from "vue-facing-decorator";
   @Component
   export default class HelloWorld extends Vue {
     @Prop({
       default: ''
     })
     msg!: string
   }
   ```

至此 HelloWorld 组件由可以正常的使用的，在 class 中定义的属性将是一个响应式的数据，定义一个 Prop 则需要用到 @Prop 装饰器来实现。

## APO + 命令式 Dialog 组件

命令式的 Dialog 组件指的是组件的状态由组件本身提供，父组件通过 Dialog 组件的实例来操作 Dialog 组件对外提供的函数的方式。

需要安装`ant-design-vue`组件库并做如下配置：
```ts
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

createApp(App).use(Antd).mount('#app');
```

### 1. 定义一个 BusinessDialog 类组件：

```typescript
import { Vue, Component } from 'vue-facing-decorator';

@Component
export default class BusinessDialog extends Vue{}
```

### 2. 定义一个 visible 和 开启、关闭的函数：

```typescript
import { Vue, Component } from 'vue-facing-decorator';

@Component
export default class BusinessDialog extends Vue{
  visible = false;

  open() {
    this.visible = true
  }
  
  close() {
   this.visible = false 
  }
}
```

### 3. 配置组件支持将`open`暴露给父组件：

```typescript
import { Vue, Component } from 'vue-facing-decorator';

@Component({
  expose: ['open']
})
export default class BusinessDialog extends Vue{
  visible = false;

  open() {
    this.visible = true
  }
  
  close() {
   this.visible = false 
  }
}
```

### 4. 定义一个 emit，在关闭 Dialog 后通知到父组件：

```typescript
import { Vue, Component, Emit } from 'vue-facing-decorator';

@Component({
  expose: ['open']
})
export default class BusinessDialog extends Vue{
  visible = false;

  open() {
    this.visible = true
  }
  
  close() {
   this.visible = false 
  }

  @Emit("complete")
  handleOk() {
    this.close();
    return 200;
  };
}
```

PS：在 App 组件中你依然可以使用非类组件，在 App 组件中提供了使用 Dialog 组件的示例。

<PreviewCode url="https://1024code.com/embed-ide/@小鑫同学/x5q1fkl" />

## 总结

一个融入切面编程的 Vuejs 项目就完成了上手操作，更多的装饰器的使用可以通过[vue-facing-decorator](https://facing-dev.github.io/vue-facing-decorator/#/zh-cn/quick-start/quick-start)文档详细了解，接下来会通过自定义装饰器来在这个项目中实现一些常用的功能。

<Comment />
