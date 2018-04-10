package orglist

import (
	"strconv"

	"../mongo"
	"gopkg.in/mgo.v2"
)

// GetFoundations Поиск всех фондов
func GetFoundations(session *mgo.Session) []string {
	allFonds := mongo.FindAllFoundations(session)
	var foundationsArr []string
	for key := range allFonds {
		strKey := strconv.Itoa(key)
		str := "*Список организаций:*\n\n*Фонд:* " + allFonds[key].Name + "\n\n*Информация о фонде:* " + allFonds[key].Mission + "\n\nПодробнее *нажмите* на кнопку: /fond" + strKey + "\n\nДля того, чтобы *посмотреть* все фонды, *используете* кнопки: 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣"
		foundationsArr = append(foundationsArr, str)
	}
	return foundationsArr
}

// GetAllInfoAbtFoundations Получение подробной информации по всем фондам
func GetAllInfoAbtFoundations(session *mgo.Session) []string {
	allFonds := mongo.FindAllFoundations(session)
	var foundationsArr []string
	for key := range allFonds {
		// strKey := strconv.Itoa(key)
		strFloat := strconv.FormatFloat(float64(allFonds[key].Capital), 'g', 2, 64)
		str := "*" + allFonds[key].Name + "*\n\n*Since:* " + strconv.Itoa(allFonds[key].FoundedDate) + "\n\n*Amount of money :* " + strFloat + " bln $\n\n*Country:* " + allFonds[key].Country + "\n\n*About:* " + allFonds[key].Mission + ""
		foundationsArr = append(foundationsArr, str)
	}
	return foundationsArr
}

// // Data Первый фонд Подари жизнь
// const Data = "*Список организаций:*\n\n*Фонд:* Bill & Melinda Gates Foundation\n\n*Информация о фонде:* The primary aims of the foundation are, globally, to enhance healthcare and reduce extreme poverty, and in America, to expand education and access to IT\n\nПодробнее *нажмите* на кнопку: /fond0\n\nДля того, чтобы *посмотреть* все фонды, *используете* кнопки: 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣"

// // Data1 Первый фонд Подари жизнь
// const Data1 = "*Список организаций:*\n\n*Фонд:* Подари Жизнь\n\n*Информация о фонде:* негосударственный благотворительный фонд, созданный с целью помощи детям с онкологическими, гематологическими и другими тяжёлыми заболеваниями.\n\nПодробнее *нажмите* на кнопку: /fond1"

// // Data2 Первый фонд Подари жизнь
// const Data2 = "*Список организаций:*\n\n*Фонд:* Welcome Trust\n\n*Информация о фонде:* The aim of the Trust is to `achieve extraordinary improvements in health by supporting the brightest minds1`, and in addition to funding biomedical research it supports the public understanding of science.\n\nПодробнее *нажмите* на кнопку: /fond2\n\nДля того, чтобы *посмотреть* все фонды, *используете* кнопки: 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣"

// // Data3 Первый фонд Подари жизнь
// const Data3 = "*Список организаций:*\n\n*Фонд:* Ford Foundation\n\n*Информация о фонде:* For years, the foundation was the largest, and one of the most influential foundations in the world, with global reach and special interests in economic empowerment, education, human rights, democracy, the creative arts, and Third World development.\n\nПодробнее *нажмите* на кнопку: /fond3\n\nДля того, чтобы *посмотреть* все фонды, *используете* кнопки: 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣"

// // Data4 Первый фонд Подари жизнь
// const Data4 = "*Список организаций:*\n\n*Фонд:* Linux Foundation\n\n*Информация о фонде:* Build sustainable ecosystems around open source projects to accelerate technology development and commercial adoption.\n\nПодробнее *нажмите* на кнопку: /fond4\n\nДля того, чтобы *посмотреть* все фонды, *используете* кнопки: 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣"

// // Data5 Первый фонд Подари жизнь
// const Data5 = "*Список организаций:*\n\n*Фонд:* Ethereum Foundation\n\n*Информация о фонде:* родвижение и поддержка платформы Ethereum и исследований, разработок и образования базового уровня, чтобы принести децентрализованные протоколы и инструменты в мир, которые позволяют разработчикам создавать децентрализованные приложения следующего поколения (dapps), и вместе построить более глобально доступный, более свободный и более надежный Интернет.\n\nПодробнее *нажмите* на кнопку: /fond5\n\nДля того, чтобы *посмотреть* все фонды, *используете* кнопки: 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣"

