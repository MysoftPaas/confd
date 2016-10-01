# confd

配置confd的运行和配置模板的编写隔离,当有新项目要引入confd配置体系，只需要往confd的运行配置文件夹里添加一个project的配置,
后续该项目的配置文件迭代都不需再修改confd的运行配置。

## 改变的内容

- 修改了配置文件位置, 引入了project的概念
- redis 支持指定特定的database
- WebUI admin
- 增加参数

```
 - `port`           web port
 - `admin-username` 登录用户名
 - `admin-password` 登录帐号
```

## 编译

```bash
> cd admin
> go-bindata -pkg admin static/...
> cd ../ && ./build

```

## 运行示例

- 使用redis作为配置源

./bin/confd  -backend redis -interval 60 -confdir /etc/confd -node 127.0.0.1:6379/8 -client-key 123  

**解释:** 以redis作为源, 同步周期为60秒, redis的连接host=127.0.0.1, port=6379, database=8, password=123

## 新的配置方式使用说明

### 1、confd的运行配置目录

- 默认位置/etc/confd/, 也可以通过-confdir运行参数指定

当需要添加新的项目模板时，只需要在/etc/confd目录下添加项目模板toml配置文件,  
如下示例，有app1,app2,app3三个项目配置:  

```
├── /etc/confd  
│   ├── app1.toml  
│   ├── app2.toml  
│   ├── app3.toml  
│   ├── ...  

```

文件app1.toml的内容如下:

```
[project]
name = appcloud

#这里指定项目配置文件目录
conf_dir = /opt/www/appcloud/protected/config/confd/

```

项目配置文件目录/opt/www/appcloud/protected/config/confd/ 结构如下:  

```
│   ├── conf.d/  
│   │   └── setting.toml  
│   ├── dest/  
│   │   └── setting.php  
│   └── templates/  
│       └── setting.tmpl  
```

setting.toml 文件示例  

```

[template]
src = "setting.tmpl"

# 支持相对路径(相当路径是以项目配置文件里的conf_dir为基础, 如要使用上级目录请使用/../)和绝对路径
dest = "dest/setting.php"
prefix = "appcloud"
keys = [
    "/database/uid",
    "/database/pwd",
]

```

setting.tmpl 文件示例  

```
<?php

define('DB_UID', '{{getv "/database/uid" "root"}}');
define('DB_PWD', '{{getv "/database/pwd" "123456"}}');

```

### 2、redis

如使用-node 127.0.0.1:6379/8, 指定序号为8的database


## TODO

- 集成web gui 管理配置


