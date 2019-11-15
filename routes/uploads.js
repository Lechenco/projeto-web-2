let express = require('express'),
   router = express.Router(),
   Users = require('../model/Users'),
   Posts = require('../model/Posts'),
   crypto = require('crypto'),
   path = require('path'),
   {uri} = require('../model/config'),
   multer = require('multer'),
   Grid = require('gridfs-stream'),
   mongoose = require('mongoose'),
   GridFsStorage = require('multer-gridfs-storage');

   router.get('/', function(req, res, next) {
    if (req.session.userId) {
        
        Users.findOne(req.session.userId).then((user) => {
            if (user && user.endereco) {
                res.render('uploads', {user});
            }
        });
    } else {
        res.redirect('/');
    }
});

const conn = mongoose.createConnection(uri);

const storage = new GridFsStorage({
url: uri,
file: (req, file) => {
    if (!file) return;
    return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
        if (err) {
            return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
            filename: filename,
            bucketName: 'posts.imagem'
        };
        resolve(fileInfo);

        let post = new Posts({
            imagem: filename,
            descricao: req.body.description ? req.body.description : "",
        });
        post.save();
    });
    });
}
});
const upload = multer({ storage });

let gfs

conn.once('open', function(){
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('posts.imagem');
})

router.get('/:nome', (req, res) => {
    gfs.files.findOne({filename: req.params.nome}, (err, file) => {
        if (!file) return res.status(404).json({ err: 'nao achou'});
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        }
    })

})

router.post('/imagem',  upload.single('file'), (req, res, next) => {
if(req.session.userId) {
    // Users.findOne(req.session.userId).then((user) => {
    if (!req.body.file) {
        let posts = new Posts({
            descricao: req.body.description,
        });
        posts.save().then(() => res.redirect('/'));
    }
    res.redirect('/');
    // })

}
else{ res.send("não cadastrado"); }
})

module.exports = router;
