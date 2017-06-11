const MognoClient = require('mongodb').MongoClient;

MognoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err,db) =>{
   if(err){
    return console.log('Unable to connect mongodb server')
   }
   console.log('connected to mongodb server');
   //insert first todo
  //  db.collection('Todos').insertOne({
  //    text: 'First todo',
  //    completed : false
  //  },(err,result) =>{ //insertOne take two objects
  //      if(err){
  //        return console.log('Unable to insert todo',err)
  //      }
  //      console.log(JSON.stringify(result.ops,undefined, 2)) //ops object store all the documents that were inserted
  //  });
  //insert user
  db.collection('Users').insertOne({
    name: 'Harish',
    age : 30
  },(err,result) =>{ //insertOne take two objects
      if(err){
        return console.log('Unable to insert user',err);
      }
      console.log(JSON.stringify(result.ops,undefined, 2)); //ops object store all the documents that were inserted
  });

   db.close();
});
