const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const PORT = process.env.PORT;

//mongo 

const mongoose = require('mongoose');

main().catch(err => console.log(err));

let FruitModel;
async function main() {
  await mongoose.connect(process.env.MONGO_URL);

  const fruitSchema = new mongoose.Schema({
    name: String,
    image : String,
    price : String,
    email: String
  });
   FruitModel = mongoose.model('Fruit', fruitSchema);
}

//functions

function getFruits(req,res){
    axios
    .get('https://fruit-api-301.herokuapp.com/getFruit')
    .then(result =>{
        res.send(result.data.fruits)
    })
    .catch(err=>console.log('error'))
}

async function addFruit(req,res){
    const {name , image , price , email} = req.body;
    await FruitModel.create({name , image , price , email},(err,result)=>{
        if(err)
        console.log('error');
        else{
            FruitModel.find({email:email},(err,result)=>{
                if(err)
                console.log('error');
                else
                res.send(result);
            })
        }
    })
}

function gettingFruitsFromDb(req,res){
    const email = req.query.email;
    FruitModel.find({email:email},(err,result)=>{
        if(err)
        console.log('error');
        else
        res.send(result);
    })
};

function updateFlower(req,res){
    const flowerId = req.params.id;
    const{name, image,price,email}=req.body;
    FruitModel.findByIdAndUpdate(flowerId,{name, image,price,email},(err,result)=>{
        if(err)
        console.log('error');
        else{
            FruitModel.find({email:email},(err,result)=>{
                if(err)
                console.log('error');
                else
                res.send(result);
            })
        }
    })
};

function deleteFlower(req,res){
    const id = req.params.id;
    const email=req.query.email;
    FruitModel.deleteOne({_id:id},(err,result)=>{
        if(err)
        console.log('error');
        else{
            FruitModel.find({email:email},(err,result)=>{
                if(err)
                console.log('error');
                else
                res.send(result);
            })
        }
    })
};

//servers

server.get('/fruits', getFruits);

server.post('/fruits',addFruit);

server.get('/getFruits',gettingFruitsFromDb);

server.put('/flowers/:id',updateFlower);

server.delete('/flowers/:id',deleteFlower)

server.listen(PORT,()=> console.log(`listening on ${PORT}`));