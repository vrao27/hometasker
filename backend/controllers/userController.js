// controllers/userController.js
const User = require('../models/user');

exports.listHouseholdMembers = async (req, res) => {
  try {
    // authMiddleware must have set req.user.householdId
    const myHouse = req.user.householdId;
    const members = await User.find(
      { householdId: myHouse },
      '_id name'
    );
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    // Return the  points values for user upon task completeion
    const me = await User.findById(req.user.userId, '_id name points xp lives energy');
    res.json(me);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
