---
date: 2023-02-09
title: 构建工具tsup入门第四部分
tags:
- tsup
- Build
description: tsup 是一个基于 ESBuild 实现在零配置的情况下快速捆绑 Typescript 模块的项目，在构建 CLI类 项目时可以优先考虑采用。
---

# 构建工具tsup入门第四部分

> tsup 是一个基于 ESBuild 实现在零配置的情况下快速捆绑 Typescript 模块的项目，在构建 CLI类 项目时可以优先考虑采用。

![完整大纲](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202301181619597.png)

在这一节中你将了解tsup的最后一块内容，对于类型的声明、自定义Loader、还有编译回调的应用场景。

## 1. 类型声明文件

类型声明文件在已 Typescript 为主的项目中也是比不可少的一部分内容，那么看看使用 tsup 怎么样生成吧；

在终端启用生成类型声明文件的方式：
```bash
cd code01 && npx tsup index.ts --dts
```

如果有多个入口文件的存在，那么就会生成多分类型声明文件，如果仅需要为指定的入口生成那么可以按下面的方式配置：
```bash
cd code01 && npx tsup index.ts --dts index.ts
```

如果你的源码已经编译完成而现在只是要生成一份类型声明文件，可以按下面的方式配置：
```
cd code01 && npx tsup index.ts --dts-only
```

PS：代码参照[1024Code](https://1024code.com/codecubes/qdVek07)中的code01部分；

## 2. 自定义loader

tsup 中的自定义 loader 指的是借助 ESBuild 内置的各种 Loader 解析器来处理默认不支持的文件；

ESBuild 支持的 Loader 如下：

| 序号 | Loader | 序号 | Loader |
| ---- | ---- | ---- | ---- |
| 1 | js | 8 | text |
| 2 | jsx | 9 | base64 |
| 3 | ts | 10 | file |
| 4 | tsx | 11 | dataurl |
| 5 | css | 12 | binary |
| 6 | json | 13 | copy |
| 7 | default | 14 |  |

在终端配置 `Loader` 的方式，意味着已 `.png` 为后缀的文件将按 `base64` 处理：

```bash
cd code02 && npx tsup index.ts --loader ".png=base64"
```

在配置文件中可以按以下参考下面的形式：
```bash
import { defineConfig } from 'tsup'

export default defineConfig({
  loader: {
    '.png': 'base64',
    '.webp': 'file',
    // ...
  },
})
```

PS：代码参照[1024Code](https://1024code.com/codecubes/qdVek07)中的code02部分；

## 3. 编译成功回调

到现在为止我们的编译和执行都是需要两步来操作的，仅仅通过 `&&` 连接两条不同的命令也不是那么优雅，所以 tsup 提供的编译成功的回调将解决编译到运行的连接问题，在上一篇讲解的监听模式中将很有用处。 

在运行下面的这行命令后，没此源文件的修改都将在编译后被重新执行：

```bash
cd code03 && npx tsup index.ts --watch --onSuccess "node dist/index.js"
```

PS：代码参照[1024Code](https://1024code.com/codecubes/qdVek07)中的code03部分；

除了在终端指定 `--onSuccess` 标志，同时也支持在配置文件中通过 `onSuccess` 函数的形式实现，一个比较实用的功能就是在编译完成后启动一个静态服务来预览效果，下面就是完整的配置：

```typescript
import { defineConfig } from 'tsup';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';
import mime from 'mime';
import pc from "picocolors"

export default defineConfig({
  entry: ["index.ts"],
  watch: true,
  publicDir: 'public',
  async onSuccess() {
    const server = http.createServer((req, res) => {
      console.log(
        pc.green(`${req.method} ${req.url}`)
      )
      let filepath = path.join(__dirname, 'dist', url.parse(req.url).pathname);
      // 目标路径不存在的情况，如：/favicon.ico
      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.setHeader('Content-type', 'text/plain;charset=utf-8');
        res.end('404 not found');
      }
      const stat = fs.statSync(filepath);
      // 目标路径指向文件夹的情况应指向 index.html
      if (stat.isDirectory()) {
        const index = path.join(filepath, 'index.html');
        res.setHeader('Content-type', 'text/html;charset=utf-8');
        fs.createReadStream(index).pipe(res);
      } else {
        // 目标路径指向具体文件可使用 mime 模块获取响应类型片段
        const mimeType = mime.getType(filepath);
        res.setHeader('Content-type', `${mimeType};charset=utf-8`);
        fs.createReadStream(filepath).pipe(res);
      }
    })
    server.listen(8080, () => {
      console.log(
        pc.green(`Service started successfully`)
      )
    });
    return () => {
      server.close();
    }
  },
})
```

```bash
cd code04 && npm run dev
```

PS：代码参照[1024Code](https://1024code.com/codecubes/qdVek07)中的code04部分；

## 总结

关于 tsup 的内容就暂时告一段落了，在文中的部分源码并为贴出，因为这些并非关键代码，每个小节给出的在线源码均可以配合文中的配置进行运行查看，更多的 tsup 内容期待在实战中发掘吧，下一个主题见~

<Comment />
