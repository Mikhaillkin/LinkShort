//на этой странице в нашем проекте мы будем создавать ссылку,кот. будет сокращенной
import React, {useContext,useEffect, useState} from 'react'         //импортируем базовую составляющую страницы
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext"
import {useHistory} from 'react-router-dom'

export const CreatePage = () => {        //Экспортирую константу,где буду возвращать jsx
    const history = useHistory()//после создание ссылки делаем редирект на неё,для этого используем хук useHistory
    const auth = useContext(AuthContext)  //токен,кот. хранится в объекте auth необходимо добавить как header 4-ым параметром(объект хэдеров) в const data ~29 строчка кода
    const [link,setLink] = useState('')   //сохдаю локальный state с ссылкой по ум. будет пустая строчка
    const {request} = useHttp()    //получаю объект в {},откуда берём request

    useEffect(() => {
        window.M.updateTextFields()           //этот useEffect делает инпуты для входа по ум. активными(2:05:29)До этого был небольшой ьаг в этом
    }, [])

    const pressHandler = async event => {
        if (event.key === 'Enter'){         //проверка нажали мы именно Enter
            //если да,то тогда делаем синхронный запрос в блоке try catch
            //здесь нам потребуется хук useHttp,кот. мы создали,кот. работает с http
            try {
                const data = await request('/api/link/generate','POST',{from: link},{Authorization: `Bearer ${auth.token}`})       //тк используется оператор await то ф-ция pressHandler должна быть async.Authorization - это header
                //request делаем на /api/link/generate метод POST и как данные нам необх. отправить объект,где присутствует ключ from со значением link
                //в поле data мы получаем объект где хранится ключ link,где хранится информация по link
                //Про 4-ый параметр: нам необходимо в хэдерах отправлять тот токен,с кот мы сейчас работаем
                //ПОСЛЕ того как мы сделали ссылку делаем редирект на неё детальную страницу(DetailPage) с id новой ссылки
                history.push(`/detail/${data.link._id}`)
            } catch (e) {}


        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2">
                <div className="input-field">
                    <input placeholder="Вставьте ссылку"
                           id="link"
                           type="text"
                           value={link}
                           onChange={e => setLink(e.target.value)}       //когда происходит событие onChange то нам нужно изменять локальный state(вдруг если мы будем руками его прописывать)
                           onKeyPress={pressHandler}                    //обработка события onKeyPress -> вызов метода pressHandler (если мы нажимаем Enter то тогда формируется эта сслыка)
                    />
                    <label htmlFor="email">Введите ссылку</label>
                </div>
            </div>
        </div>
    )
}