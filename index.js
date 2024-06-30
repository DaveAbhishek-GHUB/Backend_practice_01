const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const fs = require('fs');
const { emitWarning } = require('process');

// Set EJS as view engine
app.set('view engine', 'ejs');

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handler for the root path
app.get('/', (req, res) => {
    fs.readdir(`./files`, function(err, files){
        console.log(files);
        res.render('index', {files: files});
    })
});

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render('show', {filename: req.params.filename, filedata: filedata});
        // console.log(filedata);
    });
});

app.get('/edit/:filename', (req, res) => {
        res.render('edit', {filename:req.params.filename});
});

// this route rename the file name
app.post('/edit', (req, res) => {
    fs.rename(`./files/${req.body.oldname}`, `./files/${req.body.new}`, function(err){
        res.redirect("/");
        console.log(req.body);

    })
});

app.post('/create', function (req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.textarea, function(err){
        res.redirect("/"); 
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port 3000`);
});