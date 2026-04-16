require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/sqliteDB');
const authRoutes = require('./src/routes/AuthRoutes');
const productRoutes = require('./src/routes/ProductRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Authentication System API is running.');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

