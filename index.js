'use strict';

let log = console.log;

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const nunjucks = require('nunjucks');
const parseurl = require('parseurl');
const session = require('express-session');
const cookieSession = require('cookie-session');
const md5 = require('md5');
const {db,} = require('./pgp');

//------------body parser---------------
app.use(bodyParser.urlencoded({
    extended: true
}));


//---------View Template Engine -------------
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    cache: false
});

//const users = require('./routes/register');

app.engine('html', nunjucks.render);
app.set('view engine', 'html');


app.get('/', function (req, res) {
    res.render('login.html');
});

//-------routes login----------------
app.post('/login', function (req, res) {
    let u = req.body.username;
    let w = req.body.password;
    db.one("SELECT * FROM user1 WHERE username = '$1#' and password = '$2#'", [u, w])
        .then(user1 => {
            console.log('Success');
            res.render('login.html')
        })
        .catch(error => {
            res.render('register.html');
        });
});

//-------routes logout----------------
app.post('/register', function (req, res) {
    //console.log(req.body);
    let u = req.body.username;
    let w = req.body.password;
    //console.log('ELECT * FROM user1 WHERE username='+ req.body +'');
   //console.log("SELECT * FROM user1 WHERE username = "+u+" and password = "+w+);
    db.one("SELECT * FROM user1 WHERE username = $1 and password = $2", [u, w])
        .then(user1 => {
            console.log('Success');
            res.render('login.html')
        })
        .catch(error => {
            //res.json({abd: 123})
            res.render('register.html');
        });
});
//-------------md5------------
app.get('/register', function (req, res) {
    let u = req.body.username;
    const password = 'nhan';
    const crypto = require('crypto');
    //console.log(crypto.createHash('md5').update(password).digest('hex'));
    let v = crypto.createHash('md5').update(password).digest('hex');
    db.query("INSERT INTO user1 (username, password) VALUE ($1,$2)",[u,v])
    //db.none('INSERT INTO user1(user_id, username, password) VALUES(${user_id}, ${username}, ${password})', user1_insert)
        .then(() => {
            console.log('Insert Success');
        })
        .catch(error => {
            res.json({
                success: false,
                error: error.message || error
            });
        });
});

//module.exports = app;
//--------app.listen------------------
const port = 5000;
app.listen(port, () => {
    console.log('Ready for GET requests on http://localhost:' + port);
});
