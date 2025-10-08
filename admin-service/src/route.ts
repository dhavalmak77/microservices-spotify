import express from "express";
import { isAdminAuthenticated, isAdminUser, uploadFile } from "./middleware.js";
import { addAlbum, addSong, addThumbnail, deleteSong } from "./controller.js";

const router = express.Router();

router.post("/album/new", isAdminAuthenticated, isAdminUser, uploadFile, addAlbum);
router.post("/song/new", isAdminAuthenticated, isAdminUser, uploadFile, addSong);
router.put("/song/:id", isAdminAuthenticated, isAdminUser, uploadFile, addThumbnail);
router.delete("/song/:id", isAdminAuthenticated, isAdminUser, uploadFile, deleteSong);

export default router;