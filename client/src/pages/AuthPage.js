import React , {useEffect,useState,useContext} from 'react'
import {useHttp} from "../hooks/http.hook"
// import * as events from 'events'
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from "../context/AuthContext";         //импортируем базовую составляющую страницы
//пользуемся здесь библиотекой materialize,чтобы задававть определенные классы(задам стилистику страницы)


export const AuthPage = () => {        //Экспортирую константу,где буду возвращать jsx
    const auth = useContext(AuthContext)    //пользуемся контекстом с пом. хука useContext.Теперь в объекте auth есть все данные,кот мы передаем в <AuthContext.Provider value = {{token, userId, login, logout, isAuthenticated}}>
    const message = useMessage()
    const {loading, request, error,clearError} = useHttp()    //экспортируем хук и сразу берем поля этого объекта
    const [form , setForm] = useState(  {         //создаю с пом. хука usState
        email: '' , password:''         //сам State будет являться объектом состоящим из 2ух полей
    })


    useEffect(() => {
        //если ошибка есть,то я хочу ее вывести для пользователя.Воспользуюсь библиотекой materialize для этого,у кот. есть метод toast.Также сделаем это с пом. ещё одного нашего хука message.hook.js
        message(error)//в случае если у меня меняется объект error,я показываю эту ошибку в ф-ции message
        clearError()    //очистка ошибки
    }, [error,message,clearError])     //2 аргумент - это зависимости


    useEffect(() => {
        window.M.updateTextFields()           //этот useEffect делает инпуты для входа по ум. активными(2:05:29)До этого был небольшой ьаг в этом
    }, [])


    const changeHandler = event => {        //обычно те методы,кот. я добавляю к изменяющимся параметрам я называю с Hadler для того чтобы было понятно что они что-то обрабатывают
                                            //данный метод принимает нативный js event(на самом деле это обёртка реакта нд ивентом,но у него такое же апи)
        //здесь изменяем определенное поле в форме
        setForm({ ...form , [event.target.name]: event.target.value})   //вызываю метод setForm , разворачиваем с пом. оператора spread объект form
                               //event.target.name - динамический ключ.Нужен чтобы опреелить какое именно поле мы меняем(на каждом input есть атрибут name)
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register' , 'POST' , {...form})  //3 параметр - разворачиваю локальный стэйт форм,тк нам нужен мэйл и пароль передать на сервер
            message(data.message)       //благодаря этой строчке при регистрации всплывает окошко(пользователь создан)
        } catch (e) {}    //т.к. catch мы уже обработали http.hook.js
    }


    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login' , 'POST' , {...form})
            auth.login(data.token , data.userId)
        } catch (e) {}
    }


    return (
       <div>
            <div className='col s6 offset-s3'>  //класс для выравнивания по центру формы
                <h1>Сократи ссылку</h1>    //просто задаем такой шаблон для страниц,чтобы протестировать что они открываются
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>

                            <div className="input-field">
                                <input placeholder="Введите email"
                                       id="email"
                                       type="text"
                                       name="email"
                                       className="yellow-input"
                                       value={form.email}       //благодаря этому корректно трекаем изменения в AuthPage
                                       onChange={changeHandler}/>
                                    <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input placeholder="Введите пароль"
                                       id="password"
                                       type="password"
                                       name="password"
                                       className="yellow-input"
                                       value={form.password}     //благодаря этому корректно трекаем изменения в AuthPage
                                       onChange={changeHandler}/>
                                <label htmlFor="password">Пароль</label>
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4" style={{marginRight: 10}} onClick={loginHandler} disabled={loading}>Войти</button>
                        <button className="btn пкун lighten-1 black-text" onClick={registerHandler} disabled={loading}>Регистрация</button>
                    </div>
                </div>
            </div>
       </div>
)
}


//Вот эти 4 базовых компонента AuthPage,CreatePage,DetailPage,LinksPage и которых
//мы можем сделать роуты.Но ссылки нашего приложения зависять от авторизации пользователя
//Нужно понять автоизован ли пользователь и в зависит=мости от авторизации показвыать определенный набор ссылок






