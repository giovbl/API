const express = require('express');
var cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');

require('dotenv').config()

const port = 3000;
const app = express();

const authRouter = require('./routes/auth')
const sampleRouter = require('./routes/sample')
const patientRouter = require('./routes/patient')
const shipmentRouter = require('./routes/shipment')
const refertoRouter = require('./routes/referto')
const facilityRouter = require('./routes/facility')
const userRouter = require('./routes/user')

app.use(cors({ 
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/sample',sampleRouter);
app.use('/api/patient',patientRouter);
app.use('/api/shipment',shipmentRouter);
app.use('/api/referto',refertoRouter)
app.use('/api/facility',facilityRouter)
app.use('/api/user',userRouter)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));
//Route for serving React static files
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname,'dist', 'index.html'));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`CORS origin enabled for ${process.env.CORS_ORIGIN}`);
});