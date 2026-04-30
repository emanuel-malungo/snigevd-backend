import cors from 'cors';
import express from 'express';
import { swaggerDocs } from './config/swagger.config.js';
import authRoutes from './routes/auth.routes.js';

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



// Swagger Documentation
swaggerDocs(app);
app.get("/docs", (req, res) => {res.redirect("/api-docs");});

export default app;