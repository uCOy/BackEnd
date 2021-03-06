// https://expressjs.com/pt-br/starter/hello-world.html

const express = require('express'); // Puxando a dependencia que foi instalada (package.json)

const app = express();
const port = 4500; // Porta padrão da web é 8080

app.get("/", function (req, res) { // request, response (req, res)
    res.send("Página Inicial do Serviço");
});

app.get("/sobre-empresa", (req, res) => {
    res.send("Página Sobre a Empresa do App");
});

app.get("/contato", (req, res) => {
    res.send("Página de Contato do App");
});

app.listen(port, () => {
    console.log(`Servidor Iniciado na Porta ${port}: "http://localhost:${port}"`);
});