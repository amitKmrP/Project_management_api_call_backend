const mongoose = require("mongoose");
const Project = require("./project");

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owner: [
      {
        role: {
          type: String,
          enum: ["superAdmin", "admin", "user"],
          default: "user",
        },
        follower: {
          type: mongoose.Schema.Types.ObjectId,
          //   required: true,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

organisationSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "owner",
});

organisationSchema.pre("remove", async function (next) {
  const org = this;
  await Project.deleteMany({ owner: org._id });
  next();
});

organisationSchema.set("toObject", { virtuals: true });
organisationSchema.set("toJSON", { virtuals: true });

const Organisation = mongoose.model("Organisation", organisationSchema);

module.exports = Organisation;
