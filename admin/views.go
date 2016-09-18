package admin

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/kataras/iris"
	"github.com/kelseyhightower/confd/log"
	"github.com/kelseyhightower/confd/resource/template"
)

type View struct {
	WebServer *WebServer
}

func (v *View) ServeStatic(ctx *iris.Context) {
	path := ctx.PathString()
	if path == "/" {
		path = "index.html"
	} else {
		path = ctx.Param("file")
	}

	requestpath := filepath.Join("static/", path)
	log.Debug("static path:" + requestpath)
	path = strings.Replace(requestpath, "/", string(os.PathSeparator), -1)
	data, err := Asset(path)
	if err != nil {
		ctx.NotFound()
		return
	}

	ctx.ServeContent(bytes.NewReader(data), path, time.Now(), true)
}

func (v *View) Home(ctx *iris.Context) {

	ctx.WriteString(fmt.Sprintf("Hello, configDir: %s", v.WebServer.templateConfig.ConfDir)) //.Render("index.html")
}

func (v *View) GetProjects(ctx *iris.Context) {
	if projects, err := template.LoadProjects(v.WebServer.templateConfig.ConfDir); err == nil {
		ctx.JSON(iris.StatusOK, projects)
	} else {
		log.Error(err.Error())
		ctx.JSON(iris.StatusInternalServerError, make([]int, 0))
	}
}

func getProject(v *View, projectName string) (*template.Project, error) {
	if projects, err := template.LoadProjects(v.WebServer.templateConfig.ConfDir); err == nil {
		for _, proj := range projects {
			if proj.Name == projectName {
				return proj, nil
			}
		}
		return nil, nil
	} else {
		return nil, err
	}

}

// key must contains prefix of resource
func getFullKey(v *View, projectName string, key string) (string, error) {
	confdPrefix := v.WebServer.templateConfig.Prefix
	if proj, err := getProject(v, projectName); err == nil {

		if key == "" {
			return "", errors.New("key is empty")
		}
		key = filepath.Join("/", confdPrefix, proj.Prefix, key)
		return key, nil
	} else {
		return "", err
	}
}

func (v *View) GetProject(ctx *iris.Context) {

	if proj, err := getProject(v, ctx.Param("projectName")); err == nil {
		ctx.JSON(iris.StatusOK, proj)
	} else {
		log.Error(err.Error())
		ctx.JSON(iris.StatusInternalServerError, nil)
	}
}

func (v *View) GetItems(ctx *iris.Context) {
	projectName := ctx.Param("projectName")
	pairs := make(map[string]string)
	if proj, err := getProject(v, projectName); err == nil {
		if tmpResources, err := template.GetTemplateResourceByProject(proj, v.WebServer.templateConfig); err == nil {
			log.Debug("getItems")
			for _, rs := range tmpResources {
				keys := rs.GetAllKeys()
				if pairsNew, err := v.WebServer.templateConfig.StoreClient.GetValues(keys); err == nil {
					for _, k := range keys {
						pairs[k] = pairsNew[k]
					}
				} else {
					log.Fatal(err.Error())
				}
			}

			ctx.JSON(iris.StatusOK, pairs)
		} else {
			log.Fatal(err.Error())
		}

	} else {
		log.Fatal(err.Error())
	}
}

func (v *View) SetItem(ctx *iris.Context) {
	projectName := ctx.Param("projectName")
	// key should contains prefix of resource
	key := ctx.PostValue("key")
	value := ctx.PostValue("value")
	if key, err := getFullKey(v, projectName, key); err == nil {
		log.Debug("set k: %s, v: %s", key, value)
		if redisErr := v.WebServer.templateConfig.StoreClient.Set(key, value); redisErr == nil {
			ctx.JSON(iris.StatusOK, iris.Map{"result": true})
		} else {
			log.Error(redisErr.Error())
			ctx.EmitError(500) //.JSON(iris.StatusInternalServerError, "")
		}
	} else {
		log.Error(err.Error())
		ctx.JSON(iris.StatusInternalServerError, iris.Map{"result": false})
	}

}

func (v *View) GetItem(ctx *iris.Context) {

	key := ctx.Param("key")
	projectName := ctx.Param("projectName")

	if key, err := getFullKey(v, projectName, key); err == nil {

		if key == "" {
			ctx.JSON(iris.StatusOK, nil)
			return
		}
		key = strings.Replace(key, "-", "/", -1)
		keys := []string{key}
		if pairs, err := v.WebServer.templateConfig.StoreClient.GetValues(keys); err == nil {
			ctx.JSON(iris.StatusOK, pairs)
		} else {
			log.Error(err.Error())
			ctx.JSON(iris.StatusInternalServerError, nil)
		}
	} else {
		log.Error(err.Error())
		ctx.JSON(iris.StatusInternalServerError, nil)
	}
}

func (v *View) DeleteItem(ctx *iris.Context) {
	key := ctx.Param("key")
	projectName := ctx.Param("projectName")
	if key == "" {
		ctx.JSON(iris.StatusOK, iris.Map{"result": false, "msg": "key is empty"})
	} else {
		key = strings.Replace(key, "-", "/", -1)
		if key, err := getFullKey(v, projectName, key); err == nil {
			if err := v.WebServer.templateConfig.StoreClient.Remove(key); err == nil {
				ctx.JSON(iris.StatusOK, iris.Map{"result": true})
			} else {
				log.Error(err.Error())
				ctx.JSON(iris.StatusInternalServerError, iris.Map{"result": false, "msg": err.Error()})
			}

		} else {
			log.Error(err.Error())
			ctx.JSON(iris.StatusInternalServerError, iris.Map{"result": false, "msg": err.Error()})
		}
	}

}
