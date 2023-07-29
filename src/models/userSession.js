const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSessionSchema = new Schema(
  {
    token: {
      type: String,
      require: true,
      unique: true,
    },
    userId: {
      type: String,
      require: true,
    },
    ipAddress: {
      type: String,
      require: true,
    },

    expiresAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const UserSession = mongoose.model("userSession", userSessionSchema);

module.exports = UserSession;
