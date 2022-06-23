const express = require('express');
const app = express();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (request, response) {
    response.send('Serviço API Rest iniciada...');
});


app.get("/users", async (req, res) => {
    await User.findAll({
        attributes: ['id','name', 'email','gender'],
        order:[['id','ASC']]
    })
    .then( (users) => {
        return res.json({
            erro:false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nehum Usuario encontrado!!!`
        });
    });
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findAll({ where: { id: id }})
        const users = await User.findByPk(id);
        if(!users) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro Nehum Usuario encontrado!"
            })
        }
        res.status(200).json({
            erro: false,
            users
        })
    }catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

app.post("/user", async (req, res) => {
    // const{ name, email, gender, password } = req.body;
    var dados = req.body;
    console.log(dados);
    dados.password = await bcrypt.hash(dados.password,8);
    console.log(dados.password);

    await User.create(dados)
    .then(()=>{
        return res.json({
            erro: false,
            mensagem:'Usuario cadastrado com sucesso!'
        });
    }).catch((err) => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuario não cadastrado...${err}`
        })
    })
});

app.put("/user",async (req, res) => {
    const{ id} = req.body;

    await User.update(req.body,{ where: { id}})
    .then(()=>{
        return res.json({
            erro:false,
            mensagem: "Usuario alterado com sucesso"
        })
    }).catch((err) => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuario não alterado ...${err}`
        })
    })
});

app.delete("/user/:id",async (req, res)=>{
    const {id} = req.params;
    await User.destroy({where: { id }})
    .then(()=>{
        return res.json({
            erro:false,
            mensagem: "Usuario apagado com sucesso"
        });
    }).catch(() => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        });
    });
});

app.get("/login", async (req, res) => {
    const user = await User.findOne({
        attributes: ['id','name', 'email','gender','password'],
        where: {
            email: req.body.email
        }
    })
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou senha incontrado"
        })
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem:"Erro: Usuário ou senha incorreta!!!"
        })
    }
    return res.json({
        erro:false,
        mensagem: "Login realizado com sucesso",
        user
    })
});

app.put('/user-senha', async (req, res) => {
    const { id, password } = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8);

    await User.update({password: senhaCrypt }, {where: {id: id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Senha editada com sucesso!"
        });
    }).catch ( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}... A senha não foi alterada!!!`
        })
    })
})

app.listen(process.env.PORT,() => {
    console.log(`Servico iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});

app.listen(6333);