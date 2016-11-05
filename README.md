# confd

配置confd的运行和配置模板的编写隔离,当有新项目要引入confd配置体系，只需要往confd的运行配置文件夹里添加一个project的配置

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

## 运行示例(redis作为配置源)

配置文件默认位置 `/etc/confd/confd.conf`, 项目文件默认位置 `/etc/confd/conf.d`

> ./bin/confd -config-file=/etc/confd/confd.conf -onetime

`如果指定-onetime参数，则只运行一次即退出，否则作为服务运行`

配置文件 `confd.conf`  

```

backend="redis"
confdir="/etc/confd/conf.d"
log-level="error"
interval=60
port=1520
client_key="dev"
admin_username="admin"
admin_password="123"
nodes=[
  "127.0.0.1:6379/1",
]

```

**配置项说明**  

`backend`: 存储源类型
`confdir`: 项目资源配置文件目录(默认/etc/confd/conf.d)
`log-level`: 日志级别,默认info
`interval`: 检查同步配置文件的时间间隔(秒)
`port`: Web 端口
`client_key`: redis 授权密码
`admin_username`: Web登录帐号
`admin_password`: web登录密码
`nodes`: backend 服务器地址, 上述配置值中使用redis的database为序号为1, 默认为0

## 项目配置文件说明

- 新引入项目到confd, 需要在/etc/confd/conf.d/目录, 增加一个toml配置文件

如下示例，有app1,app2,app3三个项目配置:  

```
├── /etc/confd/conf.d/
│   ├── app1.toml  
│   ├── app2.toml  
│   ├── app3.toml  
│   ├── ...  

```

文件app1.toml的内容如下:

```
[project]
name = appcloud

#这里指定项目的配置文件目录
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

## 部署为服务的方式运行

新建文件/etc/init.d/confd

```
$ sudo chmod +x /etc/init.d/confd
$ sudo chkconfig --add confd
$ sudo chkconfig confd on
$ sudo service confd start

```

confd文件内容

```

#!/bin/bash
# source function library
. /etc/rc.d/init.d/functions

prog="confd"
user="root"
exec="/usr/local/bin/$prog"
pidfile="/var/run/$prog.pid"
lockfile="/var/lock/subsys/$prog"
logfile="/var/log/$prog"
conffile="/etc/confd/confd.conf"
confdir="/etc/confd/confd.d"

# pull in sysconfig settings
[ -e /etc/sysconfig/$prog ] && . /etc/sysconfig/$prog

export GOMAXPROCS=${GOMAXPROCS:-2}

start() {
    [ -x $exec ] || exit 5
    
    [ -f $conffile ] || exit 6
    [ -d $confdir ] || exit 6

    umask 077

    touch $logfile $pidfile
    chown $user:$user $logfile $pidfile

    echo -n $"Starting $prog: "
    
    ## holy shell shenanigans, batman!
    ## daemon can't be backgrounded.  we need the pid of the spawned process,
    ## which is actually done via runuser thanks to --user.  you can't do "cmd
    ## &; action" but you can do "{cmd &}; action".
    daemon \
        --pidfile=$pidfile \
        --user=$user \
        " { $exec -config-file=$conffile -confdir=$confdir &>> $logfile & } ; echo \$! >| $pidfile "
    
    RETVAL=$?
    echo
    
    [ $RETVAL -eq 0 ] && touch $lockfile
    
    return $RETVAL
}

stop() {
    echo -n $"Shutting down $prog: "
    ## graceful shutdown with SIGINT
    killproc -p $pidfile $exec -INT
    RETVAL=$?
    echo
    [ $RETVAL -eq 0 ] && rm -f $lockfile
    return $RETVAL
}

restart() {
    stop
    start
}

reload() {
    echo -n $"Reloading $prog: "
    killproc -p $pidfile $exec -HUP
    echo
}

force_reload() {
    restart
}

rh_status() {
    status -p "$pidfile" -l $prog $exec
}

rh_status_q() {
    rh_status >/dev/null 2>&1
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
        restart
        ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload}"
        exit 2
esac

exit $?

```
