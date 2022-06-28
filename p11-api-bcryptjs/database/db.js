const Sequelize = require('sequelize');

const sequelize = new Sequelize('senac', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// const sequelize = new Sequelize('u594655419_senac', 'u594655419_owa', 'Senac2022@dmin', {
//     host: 'sql408.main-hosting.eu',
//     dialect: 'mysql'
// });

// const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
// });

sequelize.authenticate().then( function() {
    console.log('Conexão com o banco de dados realizada com sucesso!');
}).catch( function (err){
console.log(`Erro Conexão: ${err}`)
});

module.exports = sequelize;