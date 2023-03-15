---
date: 2023-01-16
title: 复刻画龙产品之新春气泡兔
tags:
- PIXI
- canvas
- 春节
description: 复刻掘金一篇画龙的文章，在兔年春节来临之际献上一幅新春气泡兔，创意虽旧但技术永存，本节案例代码已上传[1024Code - 让编程重回乐趣](https://1024code.com/codecubes/txFfSnp)，在线协作编写代码更轻松。
---

# 复刻画龙产品之新春气泡兔

> 复刻掘金一篇画龙的文章，在兔年春节来临之际献上一幅新春气泡兔，创意虽旧但技术永存，本节案例代码已上传[1024Code - 让编程重回乐趣](https://1024code.com/codecubes/txFfSnp)，在线协作编写代码更轻松。

剪影图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e0c75b6628043679d5e29bc803c0d4e~tplv-k3u1fbpfcp-zoom-1.image)

## 1. 初始化容器

通过 `PIXI` 中的 `Application` 对象初始化一个宽`600`、高`1000`、白色背景的容器，并通过`appendChild`添加到当前组件的模板中：
```typescript
const initContainer = () => {
  const app = new PIXI.Application({ 
    width: 600, 
    height: 1000, 
    background: 'fff' 
  });
  container.value.appendChild(app.view);
  return app;
} 
```

## 2. 实现添加Sprite函数：

`Sprite`是`PIXI`中一个重要的概念，最后的气泡兔就是由一个个的`Sprite`拼出来的，最后再把每一个`Sprite`添加到`stage`中：

```typescript
const setSprite = (app: any, x: any, y: any, size: any, scale: any) => {
  let sprite = PIXI.Sprite.from('circle.png');
  sprite.width = size;
  sprite.height = size;
  sprite.x = x * scale - size;
  sprite.y = y * scale - size;
  app.stage.addChild(sprite);
}
```

## 3. 核心三步绘制气泡兔

### 3.1 加载剪影图片，获取像素数据

剪影图片是一张由黑色主体和透明背景或纯色背景构成的一张图片，我们要加载这张剪影图片并获取到每个像素的数据。

下面是通过`canvas`来加载图片的过程，并通过`getImageData()`函数获取到了一个包含以 `RGBA` 为顺序的一维数组数据：
```typescript
const transform = (app: any) => {
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const image = new Image();
  image.src = "rabbit.jpeg";
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Uint8ClampedArray 类型
    const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
    consoel.log(imageData) // 长度 = 高度 × 宽度 × 4 bytes
  }
}
```

### 3.2 搞清楚每个像素的颜色

需要通过双层循环来逐行对剪影图片中的每一个像素进行检查，在遍历时可以指定一个固定的`step`来控制遍历点的密度，在获取每一个`position`的时候要保持是一组`RGBA`4位的长度的倍数，这样在拿到每个点以后，通过下标来分别获取到`R\G\B\A`四个值：

```typescript
const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
const step = 20; // 控制每个点的密度

for (let y = 0; y < image.height; y += step) {
  for (let x = 0; x < image.width; x += step) {
    const position = (image.width * y + x) * 4;

    // 4个字节表示一组RGBA数据
    const r = imageData[position];
    const g = imageData[position + 1];
    const b = imageData[position + 2];
    const a = imageData[position + 3];

    if (r + g + b === 0 && a !== 0) { // 纯黑
      // TODO 绘制气泡
    }
  }
}
```

### 3.3 着手绘制气泡兔

在获取到每一组的`RGBA`数据后，如果`R、G、B`均为 `0` 且透明度非 `0`，那么代表这个位置需要绘制气泡了，绘制的气泡大小随机产生：

```typescript

const scale = 0.8; // 控制绘制的整体缩放比

if (r + g + b === 0 && a !== 0) { // 纯黑
  const size = (Math.random() * 10 + 20) / 3;
  let sx = x * scale - size;
  let sy = y * scale - size;
  setSprite(app, sx, sy, size, scale);
}
```


气泡兔：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90d87ce74e004513baaeec618aa7b8b0~tplv-k3u1fbpfcp-zoom-1.image)

## 总结

本小节就到此结束了，文中提到的加载图片、获取像素点、遍历每个像素获取`RGBA`数据都搞清楚了吗？破解登录时遇到的滑动验证码是不是也可以用到这里面的知识点呢？大家可以发散一下思维。再次祝各位同学，兔年大吉、新春快乐~

<Comment />
