const express = require('express');
var cors = require('cors');
const cookieParser = require('cookie-parser')

const port = 3000;
const app = express();

const authRouter = require('./routes/auth')
const sampleRouter = require('./routes/sample')
const patientRouter = require('./routes/patient')
const shippingRouter = require('./routes/shipping')
const refertoRouter = require('./routes/referto')
const facilityRouter = require('./routes/facility')

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/sample',sampleRouter);
app.use('/api/patient',patientRouter);
app.use('/api/shipping',shippingRouter);
app.use('/api/referto',refertoRouter)
app.use('/api/facility',facilityRouter)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});