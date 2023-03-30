---
date: 2023-03-29
title: 在 Vue3 中实现飘逸的元素拖拽
tags:
- Vue3
- mouse
- translate
description: 元素拖拽是一个比较典型的前端学习案例，需要对 JavaScript 的事件有一定的了解，我也是在最近的工作中才重新拾起了这块内容，通过在 Vue3 这种声明式编程风格的框架中把元素拖拽一次讲清楚。
---

# 在 Vue3 中实现飘逸的元素拖拽

>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得

## 进入正题

元素拖拽是一个比较典型的前端学习案例，需要对 JavaScript 的事件有一定的了解，我也是在最近的工作中才重新拾起了这块内容，通过在 Vue3 这种声明式编程风格的框架中把元素拖拽一次讲清楚。

## 准备实验环境

依旧推荐你来1024Code Fork 我的[《【项目模板】Vue3+Vite3+Ts4》](https://1024code.com/codecubes/0z9xIZl) 开始这次学习。

PS：Vue3 模板全局样式中的居中属性可能会造成实验干扰，请注意！！！

## 元素的位置和移动

在实现元素拖拽我们使用 `mouse` 事件，在 `mouse` 事件的回调函数中可以得到当前事件发生时元素的位置，对应的属性是 `MouseEvent` 中的 `clientX` 和 `clientY`，我们后续将通过读取这两个属性来实时更新元素的位置。

元素的移动推荐优先使用 `transform` 中的 `translate` 实现，相比于修改元素的 `top`、`left` 属性来说不会造成元素布局的改变，避免了回流和重绘造成的性能影响。

PS：在 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform) 有一份关于translate的使用和体验，可以感受一下。

## 定义三组坐标

分别定义用来记录元素初始位置的一组坐标（`originalPosition`）、元素被按下时指针在元素上的坐标（`mousedownOffset`）和元素在移动时实时更新的一组坐标（`elementPosition`）。

记录元素初始位置的坐标，原点位于页面左上角，用来在初始化和被拖拽结束后还原被拖拽元素的位置，固定值不发生变化：
```typescript
const originalPosition = reactive({
  x: 10,
  y: 10,
})
```

元素被按下时指针在元素上的坐标，原点位于被拖拽元素的左上角，通过按下时指针的坐标 - 元素初始的偏移位置得到：
```typescript
const mousedownOffset = reactive({
  x: 0,
  y: 0,
})
```

元素在移动时实时更新的坐标，原点位于页面左上角，初始值应该同 `originalPosition` ，在 `mousemove` 事件发生时，通过指针的实时坐标 - `mousedownOffset` 得到：
```typescript
const elementPosition = reactive({
  x: 0,
  y: 0,
})
```

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202303291452630.png)

PS：当原点是页面左上角时在图中的1号点表示 `originalPosition` 或 `elementPosition`，2号点表示指针按下时的坐标，当原点是1号点时在图中的2号点表示 `mousedownOffset`；

## 注册 mousedown 事件

在实现元素拖拽时，仅需要给被拖拽的元素添加 `mousedown` 事件即可，监听事件使用完后记得要清楚掉，成对出现的习惯一定要养成。

如果你把 `mousemove` 和 `mouseup` 都添加到被拖拽的元素上，你会发现有脱离控制的现象发生。

在页面加载完成后首先要重置一下被拖拽元素的默认位置，并增加 `mousedown` 事件，在组件卸载后删除 `mousedown` 事件：
```typescript
const restore = () => {
  elementPosition.x = originalPosition.x;
  elementPosition.y = originalPosition.y;
}

onMounted(() => {
  restore();
  floatButton.value.addEventListener('mousedown', onMousedown, true);
})

onUnmounted(() => {
  floatButton.value.removeEventListener('mousedown', onMousedown, true);
})
```

## 实现拖拽的核心

选择 `Vuejs` 的原因就是因为其是 `MVVM` 型框架，我们关注点在声明上，内部的运转机制有框架负责，所以在下面的事件处理上就只需要在对应的事件中去更新一开始声明的三组坐标就可以了。


在 `onMousedown` 时，通过指针所在的坐标 - 被拖拽元素初始位置的坐标得到指针此时在被拖拽元素上的坐标，`onMousedown` 时要为 `document` 添加 `mousemove` 和 `mouseup` 事件：
```typescript
const onMousedown = (event: MouseEvent) => {
  event.stopPropagation();
  
  mousedownOffset.x = event.clientX - originalPosition.x;
  mousedownOffset.y = event.clientY - originalPosition.y;
  
  document.addEventListener('mousemove', onMousemove, true);
  document.addEventListener('mouseup', onMouseup, true);
}
```

在 `onMousemove`时，通过指针所在的坐标 - 指针在被拖拽元素上的位置得到被拖拽元素左上角距离页面左上角的距离，并更新到 `elementPosition`：
```typescript
const onMousemove = (event: MouseEvent) => {
  event.stopPropagation();
  
  elementPosition.x = event.clientX - mousedownOffset.x;
  elementPosition.y = event.clientY - mousedownOffset.y;
}
```

在 `onMouseup`时，主要做的就是为 `document` 移除在 `onMousemove` 时注册的两个事件，要注意的是移除的事件要是同一个事件，也就是引用一致的事件，推荐将对应的处理事件赋值给一个变量使用，最后可以在拖拽结束后还原被拖拽元素的位置：
```typescript
const onMouseup = (event: MouseEvent) => {
  event.stopPropagation();
  document.removeEventListener('mousemove', onMousemove, true);
  document.removeEventListener('mouseup', onMouseup, true);
  restore();
}
```

## 补充其它部分代码和演示

```html
<div 
 ref="floatButton"
 class="float-button"
 :style="{
    'transition-duration': '0.1s',
    transform: `translate(${elementPosition.x}px, ${elementPosition.y}px)`
  }">
</div>
```

```css
.float-button {
  position: absolute;
  width: 42px;
  height: 42px;
  background: red;
  border-radius: 5px;
  user-select: none;
  background-image: url(../assets/taobao.svg);
  background-size: cover;
}
```

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202303291536694.gif)

<PreviewCode url="https://1024code.com/embed-ide/@小鑫同学/QPS7eMR" />

## 总结

使用 mousemove、translate 在 Vue3 中实现可以随意拖拽的 Icon 的案例就完成了，在本次案例中需要认真思考对应的几个坐标和移动时坐标如何更新，事件的使用要成对出现，如何在这个拖拽的 Icon 上增加点击事件时还需要多做一些处理，有答案的朋友可以留下你的想法~

<Comment />
