import {Sequelize} from 'sequelize-typescript'
import dotenv from 'dotenv';

dotenv.config();


export const db = new Sequelize(process.env.URL_DB, {
    models: [__dirname + './../models/**/*'],
    logging: false,
    dialectOptions: {
        ssl: {
            require: false
        }
    }
})