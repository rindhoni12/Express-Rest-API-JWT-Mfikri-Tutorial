import { Sequelize } from "sequelize"

const db = new Sequelize('mfikri_jwt_auth', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

export default db