//это главный файл сервера
const express = require('express')       //подключение пакета с пом. глоб ф-ции require
const config = require('config')         //общий кофниг для взаимодействия с различными конфиурационными константами
const mongoose = require('mongoose')
const path = require('path')    //модуль для осуществления указания пути

const app = express()                      //переменная app - результат работы функции express()

app.use(express.json({extended:true} ))                 //добавляю новый middleware,кот. встроен в express,extended - это параметр

//регсистрация роутов,которые по-разному будут обрабатывать api запросы с фронтенда
//1 аргумент метода use - является префиксом будущего пути, 2 аргумент - это сам роут
//для любого api запроса добавляем /api и для того чтобы работать далее с модулем регистрации добавляем /auth
//Формирование api на сервере:
app.use('/api/auth' , require('./routes/auth.routes'))
app.use('/api/link' , require('./routes/link.routes'))     //подключаем данный middleware
app.use('/t' , require('./routes/redirect.routes'))
//require в nodejs мы можем использовать везде,чтобы не создавать отдельные переменные,тк он динамический


//ДЕЛАЕМ ФРОНТЭНД И БЭКЕНД ОДНОВРЕМЕННО РАБОТАЮЩИМИ
if (process.env.NODE_ENV ==='production') {     //если системная переменная NODE_ENV ==='production' то тогда мы отдаём статику
    app.use('/',express.static(path.join(__dirname,'client','build')))//ещё один новый middlware.Если идет запрос на корень нашего приложения,то я добавляю мидлвэр express.static,чтобы указать нашу статическую папку
    //path формируется с пом. метода join от текущей директории в папку client и в папку build,где находитс та самая статика
    //По итону мы сформировали статическую папку
    app.get('*' , (req,res) => {        //(это мидлвэр)дальше говорю,что на любые другие get запросы
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))//я отправляю файл с пом. response,метода sendFile(),кот. находится у нас в папке __dirname(это текущая директория)->в папке client->в папке build,кот. наз-ся index.html(это отправляемый файл)
        //тем самым у нас будет работать бэкенд и фронтэнд одновременно,node будет за всё отвечать
    })
}



                                           //app - это наш будущий сервер
const PORT = config.get('port') || 5353    //обращение к оъекту через метод get для получение строчки из файла default.json
                                           //если вдруг он не определен то по ум 5353
//асинхронная функция
//здесь она для обёртки,чтобы пользоваться синтаксисом async , await
async function start() {
    //блок try catch
    try{
        //подключение к mongodb(база данных для нашего приложения)
        //метод connect возвращает Promise,пишем await,чтобы подождать пока promise завершится
        //первый параметр - Uri адрес по кот. мы добавляем базу данных
        await mongoose.connect(config.get('mongoUri'),{
            useUnifiedTopology: true,
            useNewUrlParser: true,          //необходимые параметры(опции) для того чтобы connect успешно работал
            useCreateIndex: true
        })
    } catch (e) {
        console.log('Serv err:', e.message) //вывод сообщения e.message
        process.exit(1)            //выход с процесса nodejs с пом. глобал.объекта precess и его метода exit
                                   //то есть мы просто завершаем процесс если что-то пойдет не так
    }
}

start()            //вызов функции

app.listen(PORT , () => console.log(`App has been started on port ${PORT}`))  //в режиме разработки и продакш версии у нас будут разные порты запуска