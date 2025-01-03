import express from 'express';
import route from './src/router/index.js';
import dotenv from 'dotenv';
import connect from './src/db/connect.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './src/socket/socket.js';
import fs from 'fs';
import path, { dirname } from 'path';
import YAML from 'yaml';
import swaggerUI from 'swagger-ui-express';
import { fileURLToPath } from 'url';

app.use(
	cors({
		origin: '*', // Thay bằng URL front-end của bạn
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức được phép
		credentials: true, // Nếu bạn sử dụng cookie
	})
);
// ok
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

route(app);

server.listen(PORT, () => {
	connect();
	console.log(`server running on port ${PORT}`);
});
