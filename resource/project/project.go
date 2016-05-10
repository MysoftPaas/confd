package project

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
	"github.com/kelseyhightower/confd/log"
)

type ProjectConfig struct {
	ProjectProperty Project `toml:"project"`
}

type Project struct {
	//name of project
	Name string
	//directory of config
	ConfDir string `toml:"conf_dir"`
}

func templateToProject(filePath string) (*Project, error) {

	var projConfig ProjectConfig

	log.Debug("Loading project from " + filePath)
	_, err := toml.DecodeFile(filePath, &projConfig)
	if err != nil {
		return nil, fmt.Errorf("Cannot process project %s - %s", filePath, err.Error())
	}

	return &projConfig.ProjectProperty, nil
}

//load projects from confd.confDir
func LoadProjects(path string) ([]*Project, error) {

	log.Debug("Loading projects from " + path)

	projects := make([]*Project, 0)
	if _, err := os.Stat(path); err != nil {
		fmt.Errorf("Cannot find path %s", path)
	}

	paths, err := recursiveFindFiles(path, "*toml")
	if err != nil {
		return nil, err
	}

	if len(paths) < 1 {
		log.Warning("Found no templates")
	}

	var lastError error
	for _, p := range paths {
		log.Debug(fmt.Sprintf("Found project: %s", p))
		t, err := templateToProject(p)
		if err != nil {
			lastError = err
			continue
		}
		if t.ConfDir != "" {
			projects = append(projects, t)
		} else {
			log.Warning(fmt.Sprintf("file: %s,with empty ConfDir", p))
		}
	}
	return projects, lastError
}

// recursiveFindFiles find files with pattern in the root with depth.
func recursiveFindFiles(root string, pattern string) ([]string, error) {
	files := make([]string, 0)
	findfile := func(path string, f os.FileInfo, err error) (inner error) {
		if err != nil {
			return
		}
		if f.IsDir() {
			return
		} else if match, innerr := filepath.Match(pattern, f.Name()); innerr == nil && match {
			files = append(files, path)
		}
		return
	}
	err := filepath.Walk(root, findfile)
	if len(files) == 0 {
		return files, err
	} else {
		return files, err
	}
}
