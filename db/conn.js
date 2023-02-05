const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts2', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
})

try {
    sequelize.authenticate()
    console.log('conectado com sucesso')
} catch (error) {
    console.log(`não foi possível conectar: ${error}`)
}

module.exports = sequelize