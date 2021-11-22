const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://amitpaswan123:Amit*paswan1@cluster0.fspaw.mongodb.net/test", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

