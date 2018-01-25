const {
    ObjectID
} = require('mongodb');
const mongoose = require('../server/db/mongoose');
const {
    TodoModel
} = require('../server/models/todo');

/* TodoModel.remove({}).then((result)=>{
    console.log(result);
}); */

/* TodoModel.findOneAndRemove({text:"Hello World"}).then((res)=>{
    console.log(res);
}) */

TodoModel.findByIdAndRemove({_id:"5a6989e4c3bd04054d49d8d6"}).then((res)=>{
    console.log(res);
})