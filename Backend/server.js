const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');
const authMiddleware = require('./middleware/auth');

const { router: authRouter } = require('./routes/auth');
const { router: contractsRouter } = require('./routes/contracts');
const { router: reviewRouter } = require('./routes/review');

const app = express();
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/contracts', authMiddleware, contractsRouter);
app.use('/api/contracts', authMiddleware, reviewRouter);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

