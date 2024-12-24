const mongoose = require("mongoose");

const docSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Object,
    default: "",
  },
  assignedManagers: [
    {
      type: [],
      ref: "Student",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["In Progress", "approve"],
    default: "In Progress",
  },
});

module.exports = mongoose.model("Document", docSchema);
