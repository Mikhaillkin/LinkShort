//на этой странице в нашем проекте будет показывать конкретную ссылку и статистику по ней
import React , {useState,useCallback,useEffect,useContext} from 'react'         //импортируем базовую составляющую страницы
import {useHttp} from "../hooks/http.hook"
import {useParams} from 'react-router-dom'      //метод(хук) useParams (тк хуки это методы пригодные для множественного использования и помогающие уменьшить потворения кода в программах)
import {AuthContext} from "../context/AuthContext"
import {LinkCard} from "../components/LinkCard"
import {Loader} from "../components/Loader"



export const DetailPage = () => {        //Экспортирую константу,где буду возвращать jsx
    const {token} = useContext(AuthContext)//используем хук useContext используя AuthContext,чтобы получить токен,кот нужен в Authorization: `Bearer ${.....}`
    const {request , loading} = useHttp()
    const [link,setLink] = useState(null)       //в этом файле нам потребуется сам ссылка,сделаем мы это через хук useState(по ум. у нас ссылка булет null-ом). link и setLink -то что мы получим с бэкенда
    //также нам необходимы гет-параметры(id),кот находятся в адресной строке после /detail/
    const linkId = useParams().id        //получаеем linkId с пом. useParams().id          id берется из routes.js - '<Route path="/detail/:id">'       Теперь linkId - это id нашей ссылки по кот. мы можем сделать запрос

    //создаю отдельный метод,Кот. поможет мне загрузить ссылку
    const getLink = useCallback( async () => {
        try {
            //в блоке try catch делаем запрос,для кот. нам потребуется хук useHttp
            const fetched = await request(`/api/link/${linkId}`,'GET',null,{Authorization: `Bearer ${token}`})
            //на выходе мы получаем объект fetched,кот. по факту является непосредственно ссылкой
            setLink(fetched)    //локально формируем эту ссылку
            //делаем request,определяем ссылку.       В link.routes.js,на сервере,запросы считывают динамические id.    Null -это body,кот. здесь не нужен,поэтому null.
        } catch (e) {}
    },[token,linkId,request] )


    //запрос getLink делается тогда,когда у нас будет готов компонент,мы это можем определить useEffect
    useEffect( () => {
        getLink()
    }, [getLink] )

    if (loading) {
        return <Loader />       //нам нужно какое-то время,пока загрузятся данные с сервера,поэтому добавляем Loader
    }


    return (            //основной return
        <>
            {!loading && link && <LinkCard link={link}/>}      /*возвращаем фрагмент,чт осли не loading и уже присутствует непосредственная ссылка,то тогда я буду показывать компонент LinkCard.Мы ипортировали компоненту  LinkCard и оттуда присвоили параметру link импортированный link*/
        </>
    )
}