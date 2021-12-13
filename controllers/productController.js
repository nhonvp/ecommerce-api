const User = require('../models/userModels');
const Product = require('../models/productModels');

module.exports.getall = async function (req, res) {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports.sub = async function (req, res) {
  // try {
  //   const product = await Product.findById(req.params.id).populate('seller',
  //     'seller.name seller.logo seller.description seller.rating seller.numReviews'
  //   )
  //   if (product) {
  //     res.send(product);
  //   } else {
  //     res.status(404).send({ message: 'Product Not Found' });
  //   }
  // } catch (error) {
  //   res.status(500).send('Failure');
  // }
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
}
module.exports.save = async function (req, res) {
  try {
    const product = new Product(req.body);
    const newproduct = await product.save();
    res.status(400).send(newproduct);
  } catch (error) {
    res.status(500).send('Failure');
  }
}
module.exports.update = async function (req, res) {
  try {
    const updateproduct = await Product.findById(req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.send({ message: 'Product Update Succes', product: updateproduct });
  } catch (error) {
    res.status(500).send('Failure');
  }
}
module.exports.delete = async function (req, res) {
  const productdelete = await Product.findById(req.params.id);
  if (productdelete) {
    await productdelete.remove();
    res.send({ message: 'Delete Product Success', })
  } else {
    res.status(404).send('Product Not Found');
  }
}
// module.exports.reviews = async function (req, res) {
//   try {
//     const product = await Product(req.params.id);
//     if (product) {
//       if (product.reviews.find((x) => x.name === req.user.name)) {
//         return res.status(400).send('You are submmit a rewviews');
//       }
//       const reviews = {
//         name: req.user.name,
//         comment: req.body.comment,
//         rating: Number(req.body.rating)
//       }
//       product.reviews.push(reviews);
//       product.numReviews = product.reviews.length;
//       product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
//       const updateproduct = await product.save();
//       res.status(404).send({
//         message: 'Review submited',
//         review: updateproduct.reviews[product.reviews.length - 1]
//       })
//     } else {
//       res.status(404).send('Product Not Found')
//     }
//   } catch (error) {
//     res.status(500).send('Failure');
//   }
// }

