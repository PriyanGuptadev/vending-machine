import express from 'express';
import bodyParser from 'body-parser';
import vendingRoutes from './routes/vendingRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/api', vendingRoutes);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vending Machine API',
      version: '1.0.0',
      description: 'API documentation for the Vending Machine backend',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api', (req, res) => {
  res.send('Vending Machine API is running');
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
export default app;