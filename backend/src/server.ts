import express from 'express';
import morgan from 'morgan'
import { db } from './config/db';
import colors from 'colors';
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'



async function connectDB(){
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue.bold('Database connection established'))
    } catch (error) {
        console.log(colors.red.bold('Error connecting to database'))
    }
}

connectDB()
const app = express();

app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)


export default app;