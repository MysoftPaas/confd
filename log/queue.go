/*
	log to websocket
*/

package log

import (
	"fmt"
	"os"
	"strings"
	"sync"
	"time"
)

type logQueue struct {
	messageQueue chan string
}

var instance *logQueue
var once sync.Once

func (s *logQueue) Set(text string, level string) {

	timestamp := time.Now().Format(time.RFC3339)
	hostname, _ := os.Hostname()
	text = fmt.Sprintf("%s %s %s: %s\n", timestamp, strings.ToUpper(level), hostname, text)

	select {
	case s.messageQueue <- text:
		{
			fmt.Println("set log !!!")
		}
	default:
		{
			fmt.Println("set default log !!!")
		}
	}
}

func (s *logQueue) GetLatest() string {

	return <-s.messageQueue
}

func GetLogQueue() *logQueue {
	once.Do(func() {
		instance = &logQueue{
			messageQueue: make(chan string, 5),
		}
	})
	return instance
}
