const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://snaadira:previous@cluster0-b9w2x.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "previous-express";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});
 // anything with app is express
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// render: and pass in message + result,  messages are objects
  // ejs spits out html, html sent out
  // passing an object to ejs template, messages is a property, you create word in messages
  // messages or whatever gets sent to the ejs and called by ejs
  app.get('/', (req, res) => {
    db.collection('todos').find().toArray((err, result) => {
      if (err) return console.log(err)

      res.render('index.ejs', {todoList: result})
    })
  })

  // sends todos to the data base
  app.post('/todos', (req, res) => {
    db.collection('todos').save({todo: req.body.todo}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database', result)
      res.redirect('/')
    })
  })
  // put= updates the do w/ the class completed
    app.put('/todos', (req, res) => {
      db.collection('todos')
      .findOneAndUpdate({todo: req.body.todo}, {
        $set: {
          completed:req.body.completed
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    //clear completed deletes only items with class complete
    app.delete('/clearCompleted', (req, res) => {

      db.collection('todos').deleteMany({completed:true},
        (err, result) => {
          console.log('result', result)
        if (err) return res.send(500, err)
        res.send('Message deleted!')
         //db.close();
      })
    })

    app.delete('/clearAll', (req, res) => {

     db.collection('todos').deleteMany({},
       (err, result) => {
         console.log('clear all')
       if (err) return res.send(500, err)
       res.send('Messages deleted!')
     })
   })
