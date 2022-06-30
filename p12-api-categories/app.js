const express = require('express');
const app = express();
const Categories = require('./models/Categories');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (request, response) {
    response.send('Serviço API Rest iniciada...');
});


app.get("/categories", async (req, res) => {
    await Categories.findAll({
        attributes: ['id','name', 'description'],
        order:[['id','ASC']]
    })
    .then( (categories) => {
        return res.json({
            erro:false,
            categories
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nehum Usuario encontrado!!!`
        });
    });
});

app.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findAll({ where: { id: id }})
        const categories = await Categories.findByPk(id);
        if(!categories) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro Nehum Usuario encontrado!"
            })
        }
        res.status(200).json({
            erro: false,
            categories
        })
    }catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

app.post("/categories", async (req, res) => {
    // const{ name, email, gender, password } = req.body;
    var dados = req.body;
    console.log(dados);
    // dados.password = await bcrypt.hash(dados.password,8);
    // console.log(dados.password);

    await Categories.create(dados)
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


app.put("/categories",async (req, res) => {
    const{ id} = req.body;

    await Categories.update(req.body,{ where: { id}})
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

app.delete("/categories/:id",async (req, res)=>{
    const {id} = req.params;
    await Categories.destroy({where: { id }})
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

// app.listen(6333);

app.listen(process.env.PORT,() => {
    console.log(`Servico iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});