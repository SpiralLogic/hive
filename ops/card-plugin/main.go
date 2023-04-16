package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
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
	jsonData := os.Getenv("PLUGIN_BODY")
	var data json.RawMessage

	err := json.Unmarshal([]byte(jsonData), &data)

	if err != nil {
		fmt.Printf("could not unmarshal json: %s\n", err)
		return
	}

	card := drone.CardInput{
		Schema: "https://raw.githubusercontent.com/SpiralLogic/hive/master/ops/adaptive-card/build-widget.json",
		Data:   data,
	}
	log.Println(&card)

	writeCard("/dev/stdout", &card)

	os.Exit(0)
}
