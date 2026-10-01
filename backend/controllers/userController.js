import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const shape = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  isAdmin: user.isAdmin,
});

// @desc  Register
// @route POST /api/users/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (await User.findOne({ email: String(email).toLowerCase() })) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }
    const user = await User.create({ name, email, phone, password });
    res.status(201).json({ success: true, user: shape(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

// @desc  Login with email or phone
// @route POST /api/users/login
export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: String(identifier).toLowerCase() }, { phone: identifier }],
    });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Wrong email/phone or password");
    }
    res.json({ success: true, user: shape(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

// @desc  Current profile
// @route GET /api/users/profile  (private)
export const getProfile = async (req, res) => {
  res.json({ success: true, user: shape(req.user) });
};
