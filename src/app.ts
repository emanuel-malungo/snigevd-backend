import cors from 'cors';
import express from 'express';
import { swaggerDocs } from './config/swagger.config.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import schoolRoutes from './routes/schools.routes.js';
import studentRoutes from './routes/students.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", async (req, res) => {
    res.json({ status: "OK", message: "Mpamba API is running perfectly! 🚀" });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/schools', schoolRoutes);
app.use('/students', studentRoutes);





// Swagger Documentation
swaggerDocs(app);
app.get("/docs", (req, res) => {res.redirect("/api-docs");});

export default app;