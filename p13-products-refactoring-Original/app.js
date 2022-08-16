const express = require('express');
const app = express();
require('dotenv').config();

const router = require('./routes/index');

const Categories = require('./models/Categories');
const Products = require('./models/Products');
const User = require('./models/User');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (request, response) {
    response.send('Serviço API Rest iniciada...');
});

app.use(router);

app.listen(process.env.PORT,() => {
    console.log(`Servico iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});