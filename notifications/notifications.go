package notification

import (
	"net/url"

	"../post"
)

// Send Отправить уведомление
func Send(userID string, text string) {
	postData := url.Values{
		"userID": {userID},
		"text":   {text},
	}
	post.Send("http://localhost:3000/sendNot", postData)
}
