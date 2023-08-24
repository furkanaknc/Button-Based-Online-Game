const express = require('express');

const Room = require('../../models/Room');

const router = express.Router();


router.post('/create-room', async (req, res) => {
    try {
      const { name, password } = req.body;
  
      // Check if a room with the given name already exists
      const existingRoom = await Room.findOne({ name });
      if (existingRoom) {
        return res.status(400).json({ message: 'Room name already exists' });
      }
  
     
      const newRoom = new Room({
        name,
        password,
      });
  
     
      await newRoom.save();
  
      res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/rooms', async (req, res) => {
    try {
      // Find all rooms
      const rooms = await Room.find();
  
      res.status(200).json({ rooms });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/find-room/:shortId', async (req, res) => {
    try {
      const { shortId } = req.params;
  
      // Find the room by shortId
      const room = await Room.findOne({ shortId });
  
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      res.status(200).json({ room });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/verify', async (req, res) => {
    try {
        const { roomId, password } = req.body;

        const room = await Room.findOne({ shortId: roomId }); // Change findById to findOne

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Compare the provided password with the room's password
        if (room.password !== password) {
            return res.status(400).json({ isPasswordCorrect: false });
        }

        res.status(200).json({ isPasswordCorrect: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


  
  module.exports = router;


