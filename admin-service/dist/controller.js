import TryCatch from "./try-catch.js";
import getBuffer from "./config/data-uri.js";
import cloudinary from "cloudinary";
import { psql } from "./config/database.js";
import { redisClient } from "./config/redis-connection.js";
export const addAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Insufficent permissions!"
        });
    }
    const { title, description } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Thumbnail is required"
        });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        return res.status(500).json({
            message: "Failed to buffer file"
        });
    }
    try {
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "albums"
        });
        const result = await psql `
			INSERT INTO albums (title, description, thumbnail)
			VALUES (${title}, ${description}, ${cloud?.secure_url})
			RETURNING *
		`;
        if (result.length) {
            if (redisClient.isReady) {
                await redisClient.del(`album-songs-${result?.[0]?.id}`);
                await redisClient.del("albums");
                console.log(`Cache invalidated for albums & album id ${result?.[0]?.id}`);
            }
            return res.json({
                message: "Album published successfully",
                album: result[0]
            });
        }
        else {
            return res.status(500).json({
                message: "Something went wrong!",
            });
        }
    }
    catch (error) {
        console.log("Error while cloudinary media upload", error);
        res.status(500).json({
            message: "Error uploading thumbnail to server"
        });
    }
});
export const addSong = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Insufficent permissions!"
        });
    }
    const { title, description, album } = req.body;
    const isAlbum = await psql `
		SELECT * FROM albums WHERE id = ${album}
	`;
    if (!isAlbum.length) {
        res.status(404).json({
            message: "Album does not exists"
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Thumbnail is required"
        });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        return res.status(500).json({
            message: "Failed to buffer file"
        });
    }
    try {
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "songs",
            resource_type: "video"
        });
        const result = await psql `
			INSERT INTO songs (title, description, audio, album_id)
			VALUES (${title}, ${description}, ${cloud?.secure_url}, ${album})
			RETURNING *
		`;
        if (redisClient.isReady) {
            await redisClient.del(`album-songs-${result?.[0]?.id}`);
            await redisClient.del("songs");
            console.log(`Cache invalidated for songs & album id ${album}`);
        }
        return res.json({
            message: "Song published successfully",
            album: result[0]
        });
    }
    catch (error) {
        console.log("Error while cloudinary media upload", error);
        return res.status(500).json({
            message: "Error uploading thumbnail to server"
        });
    }
});
export const addThumbnail = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Insufficent permissions!"
        });
    }
    const songId = req.params.id;
    const song = await psql `
		SELECT * FROM songs WHERE id = ${songId}
	`;
    if (!song.length) {
        res.status(404).json({
            message: "Song does not exists"
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Thumbnail is required"
        });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        return res.status(500).json({
            message: "Failed to buffer file"
        });
    }
    try {
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);
        const result = await psql `
			UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${songId} RETURNING *
		`;
        if (redisClient.isReady) {
            await redisClient.del(`album-songs-${result?.[0]?.album_id}`);
            await redisClient.del("songs");
            console.log(`Cache invalidated for songs`);
        }
        return res.json({
            message: "Thumbnail updated",
            song: result[0]
        });
    }
    catch (error) {
        console.log("Error while cloudinary media upload", error);
        return res.status(500).json({
            message: "Error uploading thumbnail to server"
        });
    }
});
export const deleteAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Insufficent permissions!"
        });
    }
    const albumId = req.params.id;
    await psql `
		DELETE FROM songs WHERE album_id = ${albumId}
	`;
    const result = await psql `
		DELETE FROM albums WHERE id = ${albumId}
	`;
    if (!result.length) {
        return res.json({
            message: "Album does not exists"
        });
    }
    if (redisClient.isReady) {
        await redisClient.del(`album-songs-${albumId}`);
        await redisClient.del("songs");
        await redisClient.del("albums");
        console.log(`Cache invalidated for albums, songs & album id ${albumId}`);
    }
    return res.json({
        message: "Album deleted successfully"
    });
});
export const deleteSong = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Insufficent permissions!"
        });
    }
    const songId = req.params.id;
    const result = await psql `
		DELETE FROM songs WHERE id = ${songId}
	`;
    if (!result.length) {
        return res.json({
            message: "Song deleted"
        });
    }
    if (redisClient.isReady) {
        await redisClient.del("songs");
        await redisClient.del("albums");
        console.log("Cache invalidated for songs");
    }
    return res.json({
        message: "Song deleted successfully"
    });
});
//# sourceMappingURL=controller.js.map