//natives
const express = require('express');
const router = express.Router();

const multer  = require('multer');
const multerConfig = require('../config/multer');

var upload = multer(multerConfig);

//controllers
const index_controller = require('../controllers/index');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Sistemas Seguros', result: '' });
});

/* GET gerador de chave. */
router.get('/gerarChave', index_controller.getGerarChaves);

router.get('/DecriptyKey', index_controller.DecriptyKey);

router.get('/DecriptyKeyB', index_controller.DecriptyKeyB);

router.get('/EncriptyKey', index_controller.EncriptyKey);

/* POST enviar form. */
router.post('/', upload.single('arquivo'), index_controller.post);

module.exports = router;