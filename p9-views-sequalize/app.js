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

app.post('/add-user', async (req, res) => {
    var dados = req.body;
    await User.create(dados)
        .then( () => {
            // return res.json({
            //     mensagem: "Usuário cadastrado com sucesso";
            // })
            res.redirect('/');
        }).catch( (err) => {
            return res.status(400).json({
                erro: true,
                mensagem: `Erro: Usuário não Cadastrado - ${err}`
            });
        });
});

app.listen(3333);