const express = require('express');
const {engine} = require('express-handlebars');
const app = express();

const User = require('./models/User');
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extend: false}));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extend: true}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('list-users');
});

app.get('/add-user', (req, res) => {
    res.render('add-user');
});

app.post('/add-user', (req, res) => {
    var dados = req.body;
    console.log(dados)
})

app.listen(3333);