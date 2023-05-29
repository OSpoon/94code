---
title: NestJs 中间件拦截机制
date: '2023-05-29 12:12'
sidebar: 'auto'
tags:
 - NestJs
 - Middleware
description:  在 Nest 中，中间件是一个可重用的函数，它可以在请求和响应之间进行处理。你可以使用中间件来处理请求和响应之间的逻辑，例如身份验证、日志记录、错误处理等。
---

# NestJs 中间件拦截机制

🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得

## 进入正题

在 Nest 中，中间件是一个可重用的函数，它可以在请求和响应之间进行处理。你可以使用中间件来处理请求和响应之间的逻辑，例如身份验证、日志记录、错误处理等。

## 基础项目准备

> 推荐你来1024Code Fork 我的[《Nest Middleware》](https://1024code.com/codecubes/kwgsrbk) 开始这次学习，如果你不习惯使用在线的IDE，那么可以将项目导出到本地运行~

## 认识 Middleware

中间件是在路由处理程序之前调用的函数。中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的`next()` 中间件函数。 `next()` 中间件函数通常由名为 `next` 的变量表示。

利用中间件可以用来实现通用（非业务）的功能，如：日志记录、授权处理等，下面通过案例一下学习 NestJs 中间件的使用。

在案例中准备了 `Users` 和 `Articles` 两个 `Controller`，并且安装配置了 `Swagger` 模块来辅助验证。通过配置编写的日志中间件和授权中间件来学习 Nest 中配置和使用中间件的方式。

## 创建 Middleware

依旧使用 Nest CLI 创建：

```bash
# 创建未分组中间件
nest g mi <middleware-name>

# 创建分组中间件
nest g mi <path>/<middleware-name>
```

## Middleware 模型

Middleware 应该是一个由 `@Injectable()` 装饰的 `Class`，并且必须实现 `NestMiddleware` 接口，在use函数中可以拦截请求和响应对象，并通过next()决定程序是继续进行还是被挂起。

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305290945174.png)

## 注册 Middleware

在实现 `NestModule` 接口的模块中通过注入 `MiddlewareConsumer` 模块得到注册中间件的能力。`MiddlewareConsumer` 提供了链式调用的方式，使用 `apply()` 函数注册指定的中间件模块，通过 `forRouters()` 函数控制中间件生效的路由、控制器、或HTTP动词，额外还可以通过使用 `exclude()` 来排除指定的请求。

![消费者](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291001805.png)

### 注册单个中间件

使用 `MiddlewareConsumer` 提供的 `apply()` 函数注册指定的中间件模块。

下图中使用 `apply()` 将 `LoggerMiddleware` 中间件注册，并在 `users` 路由下生效。

![注册单个中间件](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291009330.png)

### 注册多个中间件

使用 `MiddlewareConsumer` 提供的 `apply()` 函数注册多个指定的中间件模块。

下图使用 `apply()` 将 `LoggerMiddleware` 和 `AuthMiddleware` 中间件注册，并在 `users` 路由下生效。

![注册多个中间件](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291009505.png)

### 指定 Controller

`MiddlewareConsumer` 提供的 `forRouters()` 不仅支持指定的路由，还支持指定 `Controller` 生效，下图中将配置 `AuthMiddleware` 仅在 `Users` 控制器下生效。

![指定 Controller](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291013072.png)

### 指定 路由 + HTTP动词

同时 `forRouters()` 还支持在通过路由 + HTTP动词的方式生效，如下图配置的 `LoggerMiddleware` 则仅在通过 `GET` 请求 `users` 路由时生效。

![指定 路由 + HTTP动词](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291017183.png)

### 排除 路由

`MiddlewareConsumer` 提供的 `exclude()` 函数可以在指定路由的情况下用来排除部分不需要生效的部分，下图配置在 `users` 生效后且排除了其中的 GET 和 POST 两种 HTTP 动词的请求。

![排除 路由](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291024311.png)

## 更多中间件

当中间件没有成员、没有额外的依赖也没有依赖其他的中间件时，可以采用函数的形式定义为功能中间件。

![功能中间件](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291028860.png)

当中间件需要在全局范围均生效的情况下，可以将中间件注册到 `INestApplication` 实例，称为全局中间件。

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202305291030743.png)

## 总结

以上就是 Nest 中 中间件的相关知识，它提供的中间件机制可以方便对于请求和响应对象的拦截修改，同时支持不同颗粒度的配置，更多的使用场景及中间件的应用就留在实战中实现吧。

---

<Comment />
