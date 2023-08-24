require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const http = require('http');

const app = express();


const ENVIRONMENT = process.env.NODE_ENV || 'development';

let allowedOrigin;
if (ENVIRONMENT === 'production') {
    allowedOrigin = process.env.PRODUCTION_FRONTEND_URL; 
} else {
    allowedOrigin = "http://localhost:8080"; 
}

const corsOptions = {
    origin: allowedOrigin, 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

require('./config/passport')(passport);

const db = require('./config/keys').mongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log(`connected to db`)
    })
    .catch(err => console.log(`server couldn't connected to db ${err}`));

app.get('/', (req, res) => {
    return res.send("<h1>Hello World</h1>");
});

const users = require('./routes/api/users');
app.use('/api/users', users);

const roomsRoute = require('./routes/api/rooms');
app.use('/api/rooms', roomsRoute);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


const io = require('socket.io')(server, {
    cors: corsOptions
});

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})

require('./game/socket')(io);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
