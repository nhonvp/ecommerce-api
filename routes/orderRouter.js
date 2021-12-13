const router = require('express').Router();
const orderController = require('../controllers/orderController');

router.get('/',orderController.getlist);
router.get('/summary',orderController.summary);
router.get('/mine',orderController.mine);
router.post('/',orderController.orderitem);
router.get('/:id',orderController.allorder);
router.put('/:id/pay',orderController.payorder);
router.delete('/:id',orderController.deleteorder);
router.put('/:id/deliver',orderController.deliver);


module.exports = router;
