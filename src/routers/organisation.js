const express = require("express");
const Organisation = require("../models/organisation");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/orgs", auth, async (req, res) => {
  const organisation = new Organisation({
    ...req.body,
    postedBy: req.user._id,
    owner: [{ role: "superAdmin", follower: req.user._id }],
  });

  try {
    await organisation.save();
    res.status(201).send(organisation);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/orgs", auth, async (req, res) => {
  //   all org you are added in or created\, of any role
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const org = await Organisation.find({
      "owner.follower": req.user._id,
    }).populate("owner owner.follower");

    res.send(org);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/orgs/:id", auth, setOrganisation, async (req, res) => {
  console.log(req.org);
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    let user = req.org.owner.find((user) => {
      console.log(user, req.user, user.follower.equals(req.user._id));
      return user.follower.equals(req.user._id);
    });

    if (user.role == "admin" || user.role === "superAdmin") {
      await req.org
        .populate({
          path: "projects",
          // select: 'owners',
          // match: {"owners.follower": req.user._id },
          options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
          },
          populate: {
            path: "",
          },
        })
        .execPopulate();
    } else {
      await req.org
        .populate({
          path: "projects",
          // select: 'owners',
          match: { "owners.follower": req.user._id },
          options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
          },
          populate: {
            path: "",
          },
        })
        .execPopulate();
    }

    res.send(req.org);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/organisation/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "owner", "role"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const org = await Organisation.findOne({
      _id,
      owner: {
        $elemMatch: { follower: req.user._id, role: "superAdmin" },
      },
    });

    if (updates.includes("owner")) {
      let userID = req.body["owner"];

      org.owner = [
        ...org["owner"],
        {
          role: req.body["role"],
          follower: req.body["owner"],
        },
      ];
    }

    updates.forEach((update) => {
      if (update != "owner") {
        org[update] = req.body[update];
      }
    });
    console.log(org);
    await org.save();
    res.send(org);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/organisation/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;

    const org = await Organisation.findOne({
      _id,
      owner: {
        $elemMatch: { follower: req.user._id, role: "admin" },
      },
    });
    await org.remove();
    // sendCancelationEmail(req.user.email, req.user.name);
    res.send(org);
  } catch (e) {
    res.status(500).send();
  }
});

//setOrganisation

async function setOrganisation(req, res, next) {
  const _id = req.params.id;
  try {
    req.org = await Organisation.findOne({
      _id,
      "owner.follower": req.user._id,
    });
    // .populate("owner owner.follower");

    next();
  } catch (e) {
    return res.send("Organisation not found");
  }
}

module.exports = router;
