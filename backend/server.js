import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();  
const port = process.env.PORT || 3000;

app.use(express.json());    






