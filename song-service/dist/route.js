import express from "express";
import { getAlbums, getSong, getSongs, getSongsByAlbum } from "./controller.js";
const router = express.Router();
router.get("/albums", getAlbums);
router.get("/songs", getSongs);
router.get("/album/:id", getSongsByAlbum);
router.get("/song/:id", getSong);
export default router;
//# sourceMappingURL=route.js.map