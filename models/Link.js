const {Schema , model , Types} = require('mongoose')


const schema = new Schema({

   //параметр from - определяет откуда идёт данная ссылка
   from: {type: String , required: true},                   //уникальной ее не делаем,тк для бизнеса необходима задача,когда нужно закодировать одну ссылку но по разным адресам
    to: {type: String, required: true, unique:true},        //куда будет вести данная ссылка, ее сгенерированный код должен быть уникальным
    code: {type: String, required: true, unique:true},      //код(?)
    date: {type: Date, default: Date.now},                  //дата создания ссылки.   Не вызываю метод now,а передаю его как к референс(ссылку)
    clicks: {type: Number, default: 0},                     //количество кликов - мы будем вести аналитику сколько раз мы кликнули по ссылке
    owner: {type: Types.ObjectId, ref: 'User'}              //также необходимо связать ссылки с пользователем,Кот. её создал

})

module.exports = model('Link' , schema)