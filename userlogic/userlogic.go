package userlogic

import (
	"fmt"

	"../mongo"
	"gopkg.in/mgo.v2"
)

// Auth Проверка на наличие пользователя в БД
func Auth(session *mgo.Session, userID string) bool {
	user := mongo.FindUser(session, userID)
	fmt.Print(user)
	if user.UserID != "" {
		return true
	} else {
		return false
	}
}

// Register Регистрация в БД
func Register(session *mgo.Session, userID string, userName string, ethPrvtkey string, ethAddress string) {

	mongo.AddUser(session, userID, userName, ethPrvtkey, ethAddress)
}
