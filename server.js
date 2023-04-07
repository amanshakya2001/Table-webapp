const mysql = require('mysql');
const express = require('express');
const { error } = require('console');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'DbTable'
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
  } 
  else {
    console.log("Database connected Successfully!")
  }
});

const app = express();
app.use(express.json());
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

// To Preview All Notes on Home page
app.get('/',(request,responce)=>{
  connection.query('SELECT * FROM data;',(error, results) => {
    responce.status(200).json({data:results})
  });
})

// To change a Existing Note
app.post('/changeData',(request,responce)=>{
  let id = request.body.id;
  let data = request.body.data;

  connection.query(`UPDATE data SET value = '${data}' WHERE id = ${id}`,(error, results) => {
    if (error){
      console.log("Entry not exist");
    }
    else{
        connection.query('SELECT * FROM data;',(error, results) => {
          responce.status(200).json({"message":'Notes Changed Succefully',"data":results})
    });
    }
  });
})

// To Create a New Note
app.post('/createData',(request,responce)=>{
  let data = request.body.data;

  connection.query(`SELECT COUNT(*) as count FROM data;`,(error, results) => {
    connection.query(`Insert into data value (${results[0].count+1},'${data}')`,(error, results) => {
      if (error){
        console.log("Entry not exist");
      }
      else{
          connection.query('SELECT * FROM data;',(error, results) => {
            responce.status(200).json({"message":'Notes Insert Succefully',"data":results})
      });
      }
    });
  });
})


// Running app on 3000 Port
app.listen(3000,()=>{
  console.log("Server is running on port 3000")
})