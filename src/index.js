import express from 'express'; 
import Router from './routes/route.js';
import Connection from './database/db.js';
import bodyParser from 'body-parser';
import cors from 'cors';

//Write both line together
import dotenv from 'dotenv';
dotenv.config();


const app=express();
app.use(
    cors({
      origin: ["http://localhost:3000","https://weblog-task-app.onrender.com"],
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
//app.use(cors());
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',Router);


const PORT=process.env.PORT || 8008;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;

const URL=`mongodb://${USERNAME}:${PASSWORD}@ac-gb3bzox-shard-00-00.ebsmxku.mongodb.net:27017,ac-gb3bzox-shard-00-01.ebsmxku.mongodb.net:27017,ac-gb3bzox-shard-00-02.ebsmxku.mongodb.net:27017/?ssl=true&replicaSet=atlas-1huc15-shard-0&authSource=admin&retryWrites=true&w=majority`;

Connection(URL);

//origin: "http://localhost:3000",
