//const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb'); // This is equilant to above line



MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err,db) =>{
   if(err){
    return console.log('Unable to connect mongodb server')
   }
   console.log('connected to mongodb server');

   /*
   //getting data from mongo db server  find() brings a promise
   db.collection('Todos').find({completed:true}).toArray().then((docs) =>{
     console.log('Todos');
     console.log(JSON.stringify(docs,undefined,2));
   },(err) =>{
     console.log('Unable to fetch todos',err);
   });
   */
   /*
   //getting count of todos data from mongo db server  find() brings a promise
   db.collection('Todos').find().count().then((count) =>{
     console.log(`Todos count :  ${count}`);
   },(err) =>{
     console.log('Unable to fetch todos',err);
   });
   */
   //getting data from mongo db server  find() brings a promise Excercise
   db.collection('Users').find({name:'Harish'}).toArray().then((docs) =>{
     console.log('Todos');
     console.log(JSON.stringify(docs,undefined,2));
   },(err) =>{
     console.log('Unable to fetch todos',err);
   });


   /*
   //promise with catch useful for chaining
   db.collection('Todos').find().toArray().then((docs) =>{
     console.log('Todos');
     console.log(JSON.stringify(docs,undefined,2));
   }).catch((err) =>{
     console.log('Unable to fetch todos',err);
   });
*/
  db.close();   //if not closed when testing the console statys right there(thread stays open)
});
