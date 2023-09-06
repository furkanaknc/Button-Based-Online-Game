const Room = require("../models/Room");

const createRoom = async (req, res) => {
  try {
    const { name, password } = req.body;

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: "Room name already exists" });
    }

    const newRoom = new Room({
      name,
      password,
    });

    await newRoom.save();

    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const findRoom = async (req, res) => {
  try {
    const { shortId } = req.params;

    const room = await Room.findOne({ shortId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyRoom = async (req, res) => {
  try {
    const { roomId, password } = req.body;

    const room = await Room.findOne({ shortId: roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.password !== password) {
      return res.status(400).json({ isPasswordCorrect: false });
    }

    res.status(200).json({ isPasswordCorrect: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createRoom,
  getRooms,
  findRoom,
  verifyRoom,
};
