const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
var morgan = require('morgan');
const socker = require('socket.io');
// const multer = require('multer');
const connectDb = require('./controllers/db.js');
const userRoute = require('./routes/userRouter');
const productRoute = require('./routes/productRouter');

const app = express();
const port = 5000;
connectDb();
dotenv.config();
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(bodyParser.json());

app.use('/api/users', userRoute);
app.use('/api/products',productRoute)
// app.use("/api/products", productRoute);

// const httpServer = http.Server(app);

// const io = new Server(httpServer, { cors: { origin: "*" } });
// const users = [];

// io.on('connection', (socket) => {
//     socket.on('disconnect', () => {
//         const user = users.find((x) => x.socketID === socket.id);
//         if (user) {
//             user.online = false;
//             const admin = users.find((x) => x.isAdmin && x.online);
//             if (admin) {
//                 io.to(admin.socketID).emit('Updateuser', user)
//             }
//         }
//     })
//     socket.on('onLogin', (user) => {
//         const UpdateUser = {
//             ...user,
//             online: true,
//             socketID: socket.id,
//             messages: []
//         }
//         const exitsUser = user.find((x) => x._id === Updateuser._id);
//         if (exitsUser) {
//             exitsUser.socketId = socket.id;
//             exitsUser.online = true;

//         } else {
//             users.push(Updateuser);
//         }
//         const admin = users.find((x) => x.isAdmin && x.online);
//         if (admin) {
//             io.to(admin.socketID).emit('Updateuser', Updateuser);
//         }
//         if (Updateuser.isAdmin) {
//             io.to(Updateuser.socketID).emit('listUsers', users);
//         }
//     })
//     socket.on('onUserSelected', (user) => {
//         const admin = user.find((x) => x.idAdmin && x.online);
//         if (admin) {
//             const exitsUser = user.find((x) => x._id === user._id);
//             io.to(admin.socketID).emit('selectUser', exitsUser);
//         }
//     })
//     socket.on('onMessage', (message) => {
//         if (message.isAdmin) {
//             const user = users.find((x) => x._id === message._id && x.online);
//             if (user) {
//                 io.to(user.socketID).emit('message', message);
//                 user.message.push(message);
//             }
//         } else {
//             const admin = users.find((x) => x.isAdmin && x.online);
//             if (admin) {
//                 io.to(admin.socketID).emit('message', message);
//                 const user = users.find((x) => x._id === message._id && x.online);
//                 user.message.push(message);
//             } else {
//                 io.to(socket.id).emit('message', {
//                     name: 'Admin',
//                     body: 'Sorry . I am not online right now',
//                 });
//             }

//         }
//     })

// })

app.listen(port || 5000, () => {
    console.log(`Serve at http://localhost:${port}`);
});