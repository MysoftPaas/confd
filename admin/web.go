package admin

import (
	"fmt"

	"github.com/iris-contrib/middleware/cors"
	"github.com/kataras/iris"
	"github.com/kelseyhightower/confd/resource/template"
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
	crs := cors.Default()
	crs.Log = iris.Logger
	config := iris.Configuration{Charset: "UTF-8", Gzip: true}
	app := iris.New(config)
	app.Use(crs)

	//app.Favicon("./favicon.ico")
	view := &View{WebServer: w}

	//service static file
	app.Get("/", view.ServeStatic)
	app.Get("/static/*file", view.ServeStatic)

	app.Get("/api/projects", view.GetProjects)
	app.Get("/api/project/:projectName", view.GetProject)
	app.Get("/api/project/:projectName/item/:key", view.GetItem)
	app.Delete("/api/project/:projectName/item/:key", view.DeleteItem)
	app.Get("/api/project/:projectName/items", view.GetItems)
	app.Post("/api/project/:projectName/items", view.SetItem)

	app.Listen(fmt.Sprintf(":%d", w.port))
	//iris.ListenTLSAuto(fmt.Sprintf(":%d", port))
}
