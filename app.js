import express from 'express';
const app = express();
import cors from 'cors';
import routes from './routes/index.js';
import bodyParser from 'body-parser';


app.use(cors());


//middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());


app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port http://localhost:${process.env.PORT}`);
})