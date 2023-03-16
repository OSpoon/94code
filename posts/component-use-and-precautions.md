---
date: 2023-03-16
title: Vuejs中动态组件的使用及注意
tags:
- Vuejs
- Nuxt3
- 动态组件
- component
description: 在 `Nuxt3` 中实现根据路由配置动态显示导航栏菜单 `ICON`，动态组件在 `Vuejs` 中和 `Nuxt3` 中使用的差异及注意事项。
---

# Vuejs中动态组件的使用及注意

> 在 `Nuxt3` 中实现根据路由配置动态显示导航栏菜单 `ICON`，动态组件在 `Vuejs` 中和 `Nuxt3` 中使用的差异及注意事项。

## 认识 component

`<component>` 一个用于渲染动态组件或元素的“元组件”，可以通过 `is` 属性动态切换来改变要渲染的具体组件，通过文档得到 `is` 支持传递 `HTML` 标签名、组件的注册名或者直接绑定组件的定义。 

在使用组件的注册名动态切换组件时需要额外注意的就是要先注册，尤其是使用到 `<script setup>` 的时候，仅仅导入组件是没办法使用组件的注册名让动态组件正常渲染的，所以你必须要全局注册。

下面是在根组件挂载了A、B两个自定义组件：

```typescript
// main.js
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import CompA from './components/CompA.vue';
import CompB from './components/CompB.vue';

createApp(App)
  .component('comp-a', CompA)
  .component('comp-b', CompB)
  .mount('#app');
```

在 `<script setup>` 中通过组件的注册名动态切换来渲染不同的组件：
```typescript
// App.vue
<script setup>
import { ref } from 'vue';

const currentComponent = ref('comp-a');
const change = () => {
  currentComponent.value =
    currentComponent.value === 'comp-a' ? 'comp-b' : 'comp-a';
};
</script>

<template>
  <button @click="change">change component</button>
  <component :is="currentComponent" />
</template>

<style scoped></style>
```

## 选择组件注册名的便利

动态组件支持使用组件的定义，使用组件的注册名有什么便利？我考虑使用组件的注册名是为了配和模板中循环使用，通过在路由对象上配置的 `mate` 属性来动态渲染不同菜单的 `icon` 组件，下面是一段 `Nuxt3` + `@element-plus/nuxt` 的代码。

```html
<el-menu
    class="layout-navigation"
    default-active="/"
    :collapse="isCollapse"
    >
    <el-menu-item 
        v-for="route in routes" 
        :index="route.path" 
        @click="toPage(route.path)">
        <el-icon color="#409EFC" class="no-inherit">
            <component :is="route?.mate?.icon" />
        </el-icon>
        <span>{{route?.mate?.name}}</span>
    </el-menu-item>
</el-menu>
```

在 `Nuxt3` 中你不需要主动为组件注册就可以直接使用组件，但是上面的代码是无法生效的，你有没有疑问说，明明框架都注册的，也能使用，为什么到放到`<component>` 中就失效了？我还要在 `main.js` 注册一下吗？这时候你连 `main.js` 也是找不到，因为`Nuxt3`框架已经帮你接管了。

PS：组件已经注册了，这是一个不争的事实，我们要考虑让动态组件正常渲染。

## 在`Nuxt3`中正确使用动态组件

在[Nuxt3的文档](https://nuxt.com/docs/guide/directory-structure/components#dynamic-components)中提到了两种正确使用动态组件的方式。

方式1：全局组件注册，我们需要在`nuxt.config.ts`开启配置来让全局注册所有的组件，但并不推荐你这么做；

```typescript
export default defineNuxtConfig({
    components: {
+     global: true,
+     dirs: ['~/components']
    },
})
```

方式2：使用 `Vuejs` 提供的 `resolveComponent()` 函数按名称手动解析已注册的组件；

```vue
<template>
  <component :is="clickable ? MyButton : 'div'" />
</template>

<script setup>
const MyButton = resolveComponent('MyButton')
</script>
```

## 案例改造

第一步：整理一个由组件注册名为`key`，组件实例为`value`的对象列表；

```html
<script setup lang="ts">
import { resolveComponent } from 'vue';

const components = {
  'el-icon-share': resolveComponent('el-icon-share'),
  'el-icon-histogram': resolveComponent('el-icon-histogram'),
}
</script>
```

第二步：改造模板循环，在对象列表中查找与mate配置的icon一致的组件实例；

```html
<el-menu
    class="layout-navigation"
    default-active="/"
    :collapse="isCollapse"
>
    <el-menu-item 
        v-for="route in routes" 
        :index="route.path" 
        @click="toPage(route.path)">
        <el-icon color="#409EFC" class="no-inherit">
            <component :is="components[route?.mate?.icon]" />
        </el-icon>
        <span>{{route?.mate?.name}}</span>
    </el-menu-item>
</el-menu>
```

经过上面的调整，这个导航栏的菜单ICON就可以正常显示了；

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202303161109149.png)


## 总结

1. 在 `Nuxt3` 中使用动态组件需要注意使用 `resolveComponent()` 手动解析；
2. 在 `Vuejs` 中使用动态组件要注意先注册后使用的原则；
3. `resolveComponent()` 一定要在渲染函数内调用；
4. 如果可以直接引入组件就不需使用 `resolveComponent()`；


<Comment />
