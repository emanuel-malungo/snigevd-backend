import cors from 'cors';
import express from 'express';
import { swaggerDocs } from './config/swagger.config.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import schoolRoutes from './routes/schools.routes.js';
import studentRoutes from './routes/students.routes.js';
import institutionRoutes from './routes/institutions.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import permissionRoutes from './routes/permissions.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", async (req, res) => {
    res.json({ status: "OK", message: "Mpamba API is running perfectly! 🚀" });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/permissions', permissionRoutes);






// Swagger Documentation
swaggerDocs(app);
app.get("/docs", (req, res) => {res.redirect("/api-docs");});

export default app;