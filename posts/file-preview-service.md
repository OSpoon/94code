---
date: 2023-02-03
title: SpringBoot在线文档预览服务
tags:
- Java
- OpenOffice
- LibreOffice
description: 使用基于 SpringBoot 的 file-online-preview 开源项目，迅速搭建一套在线文档预览服务，替换在前端进行大量耗时操作的方案
---

# SpringBoot在线文档预览服务

## 本地源码启动：

### 1. 安装必要的工具及套件：

1. 安装 IDEA 开发工具：[https://www.jetbrains.com/idea/](https://www.jetbrains.com/idea/)；
2. 安装 Java1.8+ 环境依赖：[https://www.oracle.com/java/technologies/downloads/#java8](https://www.oracle.com/java/technologies/downloads/#java8)；
3. 安装 OpenOffice 套件：[http://www.openoffice.org/download/](http://www.openoffice.org/download/)；
4. 安装 LibreOffice 套件：[https://zh-cn.libreoffice.org/](https://zh-cn.libreoffice.org/)；

PS：OpenOffice 和 LibreOffice 必须安装其中一项；

### 2. 本地部署源码：
```shell
git clone git@gitee.com:kekingcn/file-online-preview.git
```

### 3. 调整Office路径：
配置文件：`file-online-preview-master\server\src\main\config\application.properties`
```shell
#openoffice home路径
office.home = C:\\Program Files (x86)\\OpenOffice 4
#office.home = C:\\Program Files\\LibreOffice
#office.home = ${KK_OFFICE_HOME:default}
```

### 4. 水印设置：
配置文件：`file-online-preview-master\server\src\main\config\application.properties`
```shell
#水印内容
#例：watermark.txt = ${WATERMARK_TXT:凯京科技内部文件，严禁外泄}
#如需取消水印，内容设置为空即可，例：watermark.txt = ${WATERMARK_TXT:}
watermark.txt = ${WATERMARK_TXT:小鑫同学在线}
#水印x轴间隔
watermark.x.space = ${WATERMARK_X_SPACE:100}
#水印y轴间隔
watermark.y.space = ${WATERMARK_Y_SPACE:100}
#水印字体大小
watermark.fontsize = ${WATERMARK_FONTSIZE:18px}
#水印透明度，要求设置在大于等于0.005，小于1
watermark.alpha = ${WATERMARK_ALPHA:0.1}
#水印倾斜度数，要求设置在大于等于0，小于90
watermark.angle = ${WATERMARK_ANGLE:30}
```

## 服务器部署：

### 1. 安装远程连接工具：
安装[FinalShell](http://www.hostbuf.com/)工具后以此添加主机IP、用户名、密码等连接信息。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b9512a8187247f9959ece7a4c8fcc53~tplv-k3u1fbpfcp-zoom-1.image)

### 2. Office套件安装：
新的环境大概率是没有相关的**Office**套件的，那么可以使用[kkFileView for install.sh](https://gitee.com/kekingcn/file-online-preview/blob/master/server/src/main/bin/install.sh)来进行安装，将脚本的完整内容拷贝至**FinalShell**终端。
```shell
#!/bin/bash
cd /tmp

install_redhat() {
   wget https://kkfileview.keking.cn/LibreOffice_7.3.7_Linux_x86-64_rpm.tar.gz -cO LibreOffice_7_rpm.tar.gz && tar -zxf /tmp/LibreOffice_7_rpm.tar.gz && cd /tmp/LibreOffice_7.3.7.2_Linux_x86-64_rpm/RPMS
   echo $?
   if [ $? -eq 0 ];then
     yum install -y libSM.x86_64 libXrender.x86_64  libXext.x86_64
     yum groupinstall -y  "X Window System"
     yum localinstall -y *.rpm
     echo 'install finshed...'
   else
     echo 'download package error...'
   fi
}

install_ubuntu() {
   wget  https://kkfileview.keking.cn/LibreOffice_7.3.7_Linux_x86-64_deb.tar.gz  -cO LibreOffice_7_deb.tar.gz && tar -zxf /tmp/LibreOffice_7_deb.tar.gz && cd /tmp/LibreOffice_7.3.7.2_Linux_x86-64_deb/DEBS
   echo $?
 if [ $? -eq 0 ];then
     apt-get install -y libxinerama1 libcairo2 libcups2 libx11-xcb1
     dpkg -i *.deb
     echo 'install finshed...'
  else
    echo 'download package error...'
 fi
}


if [ -f "/etc/redhat-release" ]; then
  yum install -y wget
  install_redhat
else
  apt-get install -y wget
  install_ubuntu
fi
```
注意：下载后如果发现为能成功安装，可以手动执行命令：`yum -y localinstall *.rpm`；

### 3. 利用 docker 部署：

1. docker部署如遇到 **driver failed programming external connectivity on endpoint xxx**，那么大概率是由于与防火墙冲突导致，建议重启docker：`systemctl restart docker`；
2. 正常情况下还需要在阿里云对端口进行放行，如果有使用到宝塔面板，同样需要在宝塔面板进行端口放心；
```
// 拉取镜像
docker pull keking/kkfileview:4.1.0
// 启动镜像
docker run -it -p 8012:8012 keking/kkfileview:4.1.0
```
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1479cb36d6b147bab40743a896588b02~tplv-k3u1fbpfcp-zoom-1.image)
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afbd47792a46444d9ddc18334ca561cf~tplv-k3u1fbpfcp-zoom-1.image)

<Comment />
