package admin

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/kelseyhightower/confd/log"
	"github.com/kelseyhightower/confd/resource/template"

	"github.com/kataras/iris"
)

type WebServer struct {
	templateConfig template.Config
	port           int
}

func New(templateConfig template.Config, port int) *WebServer {
	return &WebServer{
		templateConfig: templateConfig,
		port:           port,
	}

}

func (w *WebServer) Start() {
	config := iris.Configuration{Charset: "UTF-8", Gzip: true}
	app := iris.New(config)
	//app.Favicon("./favicon.ico")
	view := &View{WebServer: w}
	app.Get("/", view.Home)

	//service static file
	app.Get("/static/*file", func(ctx *iris.Context) {
		requestpath := filepath.Join("static/", ctx.Param("file"))
		log.Debug("static path:" + requestpath)
		path := strings.Replace(requestpath, "/", string(os.PathSeparator), -1)
		data, err := Asset(path)
		if err != nil {
			ctx.NotFound()
			return
		}

		ctx.ServeContent(bytes.NewReader(data), path, time.Now(), true)
	})

	app.Get("/api/projects", view.GetProjects)
	app.Get("/api/project/:projectName", view.GetProject)
	app.Get("/api/project/:projectName/item/:key", view.GetItem)
	app.Delete("/api/project/:projectName/item/:key", view.DeleteItem)
	app.Get("/api/project/:projectName/items", view.GetItems)
	app.Post("/api/project/:projectName/items", view.SetItem)

	app.Listen(fmt.Sprintf(":%d", w.port))
	//iris.ListenTLSAuto(fmt.Sprintf(":%d", port))
}
