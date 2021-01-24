import {useState,useCallback} from 'react'// хук с библиотеки реакта


//экспортируем хук useHttp,который позволяет в кофмфортном режиме работать с асинхр-ыми хапросами на сервер,используя нативный api браузера fetch, только уже в формате хуков
export const useHttp = () => {
    //данный хук позволяет нам взаимодействовать с сервером,он будет экспортировать определенные сущности,кот. мы сгруппируем в данном модуле
    //этие сущности работают с сервером и конкретно это будет ф-ция,кот. позволяет делать запрос
    // state:Loading - если будет происходить процесс загрузки и выводиться потенциальные ошибки,если они будут
    const [loading , setLoading] = useState(false)  //state loading,кот. по ум. false, setLoading - ф-ция
    //т.е внутри этого хука мы сами определяем грузится у нас что-то с сервера или нет
    const [error , setError] = useState(null)
    const request = useCallback(async (url , method = 'GET' , body = null , headers = {}) => {
        //чтобы корректно сформировать ф-цию request необходимо обернуть в хук useCallback(для того чтобы раект не входил в рекурсию)
        //добавляем блок try catch,тк будет работать с оператором async awayt
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)     //стрингифаем бади(т.е. email и password),когда передаём его в request
                //в случае если body есть,добавляем header
                headers['Content-Type'] = 'application/json'//когда мы работаем с json, нам нужно явно указать что мы передаем по сети json,и деляется это с пом. объекта headers
            }


            //fetch() - браузерный метод
            const response = await fetch(url , {method , body , headers})    //принимаемый 2-ым аргументом набор опций
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так')
            }

            setLoading(false)

            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    } , []) //2-ой принимаемый параметр useCallback - это набор зависимостей

    const clearError = useCallback(() => setError(null), [])     //ф-ция чистящая ошибки

    return { loading,request,error, clearError }  //возвращаем объект(loading - флаг,request - ф-ция)
}