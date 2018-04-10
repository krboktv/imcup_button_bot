package objects

type currency struct {
	name    string
	ticker  string
	assetID string
}

// Waves Объект криптовалюты Waves
var Waves = currency{name: "Waves", ticker: "WAVES", assetID: "WAVES"}

// Bitcoin Объект токена Bitcoin
var Bitcoin = currency{name: "Bitcoin", ticker: "BTC", assetID: "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"}

// Ethereum Объект токена Ethereum
var Ethereum = currency{name: "Ethereum", ticker: "ETH", assetID: "474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu"}

// Litecoin Объект токена Litecoin
var Litecoin = currency{name: "Litecoin", ticker: "LTC", assetID: "HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk"}

// ZCash Объект токена ZCash
var ZCash = currency{name: "ZCash", ticker: "ZEC", assetID: "BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa"}

// UsDollar Объект токена USD
var UsDollar = currency{name: "US Dollar", ticker: "USD", assetID: "Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck"}

// Euro Объект токена Euro
var Euro = currency{name: "Euro", ticker: "EUR", assetID: "Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU"}

// GetName Получение названия валюты
func GetName(e currency) string {
	return e.name
}

// GetTicker Получение тикера валюты
func GetTicker(e currency) string {
	return e.ticker
}

// GetAssetID Получение assetID валюты
func GetAssetID(e currency) string {
	return e.assetID
}
