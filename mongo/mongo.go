package mongo

import (
	"log"
	"strconv"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Foundations Структура фондов
type Foundations struct {
	ID          bson.ObjectId `bson:"_id,omitempty"`
	Name        string        `bson:"name"`
	FoundedDate int           `bson:"foundedDate"`
	Capital     float32       `bson:"capital"`
	Country     string        `bson:"country"`
	Mission     string        `bson:"mission"`
}

type investInFoundation struct {
	ID               bson.ObjectId `bson:"_id,omitempty"`
	FoundationID     string        `bson:"foundationID"`
	Currency         string        `bson:"currency"`
	InvestInCurrency float64       `bson:"investInCurrency"`
	InvestInRub      float64       `bson:"investInRub"`
}

// Users Структура пользователя
type Users struct {
	ID          bson.ObjectId        `bson:"_id,omitempty"`
	UserID      string               `bson:"userID"`
	Name        string               `bson:"name"`
	EthPrvKey   string               `bson:"ethPrvKey"`
	EthAddress  string               `bson:"ethAddress"`
	Foundations []investInFoundation `bson:"foundations"`
}

// Votes Структура голосования
type Votes struct {
	ID            bson.ObjectId `bson:"_id,omitempty"`
	FoundationsID bson.ObjectId `bson:"foundationsID"`
	Description   string        `bson:"description"`
	StartTime     string        `bson:"startTime"`
	EndTime       string        `bson:"endTime"`
	End           bool          `bson:"end"`
}

// Voters Структура голосующих
type Voters struct {
	ID      bson.ObjectId `bson:"_id,omitempty"`
	VotesID bson.ObjectId `bson:"votesID"`
	Vote    bool          `bson:"vote"`
	Time    string        `bson:"startTime"`
}

// ConnectToMongo mongo connection
func ConnectToMongo() *mgo.Session {
	session, err := mgo.Dial("mongodb://erage:doBH8993nnjdoBH8993nnj@51.144.89.99:27017")
	if err != nil {
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)

	return session
}

// CloseMongoConnection mongo close connection
func CloseMongoConnection(session *mgo.Session) {
	session.Close()
}

// AddFoundation Добавление фонда
func AddFoundation(openSession *mgo.Session, name string, foundedDate int, capital float32, country string, mission string) {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("foundations")
	err := c.Insert(&Foundations{Name: name, FoundedDate: foundedDate, Capital: capital, Country: country, Mission: mission})

	if err != nil {
		// log.Fatal(err)
	}
}

// AddUser Добавление пользователя
func AddUser(openSession *mgo.Session, userID string, name string, ethPrvKey string, ethAddress string) {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("users")

	err := c.Insert(&Users{UserID: userID, Name: name, EthPrvKey: ethPrvKey, EthAddress: ethAddress})

	if err != nil {
		// log.Fatal(err)
	}
}

// CreateVote Создание голосования
func CreateVote(openSession *mgo.Session, foundationsID string, description string, endDate string) {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("votes")

	currentTimeUts := strconv.Itoa(int(time.Now().Unix()))

	endTime, _ := strconv.Atoi(endDate)
	endTimeString := strconv.Itoa(int(time.Now().Unix() + int64(endTime)))

	err := c.Insert(&Votes{FoundationsID: bson.ObjectIdHex(foundationsID), Description: description, StartTime: currentTimeUts, EndTime: endTimeString, End: false})

	if err != nil {
		log.Fatal(err)
	}
}

// AddVoter Добавление голоса
func AddVoter(openSession *mgo.Session, votesID string, vote bool, endDate string) {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("voters")

	currenctTimeInUTS := time.Now().Unix()
	currenctTimeInUtsString := strconv.Itoa(int(currenctTimeInUTS))

	err := c.Insert(&Voters{VotesID: bson.ObjectIdHex(votesID), Vote: vote, Time: currenctTimeInUtsString})

	if err != nil {
		// log.Fatal(err)
	}
}

// AddFoundationToUser Добавление благотворительной организации в БД
func AddFoundationToUser(openSession *mgo.Session, userID string, foundationID string, currency string, investInCurrency float64, investSumRub float64) {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("foundations")
	results := Users{}
	c.Find(bson.M{"UserID": userID}).One(&results)

	// Массив с фондами человека
	arr1 := results.Foundations

	// Новая структура для добавленного фонда
	arr3 := investInFoundation{FoundationID: foundationID, Currency: currency, InvestInCurrency: investInCurrency, InvestInRub: investSumRub}

	// Добавление структуры для фонда
	arr2 := append(arr1, arr3)

	err := c.Update(bson.M{"UserID": userID}, bson.M{"$set": bson.M{"foundations": arr2}})

	if err != nil {
		// log.Fatal(err)
	}
}

// FindAllFoundations Поиск всех фондов
func FindAllFoundations(openSession *mgo.Session) []Foundations {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("foundations")

	var results []Foundations
	err := c.Find(bson.M{}).All(&results)

	if err != nil {
		// log.Fatal(err)
	}

	return results
}

// FindFoundationByName Поиск всех фондов
func FindFoundationByName(openSession *mgo.Session, foundationName string) Foundations {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("foundations")

	var results Foundations
	err := c.Find(bson.M{"name": foundationName}).One(&results)

	if err != nil {
		// log.Fatal(err)
	}

	return results
}

// FindFoundationByID Поиск всех фондов
func FindFoundationByID(openSession *mgo.Session, foundationID string) Foundations {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("foundations")

	var results Foundations
	err := c.Find(bson.M{"_id": foundationID}).One(&results)

	if err != nil {
		// log.Fatal(err)
	}

	return results
}

// FindAllUsers Поиск всех users
func FindAllUsers(openSession *mgo.Session) []Users {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("users")

	var results []Users
	err := c.Find(bson.M{}).All(&results)

	if err != nil {
		// log.Fatal(err)
	}

	return results
}

// FindUser Поиск конкретного пользователя
func FindUser(openSession *mgo.Session, userid string) Users {
	session := openSession.Copy()
	defer CloseMongoConnection(session)

	c := session.DB("ImCup").C("users")

	var results Users
	err := c.Find(bson.M{"userID": userid}).One(&results)

	if err != nil {
		// log.Fatal(err)
	}

	return results
}
