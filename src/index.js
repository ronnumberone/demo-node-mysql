const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const app = express();
const port = 4000;
const db = require('./config/db')

const route =require('./routes')

//connect to db
// db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

//template engine
app.engine('hbs', engine({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources\\views'));

//route init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})