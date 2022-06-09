const express = require('express'); // Puxando a dependencia que foi instalada (package.json)

const app = express();
const port = 3333; // Porta padrão da web é 8080

const contatos =['Andre', 'Willy', 'Samuel', 'Richard'];

app.use(express.json());

app.get("/", (req, res) => {
    res.send("App Iniciando!!!");
})

app.get("/contatos", (req, res) => {
    return res.json(contatos);
})

app.get("/users/:id", (req, res) => {
    const {id} = req.params;
    const {sit, vacinado} = req.query;

    return res.json({
        id,
        nome:"Theo",
        email:"theo@sp.senac.br",
        sit,
        vacinado
    })
});

app.post("/contatos", (req, res) => {
    const {nome} = req.body;
    
    contatos.push(nome);

    return res.json(contatos);
});

app.delete("/users/:id", (req, res) => {
    contatos.pop();
    return res.json(contatos);
});

app.listen(port, () => {
    console.log(`Servidor Iniciado na Porta ${port}: "http://localhost:${port}"`);
});