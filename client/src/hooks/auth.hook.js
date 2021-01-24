//данный хук работает исключительно с авторизацией человека в систему
import {useState,useCallback,useEffect} from 'react'
const storageName = 'userData'      //Чтобы не дублировать название поля была создана переменная userData


//ф-ция,в кот. мы экспортируем методы,кот. нам позволяют зайти систему либо выйти из нее
export const useAuth = () => {
    const [token, setToken] = useState(null)  //State отвечающий за токен,по ум. его значение будет null
    const [ready , setReady] = useState(false)
    const [userId, setUserId] = useState(null)


    const login = useCallback( (jwtToken, id) => {        //принимаем jwtToken,кот. будет получать с бэкенда
        setToken(jwtToken)     //задаём jwtToken для локального State
        setUserId(id)     //задаём id

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken
        }))//записываем все это в LocalStorage - браузерный базовый api.Чтобы не дублировать название поля была создана переменная userData.2 параметром корректно передаем в localStorage объект обращаясь к JSON
    }, [] )

    const logout = useCallback( () => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [] )

    //когда наше приложение загружается,я хочу чтобы по ум. данный хук смотрел,есть ли вообще данные в LocalStorage
    //если есть - чтобы хук сам автоматически из LocalStorage записал их в локальное состояние.Используем для этого хук useEffect
    useEffect( () => {      //здесь опеределяется наличие токена,но он асинхронный и не сразу отрабатывает
        const data = JSON.parse(localStorage.getItem(storageName) )  //получаем потенциальные данные из localStorage.Чтобы привести все из строчки к объекту вызываем JSON.parse()

        if(data && data.token) {
            login(data.token , data.userId)
        }
        setReady(true)  //говорим окей,модуль авторизации отработал
    }, [login] )        //как зависимость указываем метод login потому что мы его здесь используем.И именно для этого мы оборачивали login в useCallback

    return {login, logout, token, userId, ready}
}

//при получении jwt токена нам необходимо его хранить в  LocalStorage
//т.е. если мы перезагрузим систему и в LocalStorage есть валидный токен,то мы его используем и сразу же человека кидаем в систему




