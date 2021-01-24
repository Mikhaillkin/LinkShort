//на этой странице в нашем проекте у нас будет список сокращенных ссылок авторизованного пользователя
import React, {useCallback, useContext, useEffect, useState} from 'react'     //импортируем базовую составляющую страницы React и хуки
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {LinksList} from '../components/LinksList'

export const LinksPage = () => {    //Экспортирую константу,где буду возвращать(return'ить) jsx
    const [links, setLinks] = useState([])      //нам потребуется здесь useState локальный,это будет пустой массив,тк здесь мы будем работать уже с ссылками
    const {loading, request} = useHttp()
    const {token} = useContext(AuthContext)

    const fetchLinks = useCallback(async () => {            //ф-ция позволяющая загрузить нам список ссылок
        try {
            const fetched = await request('/api/link', 'GET', null, {       //создаю const fetched ссылки и жду пока requset сделает запрос на
                Authorization: `Bearer ${token}`        //наши header
            })
            //когда у нас ссылки загрузятся,то мы делаем:
            setLinks(fetched)
        } catch (e) {}
    }, [token, request])        //deps - это массив зависимотстей

    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if (loading) {      //если у нас происходит процесс загрузки то тогда мы возвращаем Loader,но если нет то тогда в основной return я возвращаю фрагмент
        return <Loader/>
    }

    return (        //возвращаю jsx
        <>
            {!loading && <LinksList links={links} />}       /*,но если нет то тогда в основной return я возвращаю фрагмент,где я буду спрашивает если не loadind,то тогда я буду показывать компонент LinksList*/
        </>
    )
}