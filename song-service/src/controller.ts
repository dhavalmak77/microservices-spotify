import TryCatch from "./try-catch.js";
import { psql } from "./config/database.js";

export const getAlbums = TryCatch(async (req, res) => {
	const albums = await psql`
	SELECT * FROM albums
	`;
	
	return res.json(albums);
});

export const getSongs = TryCatch(async (req, res) => {
	const songs = await psql`
		SELECT * FROM songs
	`;
	
	return res.json(songs);
});

export const getSongsByAlbum = TryCatch(async (req, res) => {
	const id = req.params.id;
	const album = await psql`
		SELECT * FROM albums WHERE id = ${id}
	`;

	if (!album.length) {
		return res.status(404).json({ message: "Album does not exists" });
	}

	const songs = await psql`
		SELECT * FROM songs WHERE album_id = ${id}
	`;

	return res.json({ songs, album: album[0] });
});

export const getSong = TryCatch(async (req, res) => {
	const id = req.params.id;

	const song = await psql`
		SELECT * FROM songs WHERE id = ${id}
	`;

	if (!song.length) {
		return res.status(404).json({ message: "Song does not exists" });
	}

	return res.json(song[0]);
});