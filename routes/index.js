let express = require('express'),
   router = express.Router(),
   Users = require('../model/Users'),
   Post = require('../model/Posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.userId) {
    // res.redirect('/feed');
  }
  Post.find({}, {}, 10).then((files)=>{
    res.render('index', {posts: files});
  })
});

router.get('/search', (req, res, next) => {
  let q = req.query.query ? 
      {descricao: new RegExp(`.*${req.query.query}.*`, 'i')} : {};
  Post.find(q, {}, 10).then((files)=>{
    console.log(files);
    res.render('index', {posts: files});
  })
});

router.get('/live-search', (req, res, next) => {
  let q = req.query.value ? 
      {descricao: new RegExp(`.*${req.query.value}.*`, 'i')} : {};
  
  Post.find(q, {}, 10).then((posts) => {
    let descricoes = posts.map((elem) => elem.descricao);
    res.json(descricoes);
  });
});

router.get('/login', function(req, res, next) {
  if (req.session.userId) {
    res.redirect('/feed');
  }
  res.render('login');
});

router.post('/login', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.render('login', {error: 'Preencha todos os campos'});
  } else {
    let q = {nome: req.body.username, senha: req.body.password};
    Users.find(q, {nome: 1}, 1).then((user) => {
      if (user) {
        req.session.userId = user[0]._id;
        req.session.save((err) => {
        res.redirect('/feed');
        })
      }
      else {
        res.render('login', {error: 'Usuario ou senha inválida!'});
      }
    });
  }
});

router.post('/cadastrar', function(req, res, next) {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.render('index', {error: 'Preencha todos os campos'});
  } else {
    let q = {$or: [{email: req.body.email}, {nome: req.body.username}] };
    Users.find(q, {nome :1}, 1).then((users) => {
      if (users.length >= 1) {
        res.render('index', {error: 'Email ou usuário já cadastrado'});
      } else {
        let user = new Users({});
        user.nome = req.body.username;
        user.email = req.body.email;
        user.senha = req.body.password;
      
         user.save().then((user) => {
          req.session.userId = user.ops[0]._id;
          req.session.save(() => res.redirect('/feed'));
         }); 
      }
    }).catch((err) => console.log(err));
  }
})

router.get('/endereco', (req, res, next) => {
  if (req.session.userId) {
    res.render('enderecoForm');
  } else {
    res.redirect('/');
  }
})

router.post('/endereco', (req, res, next) => {
  if (req.session.userId) {
    Users.findOne(req.session.userId).then((user) => {
        user.endereco = {
          endereco: req.body.rua,
          numero: req.body.numero,
          bairro: req.body.bairro,
          cidade: req.body.cidade
        };
        user.admin = req.body.adm
        user.save().then(() => res.redirect('/feed'));
    });
  } else {
      res.redirect('/');
  }
});

router.get('/logout', (req, res, next) => {
  req.session.userId = undefined;
  res.redirect('/');
})


module.exports = router;
