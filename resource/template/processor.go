package template

import (
	"fmt"
	"path/filepath"
	"sync"
	"time"

	"github.com/kelseyhightower/confd/log"
	"github.com/kelseyhightower/confd/resource/project"
)

type Processor interface {
	Process()
}

func Process(config Config) error {
	ts, err := getTemplateResources(config)
	if err != nil {
		return err
	}
	return process(ts)
}

func process(ts []*TemplateResource) error {
	var lastErr error
	for _, t := range ts {
		if err := t.process(); err != nil {
			log.Error(err.Error())
			lastErr = err
		}
	}
	return lastErr
}

type intervalProcessor struct {
	config   Config
	stopChan chan bool
	doneChan chan bool
	errChan  chan error
	interval int
}

func IntervalProcessor(config Config, stopChan, doneChan chan bool, errChan chan error, interval int) Processor {
	return &intervalProcessor{config, stopChan, doneChan, errChan, interval}
}

func (p *intervalProcessor) Process() {
	defer close(p.doneChan)
	for {

		projects, err := project.LoadProjects(p.config.ConfDir)
		if err != nil {
			log.Fatal(err.Error())
		}
		for _, project := range projects {

			// Template configuration.
			templateConfig := Config{
				ConfDir:       project.ConfDir,
				ConfigDir:     filepath.Join(project.ConfDir, "conf.d"),
				KeepStageFile: p.config.KeepStageFile,
				Noop:          p.config.Noop,
				Prefix:        p.config.Prefix,
				SyncOnly:      p.config.SyncOnly,
				TemplateDir:   filepath.Join(project.ConfDir, "templates"),
				StoreClient:   p.config.StoreClient,
			}

			ts, err := getTemplateResources(templateConfig)
			if err != nil {
				log.Warning("resource parse failure: %s", err.Error())
				continue
			}
			process(ts)
		}

		select {
		case <-p.stopChan:
			break
		case <-time.After(time.Duration(p.interval) * time.Second):
			continue
		}
	}
}

type watchProcessor struct {
	config   Config
	stopChan chan bool
	doneChan chan bool
	errChan  chan error
	wg       sync.WaitGroup
}

func WatchProcessor(config Config, stopChan, doneChan chan bool, errChan chan error) Processor {
	var wg sync.WaitGroup
	return &watchProcessor{config, stopChan, doneChan, errChan, wg}
}

func (p *watchProcessor) Process() {
	defer close(p.doneChan)
	ts := make([]*TemplateResource, 0)

	projects, err := project.LoadProjects(p.config.ConfDir)
	if err != nil {
		log.Fatal(err.Error())
	}
	for _, project := range projects {

		// Template configuration.
		templateConfig := Config{
			ConfDir:       project.ConfDir,
			ConfigDir:     filepath.Join(project.ConfDir, "conf.d"),
			KeepStageFile: p.config.KeepStageFile,
			Noop:          p.config.Noop,
			Prefix:        p.config.Prefix,
			SyncOnly:      p.config.SyncOnly,
			TemplateDir:   filepath.Join(project.ConfDir, "templates"),
			StoreClient:   p.config.StoreClient,
		}

		arr, err := getTemplateResources(templateConfig)
		if err != nil {
			log.Warning("resource parse failure: %s", err.Error())
			continue
		}
		ts = append(ts[:], arr[:]...)
	}

	for _, t := range ts {
		t := t
		p.wg.Add(1)
		go p.monitorPrefix(t)
	}
	p.wg.Wait()
}

func (p *watchProcessor) monitorPrefix(t *TemplateResource) {
	defer p.wg.Done()
	keys := appendPrefix(t.Prefix, t.Keys)
	for {
		index, err := t.storeClient.WatchPrefix(t.Prefix, keys, t.lastIndex, p.stopChan)
		if err != nil {
			p.errChan <- err
			// Prevent backend errors from consuming all resources.
			time.Sleep(time.Second * 2)
			continue
		}
		t.lastIndex = index
		if err := t.process(); err != nil {
			p.errChan <- err
		}
	}
}

func getTemplateResources(config Config) ([]*TemplateResource, error) {
	var lastError error
	templates := make([]*TemplateResource, 0)
	log.Debug("Loading template resources from confdir " + config.ConfDir)
	if !isFileExist(config.ConfDir) {
		log.Warning(fmt.Sprintf("Cannot load template resources: confdir '%s' does not exist", config.ConfDir))
		return nil, nil
	}
	paths, err := recursiveFindFiles(config.ConfigDir, "*toml")
	if err != nil {
		return nil, err
	}

	if len(paths) < 1 {
		log.Warning("Found no projects")
	}

	for _, p := range paths {
		log.Debug(fmt.Sprintf("Found project: %s", p))
		t, err := NewTemplateResource(p, config)
		if err != nil {
			lastError = err
			continue
		}
		templates = append(templates, t)
	}
	return templates, lastError
}
