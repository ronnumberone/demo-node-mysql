const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const app = express();
const port = 4000;
const db = require('./config/db')
const fileUpload = require('express-fileupload');
const session = require('express-session');
const methodOverride = require('method-override');
const Handlebars = require('handlebars');

const route = require('./routes')

//connect to db
// db.connect();

app.use(session({
  secret: 'book-store-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

Handlebars.registerHelper('formatCurrency', function (amount) {
  if (amount) {
    return amount.toLocaleString();
  }
  return "";
});

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.userName = req.session.userName;
  res.locals.isAdmin = req.session.isAdmin;
  next();
});

app.use(fileUpload());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('uploads'));

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