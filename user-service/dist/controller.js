import { User } from "./model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TryCatch from "./try-catch.js";
export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password, role = "user" } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.status(500).json({
            message: "User already exists"
        });
    }
    if (!["admin", "user"].includes(role)) {
        return res.status(500).json({
            message: "Incorrect role passed"
        });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    user = await User.create({
        name,
        email,
        password: hashPassword,
        role
    });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    return res.status(200).json({
        message: "User registered successfully",
        user,
        token
    });
});
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User does not exists"
        });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({
            message: "Invalid password"
        });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    return res.status(200).json({
        message: "User logged in successfully",
        user,
        token
    });
});
export const userProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const addToPlaylist = TryCatch(async (req, res) => {
    const songId = req.params.id;
    const user = req.user;
    if (user.playlist.includes(songId)) {
        const index = user.playlist.indexOf(songId);
        user.playlist.splice(index, 1);
        await user.save();
        return res.status(200).json({ message: "Song removed from playlist" });
    }
    user.playlist.push(songId);
    await user.save();
    return res.status(200).json({ message: "Song added to playlist" });
});
//# sourceMappingURL=controller.js.map