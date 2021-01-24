//хочу все эти значения token, userId, login, logout передавать через context всему приложению
//контекст создаются через обычную ф-цию в реакте - createContext
import {createContext} from 'react'

function noop() {}   //простая пустая ф-ция кот. ничего не делает


//экспортирую константу
export const AuthContext = createContext({
    //передаю сюда базвые составляющие для этого контекста
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})
//это наш текующий контекст,кот.сможет передавать параметры по всему наему приложению
//для этого в App.js мы обворачиваем все наше приложение в <AuthContext.Provider></AuthContext>