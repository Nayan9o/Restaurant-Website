import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logger } from "../utils/logger.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res
        .status(400)
        .json({ success: false, message: "ID token required" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID, // Optional
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // Upsert user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        googleId,
        email: email.toLowerCase(),
        name,
        avatar: avatar || "",
      });
      logger.info(`New user created: ${user._id}`);
    } else {
      // Update if changed
      user.name = name;
      user.avatar = avatar || user.avatar;
      user.email = email.toLowerCase();
      await user.save();
      logger.info(`User updated: ${user._id}`);
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Google Auth Error: ${error.message}`);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};

export default { googleAuth };
