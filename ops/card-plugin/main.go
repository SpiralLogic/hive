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
	log.Println(encoded)
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
	data := os.Getenv("PLUGIN_BODY")
	var body interface{}

	json.Unmarshal([]byte(data), &body)

	data2, _ := json.Marshal(body)
	card := drone.CardInput{
		Schema: "https://drone.github.io/drone-gitleaks/card.json",
		Data:   data2,
	}

	writeCard("/dev/stdout", card)

	os.Exit(0)
}
