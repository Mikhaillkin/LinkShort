const {Router} = require('express')          //мы подключиди Router из mongoose
const User = require('../models/User')     //подключаем модель
const bcrypt = require('bcryptjs')        //данный модуль позволяет хэшировать пароли и впоследствиии х еще исравнивать
const {check , validationResult} = require('express-validator') //(библиотека для валидации данных в express пом.модуля express-validator)импортируем метод чек и ф-цию validationResult
const jwt = require('jsonwebtoken')   //модуль для генерации jwt токен и работы с ним
const config = require('config')     //для получения доступа к jwt токену

const router = Router()      //создаем роутер




//подготовили 2 endpoint'а:register и login по которым дальше будем работать
// /api/auth/register
router.post(
    '/register' ,
    [                                                                       //массив middleware'ов,кот. будут делать валидацию
       check('email' , 'Неккоректный email').isEmail(),        //isEmail() - встроенная вещь(валидатор) в express-validator
       check('password' , 'Минимальная длина пароля 6 символов')
           .isLength({ min: 6 })
        //вот такая простая валидация,теперь нам необходимо ее обработать
    ],
    async (req , res) => {
    //обрабатываем 2 асинхронных запроса через блок try catch
    try{
        // console.log('Body is:' , req.body)   - данный лог использовался для отладки body при регистрации

        const errors = validationResult(req)    //таким образом express-validator валидирует входящие поля(создаем переменную вызвав ф-цию,в кот. мы передаем объект req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),                            //передаю обратно на фронтэнд ошибки,если они есть
                message: 'Некорректные данные при регистрации'     //и сообщение.Это абсолютно кастомизируемо,что передавать на фронтэнд
            })
        }



        const {email, password} = req.body  //получаю определенные поля из объекта req.body - email  и password( то что мы будем отправлять с фронтенда)

        //логика для регистрации нового пользователя и различные проверки

        const candidate = await User.findOne({ email:email })   //мы ждем пока модель User будет искать пользвователя по email в БД('email:email' - тк ключ и значение совпадают)

        if (candidate) {
            return res.status(400).json({message:'Такой пользователь уже существует.'})
        }


        const hashedPassword = await bcrypt.hash(password , 12)     //1 параметр - пароль,кот. мы получаем с фронтена, 2 параметр - параметр кот. позволяет еще больше зашифровать пароль
                                                                    //данная вещь является асинхронной, поэтому мы написали await
        //Создание нового пользователя(мэйл у него будет email,а пароль - hashedPassword)
        const user = new User({ email , password: hashedPassword })
        await user.save()     //ждем пока пользователь сохранится
                              //когда данных promise будет завершен - это будет значит,Что в БД мы создали данного человека
        //отвечаем фронтенду(201 статус - это когда что-то создаётся)
        res.status(201).json({message: 'Пользователь создан'})

    } catch (e) {
        //здесь можно делать продвинутые типы ошибок,но пока обойдемся здесь базовыми
        //здесь одна универсальная ошибка кот. мы будем отправлять если что-то не так пойдет в try
        res.status(500).json({message:'Что-то пошло не так,попробуй ещё раз'})                        //с пом. объекта res задаём статус для ответа 500(серверная ошибка)
                                              //и с пом. метода json передаём сообщение ошибки
    }

})







// /api/auth/login
router.post('/login' ,
        [
            check('email', 'Введите корректный email').normalizeEmail().isEmail(),
            check('password' , 'Введите пароль').exists()
        ],
        async (req , res) => {

        try{
            const errors = validationResult(req)    //таким образом express-validator валидирует входящие поля(создаем переменную вызвав ф-цию,в кот. мы передаем объект req)

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),                            //передаю обратно на фронтэнд ошибки,если они есть
                    message: 'Некорректные данные при входе в систему'     //и сообщение.Это абсолютно кастомизируемо,что передавать на фронтэнд
                })
            }

            const {email , password} = req.body          //получаем поля email и password из req.body
            const user = await User.findOne({ email })     //ищем пользователя в БД по email

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }

            //если сы прошли условный оператор выше,значит пользователь найден и теперь нужно проверить пароли на совпадение
            const isMatch = bcrypt.compare(password , user.password)  //метод bcrypt.compare() позволяет сравнивать захэшированные пароли
                                                                      //1 аргумент ф-ции - пароль кот. был получен с фронтэнда,2 - захэшированный из БД
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль,попробуйте ещё раз' })
            }

            //если мы дошли до этого этапа при авторизации,значит с пользователем всё хорошо и нам теперь нужно сделать авторизацию пользователя
            //учитывая что у нас сингл page приложение, авторизацию будем делать через jwt токен

            const token = jwt.sign(                              //создаю токен jwt
                { userId : user.id },                     //передаю параметры(опции)   1 параметр - объект,где будут указаны данные,кот. будут зашифрованы в jwt токене.Записали сюда UserID,но также можно сюда записать UserEmail,UserName и тд
                config.get('jwtSecret'),                    //2 параметр - секретный ключ(кот. находится в общем config)
                { expiresIn: '1h' }                 //3 парметр - это объект содержащий время жизни jwt токена.Реклмендация - 1 час
            )

            //токен успешно сформирован,теперь ответим входящему человеку
            //статус не указываем,тк по ум. он 200
            res.json({ token , userId: user.id })

        } catch (e) {
            //здесь можно делать продвинутые типы ошибок,но пока обойдемся здесь базовыми
            //здесь одна универсальная ошибка кот. мы будем отправлять если что-то не так пойдет в try
            res.status(500).json({message:'Что-то пошло не так,попробуй ещё раз'})                        //с пом. объекта res задаём статус для ответа 500(серверная ошибка)
            //и с пом. метода json передаём сообщение ошибки
        }

})






module.exports = router     //из модуля экспортируем объект роутера
                           //Роутер - это концепт middleware в express



