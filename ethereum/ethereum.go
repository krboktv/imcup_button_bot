package ethereum

import (
	"net/url"

	"../post"
)

/*
	Все взимодействия с блокчейном Ethereum происходят через post request к nodeJS серверу
*/

// CreatePrvtKey Создание секретного ключа эфира
func CreatePrvtKey() string {
	postData := url.Values{
		"nil": {},
	}
	prvtKey := post.Send("http://localhost:3000/createEthAccount", postData)
	return prvtKey
}

// GetAddress Получение адреса эфира по секретному ключу
func GetAddress(prvtKey string) string {
	postData := url.Values{
		"prvtKey": {prvtKey},
	}
	address := post.Send("http://localhost:3000/getAddress", postData)
	return address
}

// GetBalance Получение баланса эфира по адресу
func GetBalance(address string) string {
	postData := url.Values{
		"address": {address},
	}
	balance := post.Send("http://localhost:3000/getBalance", postData)
	return balance
}

// SendTransaction Отправка транзакций в блокчейн эфира
func SendTransaction(prvtKey string, sender string, receiver string, amount string) string {
	postData := url.Values{
		"prvtKey":  {prvtKey},
		"sender":   {sender},
		"receiver": {receiver},
		"amount":   {amount},
	}
	status := post.Send("http://localhost:3000/sendTx", postData)
	println(status)
	return status
}
