// //компонент для отображения
// import React from 'react'
// import {Link} from 'react-router-dom'       //компонента для кнопки позволяющей открывать ссылки
//
// //здесь это обычный компонент,Кот. отвечает за отображение
// export const LinksList = ({ links }) => {       //получаем массив links
//     if (!links.length) {        //если links.length равнятеся 0,то возвращаем параграф.А в случае если в массиве что-либо есть,то тогда показываю таблицу в главном return
//         return <p className="center">Ссылок пока нет</p>
//     }
//
//     return (        //возвращаю jsx с разметкой таблицы из materializecss
//         <table>
//             <thead>
//             <tr>
//                 <th>№</th>
//                 <th>Оригинальная</th>       /*писание полей*/
//                 <th>Сокращенная</th>
//                 <th>Открыть</th>
//             </tr>
//             </thead>
//
//             <tbody>         /*внутри tbody делаем итерацию по полям*/
//             { links.map((link, index) => {      /*делаем итерацию по массиву links с пом. метода map,на каждой итерации получаем link и index(номер № ссылки) и возвращаем jsx*/
//                 return (
//                     <tr key={link._id}>     /*key - уникальный ключ*/
//                         <td>{index + 1}</td>        /*тк в массиве элементы считаются с нуля,а нам нужно вывести порядковые номера ссылок в списке*/
//                         <td>{link.from}</td>
//                         <td>{link.to}</td>
//                         <td>
//                             <Link to={`/detail/${link._id}`}>Открыть</Link>     /*кнопка позволяющая открывать ссылку*/
//                         </td>
//                     </tr>
//                 )
//             }) }
//             </tbody>
//         </table>
//     )
// }



import React from 'react'
import {Link} from 'react-router-dom'

export const LinksList = ({ links }) => {
    if (!links.length) {
        return <p className="center">Ссылок пока нет</p>
    }

    return (
        <table>
            <thead>
            <tr>
                <th>№</th>
                <th>Оригинальная</th>
                <th>Сокращенная</th>
                <th>Открыть</th>
            </tr>
            </thead>

            <tbody>
            { links.map((link, index) => {
                return (
                    <tr key={link._id}>
                        <td>{index + 1}</td>
                        <td>{link.from}</td>
                        <td>{link.to}</td>
                        <td>
                            <Link to={`/detail/${link._id}`}>Открыть</Link>
                        </td>
                    </tr>
                )
            }) }
            </tbody>
        </table>
    )
}