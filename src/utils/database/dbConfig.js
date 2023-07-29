const mongoose = require("mongoose");
const envVariable = require("../../config/config");

const { MONGO_URL } = envVariable;

mongoose.connection.once("open", () => {
  console.log("db connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL);
};

module.exports = mongoConnect;
