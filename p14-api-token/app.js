const express = require('express');
var cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const User = require('./models/User');
require('dotenv').config();
const sendMail = require('./providers/mailProvider');
const { userCreateMailTemplate } = require('./template/userCreateMail');
const { validarToken } = require('./middlewares/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    app.use(cors());
    next();
})

app.get("/", function (request, response) {
    response.send("Serviço API Rest iniciada...");
})

app.get("/users", validarToken, async (req, res) =>{
    await User.findAll({
        attributes: ['id', 'name', 'email', 'gender'],
        order:[['name', 'ASC']]
    })
    .then( (users) =>{
        return res.json({
            erro: false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Usuário encontrado!!!`
        })
    })


})

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findAll({ where: {id: id}})
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            users
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

app.post("/user", validarToken, async (req, res) => {

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
    .then( ()=>{
        /* enviar e-mail */
        // let to = dados.email;
        // let cc = '';
        // subject = 'Sua conta foi criada com sucesso!';
        
        // let mailBody = userCreateMailTemplate({
        //     name: dados.name, 
        //     email: dados.email, 
        //     gender: dados.gender
        // })
        // sendMail(to, cc, subject, mailBody);
        /* ************* */

        return res.json({
            erro: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário não cadastrado... ${err}`
        })
    })
})

app.put("/user", async (req, res) => {
    const { id } = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário alterado com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não alterado ...${err}`
        })
    })
})

app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Usuário apagado com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        });
    });
});

app.post("/login", async (req, res) => {
    
    await sleep(3000);
    function sleep(ms){
        return new Promise( (resolve) => {
            setTimeout(resolve,ms)
        })
    }

    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'gender', 'password'],
        where: {
            email: req.body.email
        }
    })
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem:"Erro: Email ou senha incorreta!!"
        })
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Email ou senha incorreta!!!"
        })
    }

    var token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 600 // 10min
        // expiresIn: 60 // 1min
    });

    return res.json({
        erro:false,
        mensagem: "Login realizado com sucesso!!!",
        token
    })
})

app.put('/user-senha', async (req, res) => {
    const {id, password } = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8);

    await User.update({password: senhaCrypt }, {where: {id: id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Senha edita com sucesso!"
        }); 
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}... A senha não foi alterada!!!`
        })
    })
})

app.get('/validaToken', validarToken, async (req, res) =>{
    await User.findByPk(req.userId, { 
        attributes: ['id','name','email']
    }).then( (user) => {
        return res.status(200).json({
            erro: false,
            user
        })
    }).catch( () => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário realizar o login!"
        })
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});

// app.listen(6333);