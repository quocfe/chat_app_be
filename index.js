import express from 'express';
import route from './src/router/index.js';
import dotenv from 'dotenv';
import connect from './src/db/connect.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './src/socket/socket.js';

app.use(
	cors({
		origin: ['https://chat-app-fe-green.vercel.app', 'http://localhost:5173'], // Thay bằng URL front-end của bạn
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức được phép
		credentials: true, // Nếu bạn sử dụng cookie
	})
);
// ok
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 5000;

route(app);

server.listen(PORT, () => {
	connect();
	console.log(`server running on port ${PORT}`);
});
