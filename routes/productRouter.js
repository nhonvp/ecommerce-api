const router = require('express').Router();
const productController = require('../controllers/productController');
const {verifyToken} = require('../middleware.js')

router.get('/',verifyToken,productController.getall);
router.get('/:id',verifyToken,productController.sub);
router.post('/',verifyToken,productController.save);
router.put('/:id',verifyToken,productController.update);
router.delete('/:id',verifyToken,productController.delete);
// router.post('/:id/reviews',productController.reviews);


module.exports = router;
