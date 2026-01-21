require('./config/env');
const express = require('express');
const path = require('path');
const cors = require('cors');
const rfidRoutes = require('./routes/rfidRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { startWorkers } = require('./workers');
const { PORT } = require('./config/env');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1', rfidRoutes);
app.use('/', adminRoutes);

// Start all workers
startWorkers();

app.listen(PORT, () => {
    console.log(`RFID API running on port ${PORT}`);
});
