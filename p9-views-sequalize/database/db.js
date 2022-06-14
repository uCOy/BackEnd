const Sequelize = require('sequelize');

const sequelize = new Sequelize('senac', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then( function() {
    console.log('Conexão com o banco de dados realizada com sucesso!');
}).catch( function (err){
console.log(`Erro Conexão: ${err}`)
});

module.exports = sequelize;