const express = require("express");
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Post = require('./models/Post')

// Config
    // Template Engine
    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
    
            allowProtoMethodsByDefault: true,
        }
    }));
    app.set('view engine', 'handlebars');
    // Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    // Rotas
        app.get('/', function(req, res){
            Post.findAll({order: [['id', 'DESC']]}).then(function(posts){
                res.render('home', {posts: posts})
            })
        })

        app.post('/cad', function(req, res){
            res.render('formulario')
        })

        app.post('/add', function(req, res){
            Post.create({
                titulo: req.body.titulo,
                conteudo: req.body.conteudo
            }).then(function(){
                res.redirect('/')
            }).catch(function(erro){
                res.send("Houve um erro: "+ erro)
            })
        })

        app.post('/deletar/:id', function(req, res){
            Post.destroy({where: {'id': req.params.id}}).then(function(){
                res.send('Postagem deletada com sucesso!')
            }).catch(function(erro){
                res.send("Essa postagem não existe! ")
            })
        })

        app.post('/edit/:id', function(req, res){
            Post.findByPk(req.params.id)
              .then(post => {
                res.render('form-edit', {
                  id: req.params.id,
                  titulo: post.titulo,
                  conteudo: post.conteudo
                })
              }).catch(function(erro){
                res.send('Post não encontrado!')
              })
          })
        app.post('/editado/:id', function(req, res){
            Post.update({
              titulo: req.body.titulo,
              conteudo: req.body.conteudo
            },
            {
              where: { id: req.params.id }
            }).then(function(){
              res.redirect('/')
            }).catch(function(erro){
                res.send("Essa postagem não existe! ")
            })
          })

app.listen(8081, function(){
    console.log("Servidor está funcionand!");
});