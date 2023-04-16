package main

import (
	"encoding/base64"
	"encoding/json"
	"github.com/drone/drone-go/drone"
	"io"
	"log"
	"os"
)

func writeCardTo(out io.Writer, data []byte) {
	encoded := base64.StdEncoding.EncodeToString(data)

	io.WriteString(out, "\u001B]1338;")
	io.WriteString(out, encoded)
	io.WriteString(out, "\u001B]0m")
	io.WriteString(out, "\n")
}

func writeCard(path string, card interface{}) {
	data, _ := json.Marshal(card)

	switch {
	case path == "/dev/stdout":
		writeCardTo(os.Stdout, data)
	case path == "/dev/stderr":
		writeCardTo(os.Stderr, data)
	case path != "":
		os.WriteFile(path, data, 0644)
	}
}

func main() {
	jsonData, _ := os.ReadFile(os.Args[1])

	card := drone.CardInput{
		Schema: "https://raw.githubusercontent.com/SpiralLogic/hive/master/ops/adaptive-card/build-widget.json",
		Data:   jsonData,
	}
	log.Println(&card)

	writeCard("/dev/stdout", &card)

	os.Exit(0)
}
