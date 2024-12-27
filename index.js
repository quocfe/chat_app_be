import express from 'express';
import route from './src/router/index.js';
import dotenv from 'dotenv';
import connect from './src/db/connect.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './src/socket/socket.js';

app.use(cors());
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 5000;

route(app);

server.listen(PORT, () => {
	connect();
	console.log(`server running on port ${PORT}`);
});
