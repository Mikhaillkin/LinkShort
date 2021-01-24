//в этой компоненте мы рисуем непосредственное отображение страницы DetailPage
import React from 'react'

//компонент LinkCard принимает параметр link
export const LinkCard = ({ link }) => {
    return (        //в return описываем шаблон для отображения отдельной ссылки
        <>
            <h2>Ссылка</h2>

            <p>Ваша ссылка: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>   /*rel - для того чтобы реакт корректно работал с ссылками*/
            <p>Откуда: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
            <p>Количество кликов по ссылке: <strong>{link.clicks}</strong></p>     /*link.clicks - это информация есть в модели на бэкенде*/
            <p>Дата создания: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>   /*приводим link.date к локальному формату*/
        </>
    )
}