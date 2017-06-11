//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb'); // This is equilant to above line



MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err,db) =>{
   if(err){
    return console.log('Unable to connect mongodb server')
   }
   console.log('connected to mongodb server');

/*
   //deleteMany
   db.collection('Todos').deleteMany({text:"Second todo"}).then((result) =>{
     console.log(result);
   })
*/

  /*
   //deleteOne
   db.collection('Todos').deleteOne({text:"Eat lunch"}).then((result) =>{
     console.log(result);
   })
*/
   //findOne and delete

   /*
   db.collection('Todos').findOneAndDelete({completed : false}).then((result) =>{
     console.log(result);
   })
   */

   //Challenges
   /*
   //deleteMany
   db.collection('Users').deleteMany({name:"Harish"}).then((result) =>{
     console.log(result);
   });
   */
   //deleteOne
   db.collection('Users').findOneAndDelete({ _id:new ObjectID("593cb540da86a7707ef5ca1e")}).then((result) =>{
     console.log(result);
   })

  db.close();   //if not closed when testing the console statys right there(thread stays open)
});
