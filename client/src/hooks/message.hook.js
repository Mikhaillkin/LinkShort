import {useCallback} from 'react'


//экспортируем константу ,кот. возвращает коллбэк ф-цию.кот. мы также обворачиваем в хук useCallback(для того чтобы реакт не входил в цикличную рекурсию)
export const useMessage = () => {
    return useCallback((text) => {
        //если объект window.М существует и мы также передали текст,то мы показываем window.M.toast({ html: text }).Это просто небольшая обёртка чтобы нам проще было с ним взаимодействовать
        if(window.M && text) {
            window.M.toast({ html: text })
        }
    }, [])
}