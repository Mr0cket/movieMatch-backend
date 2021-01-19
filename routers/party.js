const auth = require("../auth/middleware");
const User = require("../models").user;
const router = require("express").Router();

router.get("/", auth, async (req, res, next) => {});

router.post("/invite", async (req, res, next) => {
  // const { partyId } = req.user;
  const { email } = req.body;
  if (!email) return res.status(400).send("please send a body");
  if (typeof email !== "string") return res.statusCode(400).send("invalid email");
  console.log("email:", email);
  console.log("email", email);
  try {
    const invitedUser = await User.findOne({ where: { email } });

    if (!invitedUser)
      return res.statusCode(400).send({ message: "User with that email not found" });
    // Further Work needed:
    // send an invite to the selected user
    // if user accepts invite, add to party.
    const result = await User.update({ partyId: 1 }, { where: { id: invitedUser.id } });
    console.log(result.dataValues);
    res.send({ message: "ok" });
  } catch (error) {
    console.log("thingy:", error);
    next(error);
  }
});

module.exports = router;
