const Order = require('../models/orderModel');
const User = require('../models/userModels');

module.exports.getlist = async function(req,res){
    const seller = req.query.seller || '' ;
    const sellerFilter = seller ? {seller} : {};
    const orders = await Order.find({...sellerFilter}).populate('user','name');
    res.send(orders);
  
}
module.exports.summary = async function(req,res){
  const orders = await Order.aggregate([
    {
      $group : {
        _id : null,
        numOrders : { $sum: 1},
        totalSales : { $sum : 'totalPrice'}
      }
    }
  ]);
  const users = await User.aggregate([
    {
      $group : {
        _id : null,
        numUsers : { $sum : 1},
      }
    }
  ]);
  const dailyorders = await Order.aggregate([
    {
      $group :{
        _id : { $dateToString : { format :'%Y-%m-%d', date : '$createAt' }},
        orders : {$sum : 1},
        sales : {$sum : '$totalPrice'},

      }
    },
    {
      $sort : { _id :1 },
    }
  ])
  const productCategories = await Product.aggregate([
    {
      $group : {
        _id : '$category',
        count : { $sum : 1}
      }
    }
  ])
  res.send({ users,orders,productCategories,dailyorders});
}
module.exports.mine = async function(req,res){
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
}
module.exports.orderitem = async function(req,res){
  try {
    if(req.body.orderItems.length === 0){
      res.status(400).send({message : 'Cart is empty'});
    }else {
      const order = new Order({
        seller : req.body.orderItems[0].seller,
        orderItems : req.body.orderItems,
        shippingAddress : req.body.shippingAddress,
        paymentMethod : req.body.paymentMethod,
        itemsPrice : req.body.itemsPrice,
        shippingPrice :req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice :req.body.totalPrice,
        user : req.user._id
      })
      const createorder = await Order.save();
      res.status(201).send({message : 'New Orderd Created', order : createorder});
    }
  } catch (error) {
    
  }
}
module.exports.allorder = async function(req,res){
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
}
module.exports.payorder = async function(req,res){
  const order = await Order.findById(req.params.id).populate('user','email name');
  if(order) {
    order.isPaid = true,
    order.paidAt = Date.now(),
    order.paymentResult = {
      id :  req.body.id,
      status : req.body.status,
      update_time : req.body.update_time,
      email_address : req.body.email_address
    }
    const updateorder = await Order.save();
  }else {
    res.status(404).send({message : 'Order Not Found'});
  }
  
}
module.exports.deleteorder = async function(req,res){
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
}
module.exports.deliver = async function(req,res){
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
}
