const mongoose = require("mongoose");
const url=`mongodb+srv://${process.env.MONGO_UID}:${process.env.MONGO_PASS}@cluster0.fspaw.mongodb.net/test`
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

