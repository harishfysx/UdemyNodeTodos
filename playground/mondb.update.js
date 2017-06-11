//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb'); // This is equilant to above line



MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err,db) =>{
   if(err){
    return console.log('Unable to connect mongodb server')
   }
   console.log('connected to mongodb server');

/*
   //findOneAndUpdate
   db.collection('Todos').findOneAndUpdate({_id : new ObjectID("593d472dc563f96f150c88dc")},
                              {$set : {completed : true}},{returnOriginal : false}).then((result) =>{
                                    console.log(result);
   })
*/
   //Challenge
   db.collection('Users').findOneAndUpdate({_id : new ObjectID("593cb279639a86706bdd8817")},
                              {$inc : {age : 1}},{returnOriginal : false}).then((result) =>{
                                    console.log(result);
   })




  db.close();   //if not closed when testing the console statys right there(thread stays open)
});
