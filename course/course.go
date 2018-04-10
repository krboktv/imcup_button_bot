package course

import (
	"io/ioutil"
	"log"
	"net/http"
)

// Course Эта функция получает курс в RUB или USD через get запрос
func Course(outputCurrency string) []byte {
	resp, err := http.Get("https://min-api.cryptocompare.com/data/price?fsym=" + outputCurrency + "&tsyms=WAVES,BTC,ETH,ZEC,LTC,USD,EUR")
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

	return body
}
