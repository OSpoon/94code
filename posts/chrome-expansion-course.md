---
date: 2023-04-04
title: 带你快速走进Chrome扩展开发的大门
tags:
- Chrome
- expansion 
description: Chrome 扩展程序通过可以向 Chrome 浏览器添加特性和功能来增强浏览体验，可以构建一些强大的生产力工具，也可以丰富网页的内容，还可以做一些信息的聚合等等。本篇文章将带你通过三个简单的案例带你快速走进Chrome扩展开发的大门。
---

# 带你快速走进Chrome扩展开发的大门

>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得

## 进入正题

Chrome 扩展程序可以通过向 Chrome 浏览器添加特性和功能来增强浏览体验，可以构建一些强大的生产力工具，也可以丰富网页的内容，还可以做一些信息的聚合等等。本篇文章将带你通过三个简单的案例带你快速走进Chrome扩展开发的大门。

## 思维脑图

https://www.processon.com/view/link/642b9f2edd847f4d0fab623c

## Chrome扩展开发介绍

### 技能要求？

Chrome扩展开发技能要求同创建Web应用程序相同的Web技术编写，也就是作为前端程序员最为熟悉的前端开发三件套，HTML、CSS 和 JavaScript。

### Chrome扩展API？

Chrome扩展可以使用浏览器提供的所有JavaScriptAPI。使用扩展程序比Web应用程序更强大的是它们对ChromeAPI的访问。

1. 可以获得更改网站的功能和行为。
2. 允许用户跨网站收集和组织信息。
3. 向 Chrome DevTools 添加功能。

### Chrome扩展文件？

| 序号 | 类型 | 描述 |
|--|--|--|
| 1 | manifest | 扩展程序的清单是唯一必须具有特定文件名的必需文件： manifest.json 。 它还必须位于扩展程序的根目录中。清单记录重要的元数据，定义资源，声明权限，并标识哪些文件在后台和页面上运行|
| 2 | content scripts | 内容脚本在网页上下文中执行 Javascript。他们还可以读取和修改他们注入的页面的 DOM。 内容脚本只能使用 Chrome API 的一个子集，但可以通过与扩展服务工作者交换消息来间接访问其余部分|
| 3 | service worker | 扩展服务工作者处理和监听浏览器事件。有多种类型的事件，例如导航到新页面、删除书签或关闭选项卡。它可以使用所有的Chrome API，但不能直接与网页内容交互；这就是内容脚本的工作 |
| 4 | popup/page | 扩展可以包含各种 HTML 文件，例如弹出窗口、选项页面和其他 HTML 页面。所有这些页面都可以访问 Chrome API |

## 实现阅读时长提示

通过开发chrome expansion实现在掘金文章页面提示读者完成阅读所需要的大概时间。

### 案例关键词

1. 内容脚本
2. 匹配模式

### 期望效果

* 插件生效前：

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202304041503768.png)

* 插件生效后：

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202304041504314.png)

### 配置清单文件

对`manifest_version`、`name`、`description`、`version`和`icons`这几项进行配置。

```json
{
  "manifest_version": 3,
  "name": "掘金插件",
  "description": "插件开发案例",
  "version": "0.0.1",
  "icons": {
    "16": "./assets/icon-16.png",
    "32": "./assets/icon-32.png",
    "48": "./assets/icon-48.png",
    "128": "./assets/icon-128.png"
  }
}
```

PS：配合VSCode插件《Chrome Extension Manifest JSON Schema》使用

### 将内容脚本注入页面

1. 先配置（指向内容脚本文件、配置生效范围（匹配模式））：

```json
{
  "content_scripts": [
    {
      "js": ["./contents/juejin.js"],
      "matches": ["https://juejin.cn/post/*"]
    }
  ]
}
```

2. 后编写（计算阅读时长、注入元素）：

```JavaScript
/**
 * 计算输入文本所需要的阅读时长
 * @param {*} content 
 */
 function getReadTime(content) {
    // 统计文本中的字符数
    const totalWords = content.trim().split(/\s+/g).length;
    // 计算每分钟阅读的字数
    const wordsPerMinute = 200;
    // 计算页面的阅读时间（单位为分钟）
    const readingTime = Math.ceil(totalWords / wordsPerMinute);
    return readingTime;
}

const main = document.querySelector("main");

if (main) {
    // 向h1标题后面插入一个h3小标题，用来显示阅读完成需要的时间
    const heading = main.querySelector("h1");
    const badge = document.createElement("h3");
    const readingTime = getReadTime(main.textContent);
    badge.textContent = `⏱️阅读完需：约 ${readingTime} 分钟`;
    heading.insertAdjacentElement("afterend", badge);
}
```

### 加载插件并测试

1. 打开Chrome扩展程序（chrome://extensions/）
2. 打开开发者模式
3. 加载已解压的扩展程序（包含清单文件的文件夹）

