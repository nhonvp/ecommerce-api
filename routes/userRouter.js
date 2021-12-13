const router = require('express').Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middleware.js')

router.post('/login',userController.login);
router.post('/register',userController.register);
router.get('/:id',verifyToken,userController.user);
router.get('/',verifyToken,userController.getall);
router.delete('/:id',verifyToken,userController.delete);
router.put('/:id',verifyToken,userController.update);
router.get('/stats',userController.stats);

module.exports = router;
