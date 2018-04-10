package post

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
)

// Send Пост запрос с параметрами в тело
func Send(url1 string, data url.Values) string {
	form := data
	body1 := bytes.NewBufferString(form.Encode())
	req, err := http.NewRequest("POST", url1, body1)
	if err != nil {
		log.Fatal(err)
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	return string(body)
}
