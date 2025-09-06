import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

import authRoutes from './Routes/auth.routes.js'
import projectRoutes from './Routes/project.routes.js'

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/project", projectRoutes)

export default app