// // Data6 Первый фонд Подари жизнь
// const Data6 = "*Список организаций:*\n\n*Фонд:* РусФонда\n\n*Информация о фонде:* помощь тяжелобольным детям. Другие направления деятельности — поддержка медицинских учреждений (больницы, хосписы, мед.центры), поддержка развития новых медицинских технологий, организация обучения медицинских работников.\n\nПодробнее *нажмите* на кнопку: /fond6\n\nДля того, чтобы *посмотреть* все фонды, *используете* кнопки: 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣"

// EnterSum Используется во всех диалогах при вводе суммы
var EnterSum = "Введите сумму, которую хотите инвестировать: \n\n"

// // DataAdd Доп инфа по Data
// const DataAdd = "*Bill & Melinda Gates Foundation*\n\n*Since:* 1994\n\n*Amount of money :* 34,6 bln $\n\n*Country:* USA\n\n*About:* The primary aims of the foundation are, globally, to enhance healthcare and reduce extreme poverty, and in America, to expand education and access to IT"

// // DataAdd1 Доп инфа по Data1
// const DataAdd1 = "*Подари жизнь*\n\n*Основан:* 2006\n\n*Деньги :* более 2 млрд рублей в год\n\n*Country:* Россия\n\n*Сфера деятельности :* помощь детям с онкологическими, гематологическими и другими тяжелыми заболеваниями"

// // DataAdd2 Доп инфа по Data2
// const DataAdd2 = "*Welcome Trust*\n\n*Since:* 1936\n\n*Amount of money :* 27,1 bln $\n\n*Country:* UK\n\n *About:* The aim of the Trust is to `achieve extraordinary improvements in health by supporting the brightest minds`, and in addition to funding biomedical research it supports the public understanding of science."

// // DataAdd3 Доп инфа по Data3
// const DataAdd3 = "*Ford Foundation*\n\n*Since:* 1936\n\n*Amount of money :* 12,4 bln $\n\n*Country:* USA\n\n*About:* For years, the foundation was the largest, and one of the most influential foundations in the world, with global reach and special interests in economic empowerment, education, human rights, democracy, the creative arts, and Third World development."

// // DataAdd4 Доп инфа по Data4
// const DataAdd4 = "*Linux Foundation*\n\n*Since:* 2000\n\n*Amount of money :* 6.2 bln $ annual\n\n*Country:* USA, Silicon Valley\n\n*About:*  Build sustainable ecosystems around open source projects to accelerate technology development and commercial adoption."

// // DataAdd5 Доп инфа по Data5
// const DataAdd5 = "*Ethereum Foundation*\n\n*Основан:* 2017\n\nДеньги : нет данных\n\n*Country:*  Швейцария\n\n*Миссия:*  продвижение и поддержка платформы Ethereum и исследований, разработок и образования базового уровня, чтобы принести децентрализованные протоколы и инструменты в мир, которые позволяют разработчикам создавать децентрализованные приложения следующего поколения (dapps), и вместе построить более глобально доступный, более свободный и более надежный Интернет."

// // DataAdd6 Доп инфа по Data6
// const DataAdd6 = "*РусФонда*\n\n*Основан:* 1996\n\nДеньги : более 1.5 млрд рублей в год\n\n*Country:*  Россия\n\n*Миссия:* помощь тяжелобольным детям. Другие направления деятельности — поддержка медицинских учреждений (больницы, хосписы, мед.центры), поддержка развития новых медицинских технологий, организация обучения медицинских работников."

// // DataAdd7 Доп инфа по Data7
// const DataAdd7 = "*Благотворительный фонд продовольствия «Русь»*\n\n*Основан: 2012*\n\n*Деньги :* более 1 млрд рублей в год\n\n*Страна:*  Россия\n\n*Миссия:* Совместно с Православной службой помощи «Милосердие»  при поддержке Синодального отдела по церковной благотворительности и социальному служению Русской Православной Церкви реализует в 16 городах страны проект «Народные обеды». Каждый две недели добровольцы собираются в трапезных при церквях, чтобы расфасовать еду по наборам. Продукты для этого закупает Фонд продовольствия «Русь» на пожертвования неравнодушных граждан и компаний."
