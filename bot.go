package main

import (
	"fmt"
	"log"
	"math"
	"strconv"
	"time"

	"gopkg.in/mgo.v2/bson"

	"gopkg.in/mgo.v2"

	"./course"
	"./ethereum"
	"./mongo"
	"./orglist"
	"./userlogic"
	"github.com/tidwall/gjson"
	tb "gopkg.in/tucnak/telebot.v2"
)

// для диалогов переменные
var fond = ""
var sum = ""
var concurrency = ""
var rubsum = ""

var courseJSON []byte
var courseResult gjson.Result

var wavesBalanceResult gjson.Result
var currencyBalanceResult gjson.Result

var session *mgo.Session

// Функция, котрая посылает данные в смарт контракт
func vote(prvtKey string, proposalID string, vote string) string {
	data := ethereum.VoteForProposal(prvtKey, proposalID, vote)
	msg := ""
	if data != "false" {
		if vote == "true" {
			msg += "Вы проголосовали *За*, ваш голос учтен!\n\n"
		} else {
			msg += "Вы проголосовали *Против*, ваш голос учтен!\n\n"
		}

		msg += "Вы можете *посмотреть вашу транзакцию* по адресу: " + data
		return msg
	} else {
		msg += "Не удалось проголосвать. Возможно, у вас недостаточно средств для голоса."
		return msg
	}
}

