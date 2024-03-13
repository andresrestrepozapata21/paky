import Sequelize from 'sequelize'

export const sequelize = new Sequelize('paky', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
})