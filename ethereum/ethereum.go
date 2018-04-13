package ethereum

import (
	"net/url"

	"../post"
)

/*
	Все взимодействия с блокчейном Ethereum происходят через post request к nodeJS серверу
*/

// VoteForProposal Отправление данных голоса на смарт контракт
func VoteForProposal(prvtKey string, proposalID string, vote string) string {
	postData := url.Values{
		"prvtKey":    {prvtKey},
		"proposalID": {proposalID},
		"vote":       {proposalID},
	}
	data := post.Send("http://51.144.126.35:3000/voteForProposal", postData)
	return data
}

// CreatePrvtKey Создание секретного ключа эфира
func CreatePrvtKey() string {
	postData := url.Values{
		"nil": {},
	}
	prvtKey := post.Send("http://51.144.126.35:3000/createEthAccount", postData)
	return prvtKey
}

// GetAddress Получение адреса эфира по секретному ключу
func GetAddress(prvtKey string) string {
	postData := url.Values{
		"prvtKey": {prvtKey},
	}
	address := post.Send("http://51.144.126.35:3000/getAddress", postData)
	return address
}

// GetBalance Получение баланса эфира по адресу
func GetBalance(address string) string {
	postData := url.Values{
		"address": {address},
	}
	balance := post.Send("http://51.144.126.35:3000/getBalance", postData)
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
	status := post.Send("http://51.144.126.35:3000/sendTx", postData)
	println(status)
	return status
}
