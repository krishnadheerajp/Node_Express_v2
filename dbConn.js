const { Sequelize } = require("sequelize");

// DB connection
const sq = new Sequelize('nutrify', 'postgres', 'Finserv@2023', {
    host: 'localhost', 
    dialect: 'postgres'
});

sq.authenticate().then(()=>{
    console.log("DB Connection successful");
}).catch((err)=>{
    console.log(err);
});

module.exports = {sq};