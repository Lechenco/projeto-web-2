let express = require('express'),
   router = express.Router(),
   Users = require('../model/Users'),
   Posts = require('../model/Posts'),
   crypto = require('crypto'),
   multer = require('multer'),
   path = require('path'),
   GridFsStorage = require('multer-gridfs-storage');

   router.get('/', function(req, res, next) {
    if (req.session.userId) {
        
        Users.findOne(req.session.userId).then((user) => {
            if (user && user.endereco) {
                res.render('uploads', {user});
            }

        })
    } else {
        res.redirect('/');
    }
});



const storage = new GridFsStorage({
url: 'mongodb://localhost:27017/projeto-web2',
file: (req, file) => {
    return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
        if (err) {
        return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        console.log(path)
        const fileInfo = {
        filename: filename,
        bucketName: 'posts.imagem'
        };
        resolve(fileInfo);
    });
    });
}
});
const upload = multer({ storage });

router.post('/imagem',  upload.single('file'), (req, res, next) => {
if(req.session.userId) {
    Users.findOne(req.session.userId).then((user) => {
    res.redirect('/feed')
    })
}
else{ res.send("não cadastrado"); }
})

module.exports = router;
