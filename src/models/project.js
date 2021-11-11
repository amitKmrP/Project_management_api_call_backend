const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Organisation",
    },
    owners: [
      {
        role: {
          type: String,
          enum: ["superAdmin", "admin", "user"],
          default: "user",
        },
        follower: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

projectSchema.pre("remove", async function (next) {
  const project = this;
  await Project.deleteMany({ owner: project._id });
  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