PS：插件开发过程中会多次修改，在修改后需要在浏览器的扩展程序中重新刷新后生效


## 实现专注阅读模式

通过开发chrome expansion实现单击扩展ICON进入和退出掘金文章专注阅读模式。（会对多余内容进行精简）

### 案例关键词

1. 事件协调器
2. 权限：activeTab
3. API：Scripting API
4. 快捷键

### 期望效果

* 插件开启前

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202304041511484.png)

* 插件开启后

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202304041511622.png)

### 配置清单文件

沿用上一个案例

### 注入服务工作者

1. 先配置（指向服务工作者文件）

```json
{
  "background": {
    "service_worker": "background.js"
  }
}
```

2. 后编写

* 监听onInstalled事件，更新插件徽章文案
* 监听onClicked事件，在指定选项卡下操作时变更插件状态
* 根据插件状态变化动态插入和删除专注模式文件

```JavaScript
const webstore = 'https://juejin.cn/'

// 监听onInstalled事件，初始插件状态
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

// 监听onClicked事件，在指定选项卡下操作时变更插件状态
chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(webstore)) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === 'ON' ? 'OFF' : 'ON'
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
        // 根据插件状态变化动态插入和删除专注模式文件
        if (nextState === "ON") {
            await chrome.scripting.insertCSS({
              files: ["focus-mode.css"],
              target: { tabId: tab.id },
            });
        } else if (nextState === "OFF") {
            await chrome.scripting.removeCSS({
              files: ["focus-mode.css"],
              target: { tabId: tab.id },
            });
        }
    }
})
```

* 专注模式文件（去除页面多余内容的CSS文件）

```css
.sidebar {
  display: none;
}

.article-suspended-panel {
  display: none;
}

.main-area {
  width: 100% !important;
}
```

### 补充必要配置

1. 激活插件ICON的Action事件

```json
{
  "action": {
    "default_icon": {
      "16": "./assets/icon-16.png",
      "32": "./assets/icon-32.png",
      "48": "./assets/icon-48.png",
      "128": "./assets/icon-128.png"
    }
  }
}
```

2. 添加activeTab权限（单击插件ICON后可以得到Tab信息）

```json
{
   "permissions": ["activeTab"]
}
```

3. 添加scripting权限（可以使用scripting API 添加/删除 样式表）

```json
{
  "permissions": ["scripting"]
}
```

4. 快捷键支持

```json
{
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+B",
        "mac": "Command+B"
      }
    }
  }
}
```

### 在扩展程序中刷新插件并测试


## 实现选项卡的管理

通过开发chrome expansion实现在弹窗中整合已打开的掘金文章列表

### 案例关键词

1. API：Tabs API
2. 主机权限

### 期望效果

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202304041517224.png)

### 配置清单文件

沿用上一个案例

### 创建弹窗

1. 先配置

```json
{
  "action": {
    "default_popup": "./popups/popup.html"
  }
}
```

3. 后编写（编写页面、编写样式、编写脚本）

* 编写页面

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./popup.css" />
</head>

<body>
    <template id="li_template">
        <li>
            <a>
                <h3 class="title">Tab Title</h3>
                <p class="pathname">Tab Pathname</p>
            </a>
        </li>
    </template>

    <h1>已打开的掘金文章</h1>
    <ul></ul>
    <script src="./popup.js" type="module"></script>
</body>

</html>
```

* 编写样式

```css
body {
  width: 20rem;
}

ul {
  list-style-type: none;
  padding-inline-start: 0;
  margin: 1rem 0;
}

li {
  padding: 0.25rem;
}
li:nth-child(odd) {
  background: #80808030;
}
li:nth-child(even) {
  background: #ffffff;
}

h3,
p {
  margin: 0;
}
```

* 编写脚本

```JavaScript
const tabs = await chrome.tabs.query({
    url: [
        "https://juejin.cn/post/*"
    ],
});

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("-")[0].trim();
    const pathname = new URL(tab.url).pathname.slice("/post".length);

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    element.querySelector("a").addEventListener("click", async () => {
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });

    elements.add(element);
}
document.querySelector("ul").append(...elements);
```

### 授权站点

既能得到数据，又不扩大范围

```json
{
  "host_permissions": ["https://juejin.cn/*"]
}
```

### 在扩展程序中刷新插件并测试

## 总结

Chrome扩展开发入门指南就先介绍这么多，这三个案例包含了Chrome扩展开发的几个重要概念，更多的Chrome扩展开发学习可以通过阅读[官方文档](https://developer.chrome.com/docs/extensions/mv3/getstarted/)，当然也包括这三个案例，好了动手操作一下吧。

PS：完整代码见[1024Code](https://1024code.com/codecubes/kwAhOat)；

<Comment />
