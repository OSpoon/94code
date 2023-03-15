---
date: 2023-02-06
title: 构建工具tsup入门第二部分
tags:
- tsup
description: tsup 是一个基于 ESBuild 实现在零配置的情况下快速捆绑 Typescript 模块的项目，支持 Node.js 应用中的任何内容，如：.js、.json、.mjs，及 Typescript 中的 .ts、.tsx，还包括实验性的CSS。但在由于部分功能 esbuild 存在天然的不足，但又是开发者密切关注的功能，tsup 同时也选择融合其他的构建工具共同参与，这些内容会在后续的小节说明。
---

# 构建工具tsup入门第二部分

> tsup 是一个基于 ESBuild 实现在零配置的情况下快速捆绑 Typescript 模块的项目，在构建 CLI类 项目时可以优先考虑采用。

![完整大纲](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18ab5c6814a3455eb541e6a4fd794679~tplv-k3u1fbpfcp-zoom-1.image)

在这一节中你将了解到 tsup 如何压缩代码、如何代码拆分、如何做 tree shaking、捆绑的格式有哪些以及配置目标环境，内容较多，请各位小伙伴准备好，马上要开始了~ 

## 1. 开启压缩代码 & 代码拆分：

代码压缩可以有效的移除对于程序运行时并不关心空白符号来减少编译结果的体积，其中开启的方式也很简单，查看下面1.1部分的两种方式即可；

代码拆分主要考虑将共享模块单独打包，这样仅在第一次访问有引用共享模块的页面时下载；在异步 `import()` 时才对模块进行下载，减少初次启动带来的大量请求阻塞造成的性能问题。

### 1.1 开启压缩代码

终端执行时开启：
```typescript
cd code02 && npx tsup index.tsx --minify
```

配置文件中开启：
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ["index.tsx"],
  minify: true,
})
```

PS：代码参照[1024Code](https://1024code.com/codecubes/Ha1LfyC)中的code01部分；

### 1.2 代码拆分与不拆分

代码拆分需要注意 `esm` 模块默认开启，`cjs` 模块需要手动开启，如果需要关闭代码拆分需要手动指定 `--no-splitting` 参数；

准备两个模块，将一个模块通过异步导入到入口模块：

```typescript
// index.js
const content = import('./content.js');

console.log("content: ", content);
```

```typescript
export const say = 'PS：请查看README.md后学习各小节内容';
```

添加合适的配置文件：
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ["index.js"],
  format: "esm",
})
```

运行编译后，dist 目录将分别输出两个模块编译后的结果：
```bash
cd code02 && npx tsup
```

通过配置文件禁止代码分割，再次运行编译将两个模块的结果合并：
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ["index.js"],
  format: "esm",
  splitting: false,
})
```

PS：代码参照[1024Code](https://1024code.com/codecubes/Ha1LfyC)中的code02部分；

## 2. 利用 Rollup 做 tree shaking：

由于 ESBuild 的 `tree shaking` 功能不那么完美，会在结果中留存部分并没有副作用的内容，就比如说下面这个例子：

```typescript
const cwd = process.cwd();

export {}
```

对于这段代码来说变量 `cwd` 并没有任何地方的使用，仅仅是声明了这样一个变量，但是 esbuild 在处理后并没能将变量 `cwd` 移除，所以 `tsup` 就没有使用 ESBuild 的 `tree shaking` 而是选用了 Rollup；

那么想要在 tsup 正确开启 `tree shaking` 就是下面的两种方式：

终端执行时开启：
```typescript
cd code03 && npx tsup index.js --treeshake
```

配置文件中开启：
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  treeshake: true,
})
```

```bash
cd code03 && npx tsup
```

运行后的结果将不再包含声明的 `cwd` 变量了。

PS：代码参照[1024Code](https://1024code.com/codecubes/Ha1LfyC)中的code03部分；

## 3. 捆绑模块的格式：

前端模块化主流的 `esm`、`cjs`、`iife` 都是 `tsup` 支持的将模块进行捆绑的格式，在 tsup 中默认使用 `iife` 格式。

在一次编译时输出多种模块格式的结果：
```bash
cd code04 && npx tsup index.js --format esm,cjs,iife
```

输出结果的文件名和格式存在如下对应关系：
```
dist
├── index.mjs         # esm
├── index.global.js   # iife
└── index.js          # cjs
```

当项目根目录下的 `package.json` 文件中 `type` 被标记为 `module` 时将发生下面的变化：
```
dist
├── index.js          # esm
├── index.global.js   # iife
└── index.cjs         # cjs
```

如果你不想使用不同的后缀来区分模块的格式可以开启 `--legacy-output` 参数来禁止这个行为，不同模块格式将输出到不同的目录中；

PS：代码参照[1024Code](https://1024code.com/codecubes/Ha1LfyC)中的code04部分；

## 4. 目标环境配置 & 支持es5：

在 tsup 运行前可以使用 `tsup.config.ts` 中的 `target` 选项或 `--target` 标志来为生成的 JavaScript 和/或 CSS 代码设置目标环境。每个目标环境是一个环境名称，后面跟着一个版本号组成；同样支持指定JavaScript语言版本。

`target` 的值默认为项目中 `tsconfig.json` 内的 `compilerOptions.target` 选项，如果没有指定，则为 `node14`。

由于 ESBuild 天生不支持到 es5 的语法降级，所以在此 tsup 在此又选用了另一款编译框架来支持，那就是 `SWC`，一款由 `Rust` 编写的编译框架。在由 `esbuild` 将代码编译为 `es2020` 后由 `SWC` 接管语法降级部分再次编译降级为 `es5` 语法；

## 在线体验

<iframe style="margin: 10px auto;width: 80%; background-color: #151617; border-radius: 8px; height: 480px;" src="https://1024code.com/embed-ide/@小鑫同学/Ha1LfyC"></iframe>

## 总结

这一节的内容就到此结束了，代码压缩、模块拆分、树摇、捆绑格式及目标环境要在实际的情况下考虑是否要开启和关闭，在这一节还提到了 tsup 在遇到 esbuild 无能为力时的处理方式，那么你在开发中遇到这类问题是怎么解决的呢？

<Comment />
