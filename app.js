import express from 'express';

import Admin from './routes/admin.js';
import Home from './routes/home.js';
import Student from './routes/student.js';
import Payment from './routes/payment.js';
import ApiPoint from './routes/api-point.js';
import MetaAgent from './routes/meta-agent.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', Home);
app.use('/payment', Payment);
app.use('/student', Student);
app.use('/admin', Admin);
app.use('/api', ApiPoint);
app.use('/meta', MetaAgent);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
