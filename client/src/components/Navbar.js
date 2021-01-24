//если мы залогинены в системе тогда мы мы будем показывать немного другой layout

import React from 'react'
import {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'        //useHistory - мпортирован для осущ-я редиретка
import {AuthContext} from "../context/AuthContext";        //ипорт компонента Navlink


//экспоритрую константу Navbar,кот. будет возвращать jsx
export const Navbar = () => {
    const history = useHistory()        //получаем объект history с пом. еот. мы будем делать навигацию
    const auth = useContext(AuthContext)

    const logoutHandler = (event) => {           //в ф-цию мы получаем событие event
        event.preventDefault()    //отменяем дефолтное поведение чтобы ссылка не обрабатывалась
        auth.logout()
        history.push('/')       //редирект на главную страницу
    }


    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
                <span className="brand-logo">Сокращение ссылок</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/create">Создать</NavLink></li>
                    <li><NavLink to="/links">Ссылки</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}