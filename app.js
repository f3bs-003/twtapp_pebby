const express = require('express');
const bodyParser = require('body-parser');

const userRoute = require('./routes/userRoute');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.get('/', function(req, res){
    res.send("Phoebe Marie Vinas, STUDENT");
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});