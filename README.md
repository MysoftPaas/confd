# confd

- useage 

./bin/confd  -backend redis -interval 5 -confdir /etc/confd -node 127.0.0.1:6379/8 -client-key 123


## Changes

### 1、config 

- /etc/confd/

```
├── /etc/confd  
│   ├── app1.toml  
│   ├── app2.toml  
│   ├── app3.toml  
│   ├── ...  

```

- app1.toml

```
[project]
name = appcloud
conf_dir = /opt/www/appcloud/protected/config/confd/

```

- structure of conf_dir

```
│   ├── conf.d/  
│   │   └── web.toml  
│   └── templates/  
│       └── web.tmpl  
```

- templateResource.dest

support relactive path base on project.conf_dir and absolute path

```

[template]
src = "myconfig.tmpl"
#relactive path
dest = "dest/myconfig.conf.php"
keys = [
    "/myapp/database/url",
    "/myapp/database/user",
]

```

```

[template]
src = "myconfig.tmpl"
#absolute path
dest = "/tmp/myconfig.conf.php"
keys = [
    "/myapp/database/url",
    "/myapp/database/user",
]

```

### 2、redis

- support special database

./bin/confd  -backend redis -interval 5 -confdir /etc/confd -node 127.0.0.1:6379/8 -client-key 123

> host:127.0.0.1, port:6379, database:8, password:123
