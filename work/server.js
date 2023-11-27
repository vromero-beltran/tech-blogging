const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utiles/helper');
const hbs = exphbs.create({ helpers });

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

//setup session
const sess = {
    secret: 'supersecretsessionsecrettext',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 1000 * 60 * 60 * 24 * 7
    })
};

//handlebars initialization
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sess));

//use routes
app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Now Listening on ${PORT}!`);
    });
    
});