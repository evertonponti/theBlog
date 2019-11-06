const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');

router.get('/admin/articles', (req, res) => {
    res.send('');
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', { categories: categories });
    });
});

router.post('/articles/save', (req, res) => {
    console.log(title);
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    if(title != undefined && body != undefined){
        console.log(category);
        Article.create({
            title: title,
            body: body,
            category: category
        }).then(() => {
            res.redirect('/admin/articles');
        });
    }else{
        res.redirect('/admin/articles/new');
    }
});

module.exports = router;