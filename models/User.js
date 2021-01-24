//Модель User.js
//Сущность работающая с пользователями


const {Schema , model , Types} = require('mongoose')   //для создания модели импортируем из mongoose Schema и функцию model

//Далее создаем schema через констукртор класса Schema
const schema = new Schema({
    //поля для пользователя
    email: {type:String, required: true , unique : true},
    password: {type:String, required: true},
    links: [{ type: Types.ObjectId , ref: 'Link' }]     //{ } - описание модели в фигурных скобках, тип для ссылок особенный - это ObjectId кот. определен в mongodb
                                          //это просто связка получается модели пользователя и определенных записей в БД
                                          //значение ref - то к какой коллекции мы привязываемся(Link - модель)
})

module.exports = model('User' , schema)     //импортируем из файла результат работы функции model,где мы даем название нашей модели и
                             //схема по кот. он работает - это объект schema

