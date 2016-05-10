package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/kelseyhightower/confd/backends"
	"github.com/kelseyhightower/confd/log"
	"github.com/kelseyhightower/confd/resource/project"
	"github.com/kelseyhightower/confd/resource/template"
)

func main() {
	flag.Parse()
	if printVersion {
		fmt.Printf("confd %s\n", Version)
		os.Exit(0)
	}
	if err := initConfig(); err != nil {
		log.Fatal(err.Error())
	}

	log.Info("Starting confd")

	storeClient, err := backends.New(backendsConfig)
	if err != nil {
		log.Fatal(err.Error())
	}

	projects, err := project.LoadProjects(config.ConfDir)
	if err != nil {
		log.Fatal(err.Error())
	}
	templateConfigs := make([]template.Config, 0)
	for _, project := range projects {

		// Template configuration.
		templateConfig := template.Config{
			ConfDir:       project.ConfDir,
			ConfigDir:     filepath.Join(project.ConfDir, "conf.d"),
			KeepStageFile: keepStageFile,
			Noop:          config.Noop,
			Prefix:        config.Prefix,
			SyncOnly:      config.SyncOnly,
			TemplateDir:   filepath.Join(project.ConfDir, "templates"),
			StoreClient:   storeClient,
		}
		templateConfigs = append(templateConfigs, templateConfig)
	}

	if onetime {
		for _, templateConfig := range templateConfigs {

			if err := template.Process(templateConfig); err != nil {
				log.Fatal(err.Error())
			}
		}
		os.Exit(0)
	}

	stopChan := make(chan bool)
	doneChan := make(chan bool)
	errChan := make(chan error, 10)

	var processor template.Processor
	switch {
	case config.Watch:
		processor = template.WatchProcessor(templateConfigs, stopChan, doneChan, errChan)
	default:
		processor = template.IntervalProcessor(templateConfigs, stopChan, doneChan, errChan, config.Interval)
	}

	go processor.Process()

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)
	for {
		select {
		case err := <-errChan:
			log.Error(err.Error())
		case s := <-signalChan:
			log.Info(fmt.Sprintf("Captured %v. Exiting...", s))
			close(doneChan)
		case <-doneChan:
			os.Exit(0)
		}
	}
}
