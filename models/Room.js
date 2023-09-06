const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ShortId = require("shortid");

const RoomSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
    default: ShortId.generate,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

module.exports = Room = mongoose.model("rooms", RoomSchema);
