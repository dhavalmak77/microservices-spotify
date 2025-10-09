import TryCatch from "./try-catch.js";
import { psql } from "./config/database.js";
import { redisClient } from "./config/redis-connection.js";
const CACHE_EXPIRY = 3600; // 1 hour
export const getAlbums = TryCatch(async (req, res) => {
    let albums;
    if (redisClient.isReady) {
        albums = await redisClient.get("albums");
    }
    if (albums) {
        console.log('Redis cache hit');
        return res.json(JSON.parse(albums));
    }
    else {
        console.log('Redis cache miss');
        albums = await psql `
			SELECT * FROM albums
		`;
        if (redisClient.isReady) {
            await redisClient.set('albums', JSON.stringify(albums), {
                expiration: {
                    type: "EX",
                    value: CACHE_EXPIRY
                }
            });
        }
        return res.json(albums);
    }
});
export const getSongs = TryCatch(async (req, res) => {
    let songs;
    if (redisClient.isReady) {
        songs = await redisClient.get("songs");
    }
    if (songs) {
        console.log('Redis cache hit');
        return res.json(JSON.parse(songs));
    }
    else {
        console.log('Redis cache miss');
        songs = await psql `
			SELECT * FROM songs
		`;
        if (redisClient.isReady) {
            await redisClient.set('songs', JSON.stringify(songs), {
                expiration: {
                    type: "EX",
                    value: CACHE_EXPIRY
                }
            });
        }
        return res.json(songs);
    }
});
export const getSongsByAlbum = TryCatch(async (req, res) => {
    const id = req.params.id;
    let album;
    if (redisClient.isReady) {
        album = await redisClient.get(`album-and-songs-${id}`);
    }
    if (album) {
        console.log('Redis cache hit');
        return res.json(JSON.parse(album));
    }
    else {
        console.log('Redis cache miss');
        album = await psql `
			SELECT * FROM albums WHERE id = ${id}
		`;
        if (!album.length) {
            return res.status(404).json({ message: "Album does not exists" });
        }
        const songs = await psql `
			SELECT * FROM songs WHERE album_id = ${id}
		`;
        if (redisClient.isReady) {
            await redisClient.set(`album-and-songs-${id}`, JSON.stringify({ songs, album: album[0] }), {
                expiration: {
                    type: "EX",
                    value: CACHE_EXPIRY
                }
            });
        }
        return res.json({ songs, album: album[0] });
    }
});
export const getSong = TryCatch(async (req, res) => {
    const id = req.params.id;
    const song = await psql `
		SELECT * FROM songs WHERE id = ${id}
	`;
    if (!song.length) {
        return res.status(404).json({ message: "Song does not exists" });
    }
    return res.json(song[0]);
});
//# sourceMappingURL=controller.js.map