func main() {
	b, err := tb.NewBot(tb.Settings{
		// Token: "576497547:AAFqeiPb5j5fVktRPqtzpTvaIp8ExKlZZAY", //продакшн @bf_charity_bot
		// Token: "525513661:AAEdYAbizNP8SiT2fhjweHRZULFL84KsUYk", //Никита @botGoTestBot.
		Token:  "539909670:AAFk7Lxz73lTbtfjf8xIReCwSoEZZpjAlqI", //Кирилл @kirillBotGo_bot
		Poller: &tb.LongPoller{Timeout: 10 * time.Second},
	})

	session = mongo.ConnectToMongo()
	foundation := mongo.FindFoundationByID(session, bson.ObjectIdHex("5abfaa468173e1b2e81fb2b2"))
	voteByFoundation, isTrue := mongo.FindVoteByFoundationID(session, foundation.ID)
	fmt.Print(isTrue)
	users := mongo.FindAllVotersAddrByVoteID(session, voteByFoundation.ID)
	var usersID string
	for key := range users {
		user := mongo.FindUserByID(session, users[key].UserID)
		usersID += user.UserID
		if key != len(users)-1 {
			usersID += ","
		} else {

		}
	}
	// fmt.Print(usersID)
	var foundationID = bson.ObjectId(foundation.ID).Hex()
	fmt.Print(foundationID)

	// Создать голосвание для организации
	// mongo.CreateVoteAndSendNot(session, usersID, "0x6D377De54Bde59c6a4B0fa15Cb2EFB84BB32D433", foundation.Name, "200000", "1", foundationID, foundation.Mission, "Купить детям билеты в театр", "1524959999")

	replyBtn1 := tb.ReplyButton{Text: "💳 Мой кабинет"}
	replyBtn2 := tb.ReplyButton{Text: "💸 Список благотворительных организаций"}
	replyKeys := [][]tb.ReplyButton{
		[]tb.ReplyButton{replyBtn1},
		[]tb.ReplyButton{replyBtn2},
	}
	inlineBtn0 := tb.InlineButton{Unique: "0", Text: "0️⃣"}
	inlineBtn1 := tb.InlineButton{Unique: "1", Text: "1️⃣"}
	inlineBtn2 := tb.InlineButton{Unique: "2", Text: "2️⃣"}
	inlineBtn3 := tb.InlineButton{Unique: "3", Text: "3️⃣"}
	inlineBtn4 := tb.InlineButton{Unique: "4", Text: "4️⃣"}
	inlineBtn5 := tb.InlineButton{Unique: "5", Text: "5️⃣"}
	inlineBtn6 := tb.InlineButton{Unique: "6", Text: "6️⃣"}
	// inlineBtn7 := tb.InlineButton{Unique: "7", Text: "7️⃣"}
	// inlineBtn8 := tb.InlineButton{Unique: "8", Text: "8️⃣"}

	inlineKbrdCalc := [][]tb.InlineButton{
		{inlineBtn0, inlineBtn1, inlineBtn2, inlineBtn3, inlineBtn4, inlineBtn5, inlineBtn6},
	}

	inlineInv := tb.InlineButton{Unique: "inv", Text: "Перевести"}
	inlineInvMenu := [][]tb.InlineButton{
		{inlineInv},
	}
	// NT
	// var inlineYes []tb.InlineButton
	// var inlineNo []tb.InlineButton
	// for i := 0; i < 25; i++ {
	// 	fmt.Print(`
	// 	b.Handle(&voteButtonYes` + strconv.Itoa(i) + `, func(c *tb.Callback) {
	//
	// 		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
	// 		b.Respond(c, &tb.CallbackResponse{})
	// 	})
	// 	b.Handle(&voteButtonNo` + strconv.Itoa(i) + `, func(c *tb.Callback) {
	//
	// 		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
	// 		b.Respond(c, &tb.CallbackResponse{})
	// 	})
	// 	`)
	// }

	// var inlineKbrdyesno [][]tb.InlineButton
	// NT
	inlineklav0 := tb.InlineButton{Unique: "klav0", Text: "0️⃣"}
	inlineklav1 := tb.InlineButton{Unique: "klav1", Text: "1️⃣"}
	inlineklav2 := tb.InlineButton{Unique: "klav2", Text: "2️⃣"}
	inlineklav3 := tb.InlineButton{Unique: "klav3", Text: "3️⃣"}
	inlineklav4 := tb.InlineButton{Unique: "klav4", Text: "4️⃣"}
	inlineklav5 := tb.InlineButton{Unique: "klav5", Text: "5️⃣"}
	inlineklav6 := tb.InlineButton{Unique: "klav6", Text: "6️⃣"}
	inlineklav7 := tb.InlineButton{Unique: "klav7", Text: "7️⃣"}
	inlineklav8 := tb.InlineButton{Unique: "klav8", Text: "8️⃣"}
	inlineklav9 := tb.InlineButton{Unique: "klav9", Text: "9️⃣"}
	inlineklavdot := tb.InlineButton{Unique: "klavdot", Text: " . "}
	inlineklavapply := tb.InlineButton{Unique: "enter", Text: "✅ Подтвердить"}
	inlineklavrenew := tb.InlineButton{Unique: "renew", Text: "🆕 Заново"}
	inlineklavback := tb.InlineButton{Unique: "remove", Text: "❌ Назад"}
	inlineklavdellast := tb.InlineButton{Unique: "last", Text: "⬅️"}
	inlineKbrdsum := [][]tb.InlineButton{
		{inlineklav1, inlineklav2, inlineklav3}, {inlineklav4, inlineklav5, inlineklav6},
		{inlineklav7, inlineklav8, inlineklav9}, {inlineklavdot, inlineklav0, inlineklavdellast},
		{inlineklavrenew, inlineklavback}, {inlineklavapply},
	}

	// Кнопки для голосваний
	voteButtonYes0 := tb.InlineButton{Unique: "yes0", Text: "✅ Да, я за"}
	voteButtonNo0 := tb.InlineButton{Unique: "no0", Text: "❌ Нет, я против"}

	voteButtonYes1 := tb.InlineButton{Unique: "yes1", Text: "✅ Да, я за"}
	voteButtonNo1 := tb.InlineButton{Unique: "no1", Text: "❌ Нет, я против"}

	voteButtonYes2 := tb.InlineButton{Unique: "yes2", Text: "✅ Да, я за"}
	voteButtonNo2 := tb.InlineButton{Unique: "no2", Text: "❌ Нет, я против"}

	voteButtonYes3 := tb.InlineButton{Unique: "yes3", Text: "✅ Да, я за"}
	voteButtonNo3 := tb.InlineButton{Unique: "no3", Text: "❌ Нет, я против"}

	voteButtonYes4 := tb.InlineButton{Unique: "yes4", Text: "✅ Да, я за"}
	voteButtonNo4 := tb.InlineButton{Unique: "no4", Text: "❌ Нет, я против"}

	voteButtonYes5 := tb.InlineButton{Unique: "yes5", Text: "✅ Да, я за"}
	voteButtonNo5 := tb.InlineButton{Unique: "no5", Text: "❌ Нет, я против"}

	voteButtonYes6 := tb.InlineButton{Unique: "yes6", Text: "✅ Да, я за"}
	voteButtonNo6 := tb.InlineButton{Unique: "no6", Text: "❌ Нет, я против"}

	voteButtonYes7 := tb.InlineButton{Unique: "yes7", Text: "✅ Да, я за"}
	voteButtonNo7 := tb.InlineButton{Unique: "no7", Text: "❌ Нет, я против"}

	voteButtonYes8 := tb.InlineButton{Unique: "yes8", Text: "✅ Да, я за"}
	voteButtonNo8 := tb.InlineButton{Unique: "no8", Text: "❌ Нет, я против"}

	voteButtonYes9 := tb.InlineButton{Unique: "yes9", Text: "✅ Да, я за"}
	voteButtonNo9 := tb.InlineButton{Unique: "no9", Text: "❌ Нет, я против"}

	voteButtonYes10 := tb.InlineButton{Unique: "yes10", Text: "✅ Да, я за"}
	voteButtonNo10 := tb.InlineButton{Unique: "no10", Text: "❌ Нет, я против"}

	voteButtonYes11 := tb.InlineButton{Unique: "yes11", Text: "✅ Да, я за"}
	voteButtonNo11 := tb.InlineButton{Unique: "no11", Text: "❌ Нет, я против"}

	voteButtonYes12 := tb.InlineButton{Unique: "yes12", Text: "✅ Да, я за"}
	voteButtonNo12 := tb.InlineButton{Unique: "no12", Text: "❌ Нет, я против"}

	voteButtonYes13 := tb.InlineButton{Unique: "yes13", Text: "✅ Да, я за"}
	voteButtonNo13 := tb.InlineButton{Unique: "no13", Text: "❌ Нет, я против"}

	voteButtonYes14 := tb.InlineButton{Unique: "yes14", Text: "✅ Да, я за"}
	voteButtonNo14 := tb.InlineButton{Unique: "no14", Text: "❌ Нет, я против"}

	voteButtonYes15 := tb.InlineButton{Unique: "yes15", Text: "✅ Да, я за"}
	voteButtonNo15 := tb.InlineButton{Unique: "no15", Text: "❌ Нет, я против"}

	voteButtonYes16 := tb.InlineButton{Unique: "yes16", Text: "✅ Да, я за"}
	voteButtonNo16 := tb.InlineButton{Unique: "no16", Text: "❌ Нет, я против"}

	voteButtonYes17 := tb.InlineButton{Unique: "yes17", Text: "✅ Да, я за"}
	voteButtonNo17 := tb.InlineButton{Unique: "no17", Text: "❌ Нет, я против"}

	voteButtonYes18 := tb.InlineButton{Unique: "yes18", Text: "✅ Да, я за"}
	voteButtonNo18 := tb.InlineButton{Unique: "no18", Text: "❌ Нет, я против"}

	voteButtonYes19 := tb.InlineButton{Unique: "yes19", Text: "✅ Да, я за"}
	voteButtonNo19 := tb.InlineButton{Unique: "no19", Text: "❌ Нет, я против"}

	voteButtonYes20 := tb.InlineButton{Unique: "yes20", Text: "✅ Да, я за"}
	voteButtonNo20 := tb.InlineButton{Unique: "no20", Text: "❌ Нет, я против"}

	voteButtonYes21 := tb.InlineButton{Unique: "yes21", Text: "✅ Да, я за"}
	voteButtonNo21 := tb.InlineButton{Unique: "no21", Text: "❌ Нет, я против"}

	voteButtonYes22 := tb.InlineButton{Unique: "yes22", Text: "✅ Да, я за"}
	voteButtonNo22 := tb.InlineButton{Unique: "no22", Text: "❌ Нет, я против"}

	voteButtonYes23 := tb.InlineButton{Unique: "yes23", Text: "✅ Да, я за"}
	voteButtonNo23 := tb.InlineButton{Unique: "no23", Text: "❌ Нет, я против"}

	voteButtonYes24 := tb.InlineButton{Unique: "yes24", Text: "✅ Да, я за"}
	voteButtonNo24 := tb.InlineButton{Unique: "no24", Text: "❌ Нет, я против"}

	buttonYesNoArr := [][][]tb.InlineButton{
		[][]tb.InlineButton{
			{voteButtonYes0, voteButtonNo0},
		},

		[][]tb.InlineButton{
			{voteButtonYes1, voteButtonNo1},
		},

		[][]tb.InlineButton{
			{voteButtonYes2, voteButtonNo2},
		},

		[][]tb.InlineButton{
			{voteButtonYes3, voteButtonNo3},
		},

		[][]tb.InlineButton{
			{voteButtonYes4, voteButtonNo4},
		},

		[][]tb.InlineButton{
			{voteButtonYes5, voteButtonNo5},
		},

		[][]tb.InlineButton{
			{voteButtonYes6, voteButtonNo6},
		},

		[][]tb.InlineButton{
			{voteButtonYes7, voteButtonNo7},
		},

		[][]tb.InlineButton{
			{voteButtonYes8, voteButtonNo8},
		},

		[][]tb.InlineButton{
			{voteButtonYes9, voteButtonNo9},
		},

		[][]tb.InlineButton{
			{voteButtonYes10, voteButtonNo10},
		},

		[][]tb.InlineButton{
			{voteButtonYes11, voteButtonNo11},
		},

		[][]tb.InlineButton{
			{voteButtonYes12, voteButtonNo12},
		},

		[][]tb.InlineButton{
			{voteButtonYes13, voteButtonNo13},
		},

		[][]tb.InlineButton{
			{voteButtonYes14, voteButtonNo14},
		},

		[][]tb.InlineButton{
			{voteButtonYes15, voteButtonNo15},
		},

		[][]tb.InlineButton{
			{voteButtonYes16, voteButtonNo16},
		},

		[][]tb.InlineButton{
			{voteButtonYes17, voteButtonNo17},
		},

		[][]tb.InlineButton{
			{voteButtonYes18, voteButtonNo18},
		},

		[][]tb.InlineButton{
			{voteButtonYes19, voteButtonNo19},
		},

		[][]tb.InlineButton{
			{voteButtonYes20, voteButtonNo20},
		},

		[][]tb.InlineButton{
			{voteButtonYes21, voteButtonNo21},
		},

		[][]tb.InlineButton{
			{voteButtonYes22, voteButtonNo22},
		},

		[][]tb.InlineButton{
			{voteButtonYes23, voteButtonNo23},
		},

		[][]tb.InlineButton{
			{voteButtonYes24, voteButtonNo24},
		},
	}
	// for i := 0; i < 25; i++ {
	// 	fmt.Print(`
	// voteButtonYes` + strconv.Itoa(i) + ` := tb.InlineButton{Unique: "yes` + strconv.Itoa(i) + `", Text: "✅ Да, я за"}
	// voteButtonNo` + strconv.Itoa(i) + ` := tb.InlineButton{Unique: "no` + strconv.Itoa(i) + `", Text: "❌ Нет, я против"}
	// inlineKbrdYesNo` + strconv.Itoa(i) + ` := [][]tb.InlineButton{
	// 	{voteButtonYes` + strconv.Itoa(i) + `, voteButtonNo` + strconv.Itoa(i) + `},
	// }
	// `)
	// }

	inlinуvapply := tb.InlineButton{Unique: "apply", Text: "✅ Подтвердить"}
	inlineKbrdaply := [][]tb.InlineButton{{inlinуvapply}}

	// inlineBtnWAV := tb.InlineButton{Unique: "WAVES", Text: "📈 WAVES"}
	// inlineBtnBTC := tb.InlineButton{Unique: "BTC", Text: "📈 BTC"}
	inlineBtnETH := tb.InlineButton{Unique: "ETH", Text: "📈 ETH"}
	// inlineBtnLTC := tb.InlineButton{Unique: "LTC", Text: "📈 LTC"}
	inlineCurrency := [][]tb.InlineButton{{inlineBtnETH}}

	inlineData := tb.InlineButton{Unique: "Data", Text: "🔐 Аккаунт"}
	inlineList := tb.InlineButton{Unique: "List", Text: "🎈 Список организаций"}
	inlineVote := tb.InlineButton{Unique: "curvote", Text: "〽️ Текущие голосования"}

	inlineCurrencys := [][]tb.InlineButton{
		{inlineData}, {inlineList}, {inlineVote},
	}

	if err != nil {
		log.Fatal(err)
		return
	}

	b.Handle("/start", func(m *tb.Message) {

		/// ТУТ УВЕДОМЛЕНИЕ NT
		// var orgname = ""
		// var orgsum = ""
		// var orgmsg = ""
		// var msgorg = "Организация "
		// msgorg += orgname + " "
		// msgorg += " хочет потратить "
		// msgorg += orgsum + " на "
		// msgorg += orgmsg
		// msgorg
		// inlineKbrdCalc вот это меню

		// b.Handle(&inlineYes, func(c *tb.Callback) {
		// 	var msg = "Вы проголосовали За, ваш голос учтен!"
		// 	b.Edit(c.Message, , &tb.SendOptions{ParseMode: "Markdown"})
		// 	b.Respond(c, &tb.CallbackResponse{})
		// })
		// b.Handle(&inlineNo, func(c *tb.Callback) {
		//
		// 	b.Edit(c.Message, , &tb.SendOptions{ParseMode: "Markdown"})
		// 	b.Respond(c, &tb.CallbackResponse{})
		// })

		/// ТУТ УВЕДОМЛЕНИЕ NT

		if !m.Private() {
			return
		}
		// logs
		var userID = strconv.Itoa(m.Sender.ID)
		var name = string(m.Sender.Username)
		var prvtKeyETH = ethereum.CreatePrvtKey()
		var addressETH = ethereum.GetAddress(prvtKeyETH)
		// println()
		// println(name)
		// println(prvtKeyETH)
		// println(addressETH)
		// println(userlogic.Auth(userID))
		if userlogic.Auth(session, userID) != true {
			userlogic.Register(session, userID, name, prvtKeyETH, addressETH)
			var msg = "Вы зарегистрированы в системе!\n\n"
			msg += "Ваш *Private Key:* "
			msg += prvtKeyETH
			msg += "\n\n"
			msg += "Ваш *Address:* "
			msg += addressETH
			b.Send(m.Sender, msg, &tb.SendOptions{DisableWebPagePreview: true, ParseMode: "Markdown"})
		}
		// len := len(mongo.FindUser(userID))
		// if len != 0 {
		// } else {
		// 	mongo.AddUser(userID, name, prvtKeyETH, addressETH)
		// }
		// println(len)
		// println("))))")
		// println(m.Sender.ID)
		// logs
		var text = "*Главное меню*\n\nB *Charity* - стандарт участия в благотворительности.\n\n"
		text += "*1.* Выбираешь благотворительную организацию\n"
		text += "*2.* Инвестируешь в конкретный  реальный проект\n"
		text += "*3.* Принимаешь участие в контроле проекта\n"
		text += "\n*Приемущества*\n\n"
		text += "*1.* *Прямой* и *безопасный* перевод в организацию без посредников\n"
		text += "*2.* *Контроль расходов* благотворительной организации\n"
		text += "*3.* Возможность *активного участия* и социальная ответственность\n"
		b.Send(m.Sender, text, &tb.SendOptions{DisableWebPagePreview: true, ParseMode: "Markdown"}, &tb.ReplyMarkup{ReplyKeyboard: replyKeys})
	})
	// тут переход в список фондов с пожертвованиями
	b.Handle(&replyBtn2, func(m *tb.Message) {
		b.Send(m.Sender, orglist.GetFoundations(session)[0], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
	})
	b.Handle(&replyBtn1, func(m *tb.Message) {
		user := mongo.FindUser(session, strconv.Itoa(m.Sender.ID))
		var eth = ethereum.GetBalance(user.EthAddress)
		//0x7fb5f775c04b42bdc7506404272a3845d6d2e6c0be1671b24bc242f9ea43912a
		println("Баланс в Ethereum: " + eth)
		ethufufuuufuuf, err := strconv.ParseFloat(eth, 64)
		if err != nil {
			println(eth)
		}
		var ethreal = ethufufuuufuuf
		println("Преобразованный в Float: " + strconv.FormatFloat(ethreal, 'g', 8, 64))
		var thefuckingrealeth = strconv.FormatFloat(ethreal, 'g', 8, 64)
		var torub = course.Course("RUB")
		println("1 ETH: " + strconv.FormatFloat(1.0/(gjson.Get(string(torub), "ETH").Float())*ethreal, 'g', 8, 64))
		var torub3 = (1.0 / (gjson.Get(string(torub), "ETH").Float())) * ethreal
		var ethrub = strconv.FormatFloat(torub3, 'g', 8, 64)
		var msg = "*Личный кабинет* \n\n*Баланс по валютам:*" + "\n\n`ETH:` " + thefuckingrealeth + " (" + ethrub + " RUB)"
		b.Send(m.Sender, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineCurrencys})
	})

	// тут переход в список фондов с пожертвованиями

	// Чекаем в кабинете листы и другое
	b.Handle(&inlineData, func(c *tb.Callback) {
		user := mongo.FindUser(session, strconv.Itoa(c.Sender.ID))
		var address = (user.EthAddress)
		var key = (user.EthPrvKey)
		var msg1 = "Мой *адрес* ETH: " + address + "\n\nМой *Private key* " + key
		b.Send(c.Sender, msg1, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineList, func(c *tb.Callback) {
		// user := mongo.FindUser()
		var msg = ""
		user := mongo.FindUser(session, strconv.Itoa(c.Sender.ID))
		len := len(user.Foundations)
		//

		//
		if len == 0 {
			msg += "Вы еще не пожертвовали в какую-лбо организацию, вы можете сделать это сейчас"
			b.Send(c.Sender, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		} else {
			msg += "Список организаций, в которые вы пожертвовали: \n"
			for index := range user.Foundations {
				// fmt.Print(user.Foundations[index].ID)
				fond := mongo.FindFoundationByID(session, user.Foundations[index].FoundationID)
				msg += "*" + fond.Name + "*" + ". Сумма пожертвования " + strconv.FormatFloat(user.Foundations[index].InvestInCurrency, 'g', 8, 64) + " ETH.\n\n"
			}

			b.Send(c.Sender, msg, &tb.SendOptions{ParseMode: "Markdown"})
		}

		b.Respond(c, &tb.CallbackResponse{})
	})
	var voteID []bson.ObjectId
	var userID bson.ObjectId
	b.Handle(&inlineVote, func(c *tb.Callback) {
		var msg = ""
		user := mongo.FindUser(session, strconv.Itoa(c.Sender.ID))
		userID = user.ID
		var usersFoundations []bson.ObjectId
		var isPovtoriajetsia bool
		if len(user.Foundations) != 0 {
			for key := range user.Foundations {
				for b := range usersFoundations {
					if usersFoundations[b] == user.Foundations[key].FoundationID {
						isPovtoriajetsia = true
					}
				}

				if isPovtoriajetsia == true {
					continue
				}
				usersFoundations = append(usersFoundations, user.Foundations[key].FoundationID)
				fond := mongo.FindFoundationByID(session, (user.Foundations[key].FoundationID))

				fondsVotes := mongo.FindVotesByFoundationID(session, user.Foundations[key].FoundationID)

				for i := range fondsVotes {
					currentTimeUts := int(time.Now().Unix())
					endTimeUts, _ := strconv.Atoi(fondsVotes[i].EndTime)

					isVote := mongo.IsVote(session, fondsVotes[i].ID, userID)
					fmt.Print(isVote)
					// Если голосвание не закончено
					if currentTimeUts <= endTimeUts == true {

						// Если пользователь ещё не головал
						if isVote {
							voteID = append(voteID, fondsVotes[i].ID)
							var msg1 = ""
							msg1 += "Организация: "
							msg1 += "*" + fond.Name + "*\n"
							msg1 += "\n*" + fondsVotes[i].Description + "*\n"
							msg1 += "\nКак вы относитесь к этому решению?"
							msg1 += " "
							b.Send(c.Sender, msg1, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: buttonYesNoArr[key]})
							b.Respond(c, &tb.CallbackResponse{})
						} else {

							msg2 := "Вы уже принял участие в голосовании  "
							msg2 += "*" + fond.Name + "*. Ожидайте *результаты*\n"
							b.Send(c.Sender, msg2, &tb.SendOptions{ParseMode: "Markdown"})
						}

					} else {
						msg += "Активных голсоований больше не найдено"
						b.Send(c.Sender, msg, &tb.SendOptions{ParseMode: "Markdown"})
					}
				}
			}
		} else {
			msg += "Вы ещё не пожертвовали ETH какой-либо организации"
			b.Send(c.Sender, msg, &tb.SendOptions{ParseMode: "Markdown"})
		}
	})

	// Чекаем в кабинете листы и другое

	// inline buttons 1-9 Инфа о фондах

	b.Handle(&inlineBtn0, func(c *tb.Callback) {
		b.Edit(c.Message, orglist.GetFoundations(session)[0], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineBtn1, func(c *tb.Callback) {
		b.Edit(c.Message, orglist.GetFoundations(session)[1], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineBtn2, func(c *tb.Callback) {
		b.Edit(c.Message, orglist.GetFoundations(session)[2], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineBtn3, func(c *tb.Callback) {
		b.Edit(c.Message, orglist.GetFoundations(session)[3], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineBtn4, func(c *tb.Callback) {
		b.Edit(c.Message, orglist.GetFoundations(session)[4], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineBtn5, func(c *tb.Callback) {
		b.Edit(c.Message, orglist.GetFoundations(session)[5], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineBtn6, func(c *tb.Callback) {
		b.Edit(c.Message, orglist.GetFoundations(session)[6], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
		b.Respond(c, &tb.CallbackResponse{})
	})
	// b.Handle(&inlineBtn7, func(c *tb.Callback) {
	// 	b.Edit(c.Message, orglist.Data7, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
	// 	b.Respond(c, &tb.CallbackResponse{})
	// })
	// b.Handle(&inlineBtn8, func(c *tb.Callback) {
	// 	b.Edit(c.Message, orglist.Data8, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdCalc})
	// 	b.Respond(c, &tb.CallbackResponse{})
	// })

	// inline buttons 1-6

	// слушает какой фонд выбрал
	b.Handle("/fond0", func(m *tb.Message) {
		allFonds := mongo.FindAllFoundations(session)
		fond = allFonds[0].Name
		// fond = "Bill & Melinda Gates Foundation"
		b.Send(m.Sender, orglist.GetAllInfoAbtFoundations(session)[0], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineInvMenu})
	})
	b.Handle("/fond1", func(m *tb.Message) {
		allFonds := mongo.FindAllFoundations(session)
		fond = allFonds[1].Name
		// fond = "Подари Жизнь"
		b.Send(m.Sender, orglist.GetAllInfoAbtFoundations(session)[1], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineInvMenu})
	})
	b.Handle("/fond2", func(m *tb.Message) {
		// fond = "Welcome Trust"
		allFonds := mongo.FindAllFoundations(session)
		fond = allFonds[2].Name
		b.Send(m.Sender, orglist.GetAllInfoAbtFoundations(session)[2], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineInvMenu})
	})
	b.Handle("/fond3", func(m *tb.Message) {
		// fond = "Ford Foundation"
		allFonds := mongo.FindAllFoundations(session)
		fond = allFonds[3].Name
		b.Send(m.Sender, orglist.GetAllInfoAbtFoundations(session)[3], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineInvMenu})
	})
	b.Handle("/fond4", func(m *tb.Message) {
		allFonds := mongo.FindAllFoundations(session)
		fond = allFonds[4].Name
		// fond = "Linux Foundation"
		b.Send(m.Sender, orglist.GetAllInfoAbtFoundations(session)[4], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineInvMenu})
	})
	b.Handle("/fond5", func(m *tb.Message) {
		allFonds := mongo.FindAllFoundations(session)
		fond = allFonds[5].Name
		// fond = "Ethereum Foundation"
		b.Send(m.Sender, orglist.GetAllInfoAbtFoundations(session)[5], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineInvMenu})
	})
	b.Handle("/fond6", func(m *tb.Message) {
		allFonds := mongo.FindAllFoundations(session)
		fond = allFonds[6].Name
		// fond = "РусФонда"
		b.Send(m.Sender, orglist.GetAllInfoAbtFoundations(session)[6], &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineInvMenu})
	})

	// слушает какой фонд выбрал

	// тут клавиатурка по занесению денег
	b.Handle(&inlineklav0, func(c *tb.Callback) {
		sum += "0"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav1, func(c *tb.Callback) {
		sum += "1"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav2, func(c *tb.Callback) {
		sum += "2"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav3, func(c *tb.Callback) {
		sum += "3"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav4, func(c *tb.Callback) {
		sum += "4"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav5, func(c *tb.Callback) {
		sum += "5"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav6, func(c *tb.Callback) {
		sum += "6"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav7, func(c *tb.Callback) {
		sum += "7"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav8, func(c *tb.Callback) {
		sum += "8"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklav9, func(c *tb.Callback) {
		sum += "9"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklavdot, func(c *tb.Callback) {
		sum += "."
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklavrenew, func(c *tb.Callback) {
		sum = ""
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklavdellast, func(c *tb.Callback) {
		sz := len(sum)
		if sz > 0 {
			sum = sum[:sz-1]
		}
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&inlineklavapply, func(c *tb.Callback) {
		var torub = course.Course("RUB")
		var torub2, err = strconv.ParseFloat(sum, 64)
		if err != nil {
			println(err)
		}
		torub3 := (1.0 / (gjson.Get(string(torub), "ETH").Float())) * torub2

		var ethrub = strconv.FormatFloat(torub3, 'g', 8, 64)

		var msg = "*Данные о переводе*\n\n" + "`Организация: ` *" + fond + "*\n\n`Сумма пожертвования:` *" + sum + "*` " + concurrency + "` или *" + ethrub + "* `RUB`"

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdaply})
		b.Respond(c, &tb.CallbackResponse{})

	})
	b.Handle(&inlineklavback, func(c *tb.Callback) {
		sum = ""
		concurrency = ""
		var msg = "Выберите валюту для перевода: \n\n`Только для ETH доступна операция отслеживания того, что делает организация`"
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineCurrency})
		b.Respond(c, &tb.CallbackResponse{})
	})

	// тут клавиатурка по занесению денег

	// Выбрать валюту после фонда
	b.Handle(&inlineInv, func(c *tb.Callback) {
		var msg = "Выберите валюту для перевода: \n\n`Только для ETH доступна операция отслеживания того, что делает организация`"
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineCurrency})
		b.Respond(c, &tb.CallbackResponse{})
	})

	// b.Handle(&inlineBtnWAV, func(c *tb.Callback) {
	// 	concurrency = "Waves"
	// 	var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
	// 	b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
	// 	b.Respond(c, &tb.CallbackResponse{})
	// })

	// b.Handle(&inlineBtnBTC, func(c *tb.Callback) {
	// 	concurrency = "Bitcoin"
	// 	var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
	// 	b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
	// 	b.Respond(c, &tb.CallbackResponse{})
	// })

	b.Handle(&inlineBtnETH, func(c *tb.Callback) {
		concurrency = "Ethereum"
		var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
		b.Respond(c, &tb.CallbackResponse{})
	})

	// b.Handle(&inlineBtnLTC, func(c *tb.Callback) {
	// 	concurrency = "Litecoin"
	// 	var msg = orglist.EnterSum + "Текущая сумма: " + sum + " " + concurrency
	// 	b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"}, &tb.ReplyMarkup{InlineKeyboard: inlineKbrdsum})
	// 	b.Respond(c, &tb.CallbackResponse{})
	// })

	// Выбрать валюту после фонда

	// Обработчики голосов
	b.Handle(&voteButtonYes0, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "1", "true")
		mongo.AddVoter(session, voteID[0], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo0, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "1", "false")
		mongo.AddVoter(session, voteID[0], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes1, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "2", "true")
		mongo.AddVoter(session, voteID[1], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo1, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "2", "false")
		mongo.AddVoter(session, voteID[1], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes2, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "3", "true")
		mongo.AddVoter(session, voteID[2], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo2, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "3", "false")
		mongo.AddVoter(session, voteID[2], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes3, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "4", "true")
		mongo.AddVoter(session, voteID[3], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo3, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "4", "false")
		mongo.AddVoter(session, voteID[3], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes4, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "5", "true")
		mongo.AddVoter(session, voteID[4], userID, true)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo4, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "5", "false")
		mongo.AddVoter(session, voteID[4], userID, false)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes5, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "6", "true")
		mongo.AddVoter(session, voteID[5], userID, true)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo5, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "6", "false")
		mongo.AddVoter(session, voteID[5], userID, false)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes6, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "7", "true")
		mongo.AddVoter(session, voteID[6], userID, true)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo6, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "7", "false")
		mongo.AddVoter(session, voteID[6], userID, false)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes7, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "8", "true")
		mongo.AddVoter(session, voteID[7], userID, true)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo7, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "8", "false")
		mongo.AddVoter(session, voteID[7], userID, false)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes8, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "9", "true")
		mongo.AddVoter(session, voteID[8], userID, true)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo8, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "9", "false")
		mongo.AddVoter(session, voteID[8], userID, false)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes9, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "10", "true")
		mongo.AddVoter(session, voteID[9], userID, true)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo9, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "10", "false")
		mongo.AddVoter(session, voteID[9], userID, false)

		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes10, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "11", "true")
		mongo.AddVoter(session, voteID[10], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo10, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "11", "false")
		mongo.AddVoter(session, voteID[10], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes11, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "12", "true")
		mongo.AddVoter(session, voteID[11], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo11, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "12", "false")
		mongo.AddVoter(session, voteID[11], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes12, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "13", "true")
		mongo.AddVoter(session, voteID[12], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo12, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "13", "false")
		mongo.AddVoter(session, voteID[12], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes13, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "14", "true")
		mongo.AddVoter(session, voteID[13], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo13, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "14", "false")
		mongo.AddVoter(session, voteID[13], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes14, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "15", "true")
		mongo.AddVoter(session, voteID[14], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo14, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "15", "false")
		mongo.AddVoter(session, voteID[14], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes15, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "16", "true")
		mongo.AddVoter(session, voteID[15], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo15, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "16", "false")
		mongo.AddVoter(session, voteID[15], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes16, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "17", "true")
		mongo.AddVoter(session, voteID[16], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo16, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "17", "false")
		mongo.AddVoter(session, voteID[16], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes17, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "18", "true")
		mongo.AddVoter(session, voteID[17], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo17, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "18", "false")
		mongo.AddVoter(session, voteID[17], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes18, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "19", "true")
		mongo.AddVoter(session, voteID[18], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo18, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "19", "false")
		mongo.AddVoter(session, voteID[18], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes19, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "20", "true")
		mongo.AddVoter(session, voteID[19], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo19, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "20", "false")
		mongo.AddVoter(session, voteID[19], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes20, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "21", "true")
		mongo.AddVoter(session, voteID[20], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo20, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "21", "false")
		mongo.AddVoter(session, voteID[20], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes21, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "22", "true")
		mongo.AddVoter(session, voteID[21], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo21, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "22", "false")
		mongo.AddVoter(session, voteID[21], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes22, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "23", "true")
		mongo.AddVoter(session, voteID[22], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo22, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "23", "false")
		mongo.AddVoter(session, voteID[22], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes23, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "24", "true")
		mongo.AddVoter(session, voteID[23], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo23, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "24", "false")
		mongo.AddVoter(session, voteID[23], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	b.Handle(&voteButtonYes24, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "25", "true")
		mongo.AddVoter(session, voteID[24], userID, true)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})
	b.Handle(&voteButtonNo24, func(c *tb.Callback) {
		user := mongo.FindUserByID(session, userID)
		var msg = vote(user.EthPrvKey, "25", "false")
		mongo.AddVoter(session, voteID[24], userID, false)
		b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
		b.Respond(c, &tb.CallbackResponse{})
	})

	// final apply
	b.Handle(&inlinуvapply, func(c *tb.Callback) {
		user := mongo.FindUser(session, strconv.Itoa(c.Sender.ID))

		var userid = strconv.Itoa(c.Sender.ID)
		var prvtKey = user.EthPrvKey
		var address = user.EthAddress

		var torub = course.Course("RUB")
		var torub2, err = strconv.ParseFloat(sum, 64)
		if err != nil {
			println(err)
		}
		torub3 := (1.0 / (gjson.Get(string(torub), "ETH").Float())) * torub2

		sum1, err := strconv.ParseFloat(sum, 64)
		if err != nil {
			println(err)
		}

		var sum23 = sum1 * math.Pow(10, 18)
		var sumString = strconv.FormatFloat(sum23, 'g', 18, 64)

		status := ethereum.SendTransaction(prvtKey, address, "0xD641ee9833f11Cd40C7Dd7b777C8e80bD8d842A8", sumString)

		if status != "400" {
			fondObj := mongo.FindFoundationByName(session, fond)

			mongo.AddFoundationToUser(session, userid, fondObj.ID, concurrency, sum1, torub3)
			var msg = "Перевод совершен успешно, подробности в личном кабинете"
			concurrency = ""
			sum = ""
			fond = ""
			b.Edit(c.Message, msg, &tb.SendOptions{ParseMode: "Markdown"})
			b.Send(c.Sender, "Главное меню", &tb.SendOptions{DisableWebPagePreview: true}, &tb.ReplyMarkup{ReplyKeyboard: replyKeys})
			b.Respond(c, &tb.CallbackResponse{})
		} else {
			var text = "Недостаточно средств на балансе"
			b.Send(c.Sender, text, &tb.SendOptions{DisableWebPagePreview: true, ParseMode: "Markdown"}, &tb.ReplyMarkup{ReplyKeyboard: replyKeys})
			b.Respond(c, &tb.CallbackResponse{})
		}
	})
	// final apply

	b.Start()
}
