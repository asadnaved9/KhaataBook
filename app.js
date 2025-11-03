const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { render } = require('ejs');

//Bolier Plate fo ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res){
    fs.readdir(`./Hisaab`, function(err, files){
        if(err) return res.status(500).send(err);
        res.render('index', {files:files});
    });
})

app.get('/create', function(req, res){
    res.render('create');
})

app.get('/edit/:filename', function(req, res){
    fs.readFile(`./Hisaab/${req.params.filename}`, 'utf-8', function(err, filedata){
        if (err) return res.status(500).send(err);
        res.render('edit', {filedata, filename: req.params.filename});
    })
})

app.post('/update/:filename', function(req, res){
    fs.writeFile(`./Hisaab/${req.params.filename}`, req.body.content, function(err){
        if(err) return res.status(500).send(err);
        res.redirect('/');
    })
})

app.get('/hisaab/:filename', function(req, res){
    fs.readFile(`./Hisaab/${req.params.filename}`, "utf-8", function(err, filedata){
        if(err) return res.status(500).send(err);
        res.render("hisaab", {filedata, filename: req.params.filename})
    })
})

app.get('/delete/:filename', function(req, res){
    fs.unlink(`./Hisaab/${req.params.filename}`, function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/")
    })
})

app.post('/createhisaab', function(req, res){
    var currentDate = new Date();
    var date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    fs.writeFile(`./Hisaab/${date}.txt`, req.body.content, function(err){
        if (err) return res.status(500).send(err);
        res.redirect('/');
    })
})

app.listen(3000);