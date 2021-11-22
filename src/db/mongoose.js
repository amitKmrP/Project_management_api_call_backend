const mongoose = require("mongoose");

mongoose.connect("https://downloads.mongodb.com/compass/mongodb-compass_1.29.4_amd64.deb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

