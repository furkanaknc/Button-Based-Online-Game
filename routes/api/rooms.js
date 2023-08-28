const express = require('express');

const roomController = require('../../controllers/room')

const router = express.Router();


router.post('/create-room', roomController.createRoom)

router.get('/rooms',roomController.getRooms) 

router.get('/find-room/:shortId', roomController.findRoom) 

router.post('/verify', roomController.verifyRoom)


module.exports = router;


