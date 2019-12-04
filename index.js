const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    secret: 'segredo',
    cookie: { maxAge: 600000 }
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection.authenticate().then(() => {
    console.log('Conectado no banco de dados!');
}).catch((error) => {
    console.log(error);
});

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);
/*
app.get('/session', (req, res) => {
    req.session.user = 'everton';
    req.session.useremail = 'everton@teste.com';
    req.session.users = {
        nome: 'everton',
        user: 'everton'
    }
    res.send('Sessão Gerada');
});

app.get('/read', (req, res) => {
    res.json({
        user: req.session.user,
        useremail: req.session.useremail,
        users: req.session.users
    });
});
*/

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 3
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories });
        });
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', { article: article, categories: categories });
            });
        }else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('', {articles: category.articles, categories: categories})
            });
        }else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});

app.listen(3333, () => {
    console.log('Servidor rodando!');
});