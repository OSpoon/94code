---
title: NestJs 模块化组织App结构
date: '2023-05-25 12:30'
sidebar: 'auto'
tags:
 - NestJs
 - Module
description: 搞清楚如何组织 App 的结构在我看来是学习新框架首先要做的事情，NestJs 引入的模块化的系统对于前端学习应该是比较轻松的一件事情，通过这个案例一起来认识 NestJs 中的模块化构建 App 的方式。
---

# NestJs 模块化组织App结构

🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得

## 进入正题

搞清楚如何组织 App 的结构在我看来是学习新框架首先要做的事情，NestJs 引入的模块化的系统对于前端学习应该是比较轻松的一件事情，通过这个案例一起来认识 NestJs 中的模块化构建 App 的方式。

## 基础项目准备

> 推荐你来1024Code Fork 我的[《Nest Module》](https://1024code.com/codecubes/bypzyje) 开始这次学习，如果你不习惯使用在线的IDE，那么可以将项目导出到本地运行~

## 认识 Module

在 Nest 中模块是具有@Module() 装饰器的类，Nest 使用模块来组织应用程序的框架结构。

模块化的作用主要是来组织应用程序的框架结构，那么模块组织应用程序的框架结构使用的手段分别是整合（Controller、Provider、Module）和提供（Provider，Module）。通俗来说开发时要注意：创建后就要注册，跨模块就要导出。

### 创建 Module：

使用 Nest CLI 创建模块：

```bash
# 创建未分组模块
nest g mo <module-name>

# 创建分组模块
nest g mo <path>/<module-name>
```

### Module 模型：

|属性|作用|
|--|--|
|imports|整合模块|
|controllers|整合控制器|
|providers|整合提供者|
|exports|导出模块、提供者|

![Module 模型](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202305242331648.png)

## 功能模块

功能模块应该是包含一组处理同一资源的 Controller、Providers 等的模块，例如在示例中提供的 `UsersModule`，它的主要职责就是来组织 `UsersController` 和 `UsersProviders`。

* 下图是 `UsersModule` 功能模块结构示意图：

![结构示意图](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202305242337629.png)

* 下图是 `UsersModule` 代码层面注册的示意图：

![代码示意图](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202305242339745.png)

### 功能模块使用

功能模块的使用时最简单的，注册到当前的 Module 中，即可进行注入并使用：

```typescript
// users.controller.ts

import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(
    // ① 注入
    private usersService: UsersService,
  ){}

  @Get()
  findAll(): string {
    // ② 使用
    const users = this.usersService.findAll();
    return `This action return all users：${users}`;
  }
}

```

## 共享模块

共享模块应该是包含将已有的功能模块中的 `Providers` 或 `Module` 提供给更多模块使用的模块。

在示例中引入的 `BankCardModule` 模块，示例中银行卡的资源属于 `BankCardModule` 自身需要组织的部分，但银行卡资源同样需要关联到用户资源才能完成实际的业务。那么就需要将已开发的 `UsersModule` 中的部分能力提供给 `BankCardModule` 来使用。

* 下图是 `BankCardModule` 模块结构示意图：

![结构示意图](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202305242346161.png)

* 下图是 `BankCardModule` 和 `UsersModule` 代码层面注册和共享模块的示意图：

![代码示意图](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202305242346832.png)

### 共享模块使用

共享模块需要将被共享的模块导出，在需要使用共享模块的模块中进行导入，在使用时同样是先注入，再使用：

```typescript
// bank-card.controller.ts

import { Controller, Get } from '@nestjs/common';
import { BankCardService } from './bank-card.service';
import { UsersService } from '../users/users.service';

@Controller('bank-card')
export class BankCardController {
  
  constructor(
    private bankCardService: BankCardService,
    // ① 注入共享模块提供的 usersService
    private usersService: UsersService,
  ){}

  @Get()
  findAll(): string {
    const bankCards = this.bankCardService.findAll();
    // ② 使用共享模块提供的 usersService
    const users = this.usersService.findAll();
    return `This action return all BacnkCard and Users：${bankCards}、${users}`
  }
}
```

## 全局模块

全局模块应该是与资源处理非紧密相关的模块，例如：工具类、配置类、数据库连接类等，或确需全局使用的资源处理模块。

在示例中通过引入工具类来了解全局模块的注册及使用。

* 下图是 `GlobalModule` 全局模块结构示意图：

![结构示意图](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202305242351429.png)

* 下图是 `GlobalModule`  代码层面注册的示意图：

![代码示意图](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202305242352300.png)

### 全局模块使用

全局模块注册完成后使用的我们几乎可以随处使用了，我们分别在 `UsersController` 和 `BankCardService` 中注入并使用：

```typescript
// users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HelperService } from '../services/helper/helper.service';

@Controller('users')
export class UsersController {

  constructor(
    // ① 注入 helper
    private helper: HelperService,
  ){}

  @Get()
  findAll(): string {
    // ② 使用
    this.helper.log('UsersController findAll ...');
    return `This action return all users`;
  }
}
```

```typescript
// bank-card.service.ts

import { Injectable } from '@nestjs/common';
import { HelperService } from '../services/helper/helper.service';

@Injectable()
export class BankCardService {

  constructor(
    // 注入 helper
    private helper: HelperService
  ){}  
  
  findAll() {
    // 通过 this.xxx 使用
    this.helper.log('BankCardService findAll ...')
  }
}

```

## 总结

以上就是 Nest 关于模块的一些知识，它提供了功能模块、共享模块 和 全局模块，足以应对常见的开发场景，较为复杂的动态模块在后续的深入学习中再来讲解。

构建复杂的 App 结构优先采用的就应该是模块化的思想，通过搭积木的形式构建完整的 App 结构，形成图像。对于开发阶段和维护阶段都是很有帮助的。

---

<Comment />
