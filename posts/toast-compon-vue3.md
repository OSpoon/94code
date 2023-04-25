---
title: Toast组件开发实践（Vuejs3.x）
date: '2023-04-25 12:30'
sidebar: 'auto'
tags:
 - Component
 - Vuejs3.x
description: Toast组件几乎是没有个组件库必备的组件，通过Toast组件开发可以比较全面的学习Vuejs的相关技能点，一起来看一下~
---

# Toast组件开发实践（Vuejs3.x）

🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202304250904804.png)

## 进入正题

Toast组件几乎是没有个组件库必备的组件，通过Toast组件开发可以比较全面的学习Vuejs的相关技能点，一起来看一下~

## 基础项目准备

> 依旧推荐你来1024Code Fork 我的[《【项目模板】Vue3+Vite3+Ts4》](https://1024code.com/codecubes/0z9xIZl) 开始这次学习，如果你不习惯使用在线的IDE，那么可以将项目导出到本地运行~

## 组件开发

在`components`目录下创建`Toast`文件夹，并新增插件文件（`index.ts`）和组件文件（`index.vue`），下面是`Toast`组件的样式及DOM结构，接下来将为其增加一系列必要的内容。

```html
<template>
    <div class="toast">
      <div class="toast-content">Hello Vuejs</div>
    </div>
</template>

<script lang="ts">
</script>

<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

.toast-content {
  display: inline-block;
  margin-right: 10px;
}
</style>
```

### 为组件增加属性

Toast组件接收一个必须属性是`message`用来显示提示的信息，还可以接收一个非必须的属性`duration`属性，在指定的时间后要自动隐藏掉提示信息，当然要有一个默认值的支持。

使用`defineComponent`来创建组件对象，并通过props提供`message`和`duration`属性，注意类型、必传及默认值的设置。

```typescript
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
})
</script>
```

添加完属性后就可以将模板中的`Hello Vuejs`替换成`message`属性了。

```html
<template>
    <div class="toast">
      <div class="toast-content">{{ message }}</div>
    </div>
</template>
```

### 为组件增加状态

增加一个响应式的`visible`数据，动态的切换组件的显示和隐藏，在`setup`中将`visible`返回后，`visible`将被暴露，在插件中会通过修改`visible`为`true`来显示吐司信息。

```html
<template>
    <div class="toast" v-if="visible">
      <div class="toast-content">{{ message }}</div>
    </div>
</template>
```

```typescript
import { ref } from 'vue'

setup(props) {
  const visible = ref(false)

  return {
    visible
  }
}
```

### 为组件增加监听器

自动隐藏需要用到`watch`，当监听到`visible`状态激活时启动计时器，在`duration`毫秒后将`visible`状态改为未激活状态。

```typescript
watch(visible, (value) => {
  if (value) {
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})
```

### 组件部分完整代码

```html
<template>
    <div class="toast" v-if="visible">
      <div class="toast-content">{{ message }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  setup(props) {
    const visible = ref(false)
    
    watch(visible, (value) => {
      if (value) {
        setTimeout(() => {
          visible.value = false
        }, props.duration)
      }
    })
    
    return {
      visible
    }
  }
})
</script>

<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

.toast-content {
  display: inline-block;
  margin-right: 10px;
}
</style>
```

## 插件开发

在插件文件（`index.ts`）中必须包含一个Vuejs插件规范的`install`函数，另外需要抽取一个`createToast`函数来执行具体的`Toast`组件创建加载及提示流程。

### 实现install函数

在`install`函数中主要的目的就是要在全局挂载一个可以随处执行的`$toast`方法，通过这个方法可以很方便的使用`Toast`组件。

在Vue3中挂载全局变量需要在`globalProperties`上添加，具体可以看[Vuejs文档](https://cn.vuejs.org/api/application.html#app-config-globalproperties)。

```typescript
const createToast = (options: 
    { message: string, duration?: number }
) => {
  
}

export const ToastPlugin = {
  install(app: any) {
    app.config.globalProperties.$toast = {
      show: (message: string, duration?: number) => createToast({message, duration}),
    }
  }
}
```

### 实现createToast函数

实现`createToast`函数首先要导入`vue`模块中的`createApp`和同级目录下的组件模块，再借助`createApp`创建`Toast`组件应用程序实例，通过应用程序实例的`mount`函数将其挂载到一个新的`div`元素上，至此将得到一个成功挂载的组件实例。

```typescript
import { createApp } from 'vue'
import Toast from './index.vue'

const createToast = (options: 
    { message: string, duration?: number }
) => {

  const app = createApp(Toast, {
    message: options.message,
    duration: options.duration,
  })

  const instance = app.mount(document.createElement('div'))
}
```

在得到`Toast`组件实例后，将可以直接访问组件暴露的状态和方法，此时就可以将`Toast`组件的`visible`变更为激活状态。

```typescript
const createToast = (options: 
    { message: string, duration?: number }
) => {

  ...

  const instance = app.mount(document.createElement('div'))
  instance.visible = true;
}
```

最后可以通过组件实例上的`$el`属性获取已挂载组件对应的真实DOM，将其直接插入`body`元素中即完成插件的完整功能。

```typescript
const createToast = (options: 
    { message: string, duration?: number }
) => {

  ...

  document.body.appendChild(instance.$el)
}
```

### 插件部分完整代码

```typescript
import { createApp } from 'vue'
import Toast from './index.vue'

const createToast = (options: 
    { message: string, duration?: number }
) => {
  const app = createApp(Toast, {
    message: options.message,
    duration: options.duration,
  })

  const instance = app.mount(document.createElement('div'))
  instance.visible = true;

  document.body.appendChild(instance.$el)
}

export const ToastPlugin = {
  install(app: any) {
    app.config.globalProperties.$toast = {
      show: (message: string, duration?: number) => createToast({message, duration}),
    }
  }
}
```

## 组件使用

### 安装

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// ① 导入插件模块
import { ToastPlugin } from './components/Toast/index'

createApp(App)
  // ② 使用use加载插件
  .use(ToastPlugin)
  .mount('#app')
```

### 使用

```typescript
<script lang="ts">
export default {
  name: "App",
  methods: {
    toast() {
      this.$toast.show('Hello Vuejs')
    }
  }
}
</script>
```

```typescript
// script setup
<script setup lang="ts">
import { getCurrentInstance } from 'vue';
const global = getCurrentInstance()?.appContext.config.globalProperties;

const toast = () => {
  global?.$toast.show('Hello Vuejs')
}
</script>
```

```typescript
// defineComponent + setup
<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
export default defineComponent({
  name: "App",
  setup() {

   const global = getCurrentInstance()?.appContext.config.globalProperties;

    const toast = () => {
      global?.$toast.show('Hello Vuejs')
    }

    return {
      toast,
    }
  }
})
</script>
```

## 补充优化

这里做一点点小优化，就是为Toast组件增加一下状态切换时的动画效果，可以使用Vuejs内置的`Transition`，它可以将进入和离开动画应用到通过默认插槽传递给它的元素或组件上，通过`v-if`状态的变化即可激活绑定的动画效果。

```html
<template>
  <transition name="toast">
    <div class="toast" v-if="visible">
      <div class="toast-content">{{ message }}</div>
    </div>
  </transition>
</template>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
```

<PreviewCode url="https://1024code.com/embed-ide/@小鑫同学/dpmcubc" />

## 总结

到此`Toast`组件的整个开发流程就结束了，在整个开发流程中涉及的Vuejs的属性、状态、监听器的使用，还有插件开发时的规则及全局变量的挂载，并且在组件使用时针对使用了`setup`后无法读取`this`而正确读取全局变量的，最后还提到了一点`Vuejs`基础中动画组件的使用。希望能给你带来帮助。更多的实现方式不妨你来尝试一下[1024Code](https://1024code.com/)提供AI编程助手，响应速度非常棒~


<Comment />
