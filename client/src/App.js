// import logo from './logo.svg';
// import './App.css';
// это скрипты кот. позволять оживить нек. input , кот. мы будем пользоваться
import React from 'react'
import 'materialize-css'
import {BrowserRouter as Router} from "react-router-dom"
import {useRoutes} from "./routes"
import {useAuth} from "./hooks/auth.hook"
import {AuthContext} from "./context/AuthContext"
import {Navbar} from "./components/Navbar"
import {Loader} from "./components/Loader"


function App() {
    const {token, userId, login, logout,ready} = useAuth()     //используем хук useAuth и получем из него определенные данные
    const isAuthenticated = !!token                    //отдельно создаём переменную isAuthenticated - это флаг,кот. говорит зарегистрирован ли сейчас пользователь в системе или нет.Это можно определить по наличию токена.isAuthenticated мы можем использовать,чтобы передавать наши значения в const routes = useRoutes( сюда )
    const routes = useRoutes(isAuthenticated)      //импортируем  и сразу создаём роуты.Передаёт динамическое значение переменной isAuthenticated

    //мы используем хук useAuth и по ум. подгружаем роуты в зависимости от наличия токена,наличие токена определяется в useEffect(auth.hooks.js)
    //по ум. мы грузим роуты где отстутствует авторизация,но мы можем обойти это добавив флаг ready в auth.hooks.js
    //и когда в useEffect он вызовется мы передадим значение true в setReady(),сказав этим что модуль авторизации уже отработал

    if (!ready) {   //в случае если ready === false,т.е. мы ещё не успели определить авторизацию,то тогда мы возвращаем компонент Loader
        return <Loader />
    }

    return (
        <AuthContext.Provider value = {{token, userId, login, logout, isAuthenticated}}>
            <Router>
                //подключение компоненты Navbar
                { isAuthenticated && <Navbar/> }    //если isAuthenticated то тогда я буду дополнительно показывать компонент Navbar
                <div className="container">
                    {routes}      //вставляю роуты как контент
                </div>
            </Router>
        </AuthContext.Provider>
  )
}

export default App
