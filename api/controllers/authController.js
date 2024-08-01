import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorResponse} from "../utils/error.js";


export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hash,
      isAdmin: req.body.isAdmin,
    });

    const user = await newUser.save();
    res.status(200).json("User has been registered...");
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userName: req.body.userName
    })
    if(!user){
      return next(errorResponse(400, "User not found..."));
    }

    const validPassword = await bcrypt.compareSync(req.body.password, user.password);
    if(!validPassword){
      return next(errorResponse(400, "Wrong password or username..."));
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT,
      { expiresIn: '1h' });

    const { password, isAdmin, ...others } = user._doc;

    res.cookie("access_token",token,{httpOnly: true}).status(200).json({ ...others });
  } catch (error) {
    next(error);
  }
}


