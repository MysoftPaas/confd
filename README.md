# confd

- useage 

./confd -backend redis -interval 5 -confdir /etc/confd

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
