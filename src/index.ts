import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import user from './services/user.service';
import Router from 'express';



const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || '3333';
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.use('/user', user);
// Test route
app.use('/ok', Router().get('/', async (_, res) => { return res.sendStatus(200); }))

const server = app.listen(port, () => {
    console.log(`Servidor iniciado e ouvindo na porta ${port}`);
})

function closeServer(): void {
    server.close();
}

export { server, closeServer }