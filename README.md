# confd

- useage 

./bin/confd  -backend redis -interval 5 -confdir /etc/confd -node 127.0.0.1:6379/8 -client-key 123

> host:127.0.0.1, port:6379, database:8, password:123

## Changes

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
