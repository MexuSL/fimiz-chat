import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    dialect: process.env.ENV == "development" ? "postgres" : "postgres",
    database:process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    port:Number(process.env.DB_PORT),
});
export default sequelize;
