const User = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json('Invalied user');
        }
        const validated = await bcrypt.compare(req.body.password, user.password);
        if (!validated) {
            return res.status(404).send('Wrong password');
        }
        if (user && validated) {
            const token = jwt.sign(
                {
                    _id : user._id,
                    isAdmin: user.isAdmin
                },
                process.env.JWT_SEC || 'vn',
                { expiresIn: "30d" }
            )
            res.status(200).send({ token :token,user: user._doc });
        } else {
            res.status(400).send('Login failure');
        }
    } catch (error) {
        res.status(500).send('loi');
    }
}
module.exports.register = async function (req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(403).send('User alredy');
    }
    const salt = await bcrypt.genSalt();
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const newUser = await User(req.body)
    await newUser.save();
    res.status(201).json(newUser);
}
module.exports.user = async function (req, res) {
    const user = await User.findById(req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}
module.exports.getall = async function (req, res) {
    const users = await User.find({});
    res.send(users);
}
module.exports.delete = async function (req, res) {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.email === 'admin@gmail.com') {
            res.status(400).send({ message: 'Can Not Delete Admin User' });
            return;
        }
        const deleteUser = await user.remove();
        res.send({ message: 'User Deleted', user: deleteUser });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}
module.exports.update = async function (req, res) {
    if (req.body.password) {
        const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
}
module.exports.stats = async function (req, res) {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
}