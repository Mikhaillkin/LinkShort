//Этот файл создан для того чтобы чуть лучше структурировать наш код
//Здесь определяются все наборы ссылок

import React from "react"   //учитывая что в файле будет jsx,импортируем сюда
import {Switch,Route,Redirect} from "react-router-dom"   //для того чтобы определить ывич и роут ипортируем компоненты свич и роут
import {LinksPage} from "./pages/LinksPage"
import {CreatePage} from "./pages/CreatePage"
import {DetailPage} from "./pages/DetailPage"
import {AuthPage} from './pages/AuthPage'

//в стиле текущего Реакта экспортируем ф-цию
//в зависиомсти от значения флага isAuthenticated возвращается определенный набор роутов
export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            //т.е. если true(если пользователь зарегистрирован и у него есть токен),то возвращаем определенный набор jsx
            <Switch>
                //здесь описываю роуты для вошедшего в систему человека
                <Route path="/links" exact>     //параметр exact нужен для того чтобы Route откликался исключительно на данную ссылку
                    <LinksPage />   //показываю первый роут,кот. отвечает за компонент LinksPage
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
                </Route>
                <Route path="/detail/:id">    //по id определяется какую ссылку мы открыли поэтому ставим параметр id
                    <DetailPage />
                </Route>
                <Route>
                    <Redirect to="/create"/>     //если мы не попадаем ни на какой из роутов выше то переправляем на страницу create
                </Route>
            </Switch>
        )
    }

    return (
        /*если if сверху не отрабатывает то по ум. возвращаем другой набор jsx */
        <Switch>
            /*роуты для человека кот. ещ не вошел в систему*/
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/"/>     /*если мы попадаем на какой-то из несуществующих роутов то делаем редирект до главной страницы*/
        </Switch>
    )
}

//Далее в файле App.js импортируем эти созданные роуты