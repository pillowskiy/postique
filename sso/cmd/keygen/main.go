package main

import (
	"crypto/ed25519"
	"encoding/pem"
	"flag"
	"fmt"
	"log"
	"os"
)

func main() {
	publicKey, privateKey, err := ed25519.GenerateKey(nil)
	if err != nil {
		log.Fatal(err)
	}

	pubOut := flag.String("pubout", "public_key.pem", "path to public key output file")
	privOut := flag.String("privout", "private_key.pem", "path to private key output file")
	flag.Parse()

	priv := pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: privateKey})
	err = os.WriteFile(*privOut, priv, 0600)
	if err != nil {
		log.Fatal(err)
	}

	pub := pem.EncodeToMemory(&pem.Block{Type: "PUBLIC KEY", Bytes: publicKey})
	err = os.WriteFile(*pubOut, pub, 0600)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Private and Public keys saved in PEM format.")
}
