package waves

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/tidwall/gjson"
)

// GetBalance Получение баланса токена на блокчейне Waves
func GetBalance(address string, assetID string) gjson.Result {
	resp, err := http.Get("https://nodes.wavesnodes.com/assets/balance/" + address + "/" + assetID)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal(err)
	}

	balance := gjson.Get(string(body), "balance")
	return balance
}

// GetWavesBalance Получение баланса WAVES
func GetWavesBalance(address string) gjson.Result {
	resp, err := http.Get("https://nodes.wavesnodes.com/addresses/balance/" + address)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal(err)
	}

	balance := gjson.Get(string(body), "balance")
	return balance
}

// CreateSeed Создание Seed Waves
func CreateSeed() gjson.Result {
	resp, err := http.Get("https://nodes.wavesnodes.com/utils/seed")
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal(err)
	}

	seed := gjson.Get(string(body), "seed")
	return seed
}
