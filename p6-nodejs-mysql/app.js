const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'senac'
})

connection.connect( function (err) {
    console.log("Conexão com o banco de dados realizado com sucesso!");
    console.log(`Conexão ${connection.threadId}`);
})

connection.query('SELECT * FROM users', function (err, rows, fields) {
    if (!err){
        console.log('Resultado: ', rows);
    } else {
        console.log(`Erro consulta: ${err}`);
    }
})

//Cadastrar novo registro no banco de dados

connection.query(" INSERT INTO users (name, email, gender) VALUES ('Aluna', 'emial@gmail.com', 'F')", (err, result) => {
    if(!err) {
        console.log('Usuário cadastrado com sucesso!');
    } else {
        console.log(`Erro cadastro usuário ${err}`);
    }
})