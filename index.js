const express = require('express');
var cors = require('cors');
const cookieParser = require('cookie-parser')

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
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/sample',sampleRouter);
app.use('/api/patient',patientRouter);
app.use('/api/shipping',shipmentRouter);
app.use('/api/referto',refertoRouter)
app.use('/api/facility',facilityRouter)
app.use('/api/user',userRouter)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});