import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../../context/UserContext";
import { useSongData } from "../../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const server = "http://localhost:7000";

const Dashboard = () => {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [album, setAlbum] = useState<string>("");
	const [file, setFile] = useState<File | null>(null);
	const [btnLoading, setBtnLoading] = useState<boolean>(false);

	const { albums, songs, fetchSongs, fetchAlbums } = useSongData();
	const { user } = useUserData();
	const navigate = useNavigate();

	const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setFile(file);
	}

	const addAlbum = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		setBtnLoading(true);

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("file", file);

		try {
			const response = await axios.post(`${server}/api/v1/album/new`, formData, {
				headers: {
					token: localStorage.getItem("token") || ""
				}
			});

			const data = response.data;

			fetchAlbums();
			setTitle("");
			setDescription("");
			setFile(null);
			toast.success(data.message);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error(error);
				toast.error(error.response?.data?.message || "Error adding album");
			} else {
				console.error(error);
				toast.error("Error adding album");
			}
		} finally {
			setBtnLoading(false);
		}
	};

	const addSong = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		setBtnLoading(true);

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("file", file);
		formData.append("album", album);

		try {
			const response = await axios.post(`${server}/api/v1/song/new`, formData, {
				headers: {
					token: localStorage.getItem("token") || ""
				}
			});

			const data = response.data;

			fetchSongs();
			setTitle("");
			setDescription("");
			setAlbum("");
			setFile(null);
			toast.success(data.message);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error(error);
				toast.error(error.response?.data?.message || "Error adding song");
			} else {
				console.error(error);
				toast.error("Error adding song");
			}
		} finally {
			setBtnLoading(false);
		}
	};

	const uploadThumbnail = async (id: string) => {
		if (!file) return;

		setBtnLoading(true);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.put(`${server}/api/v1/song/${id}`, formData, {
				headers: {
					token: localStorage.getItem("token") || ""
				}
			});

			const data = response.data;

			fetchSongs();
			setFile(null);
			toast.success(data.message);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error(error);
				toast.error(error.response?.data?.message || "Error adding song");
			} else {
				console.error(error);
				toast.error("Error adding song");
			}
		} finally {
			setBtnLoading(false);
		}
	};

	const deleteAlbum = async (id: string) => {
		if (confirm("Are you sure you want to delete this album? This will also delete all songs in this album.")) {
			setBtnLoading(true);
			try {
				const response = await axios.delete(`${server}/api/v1/album/${id}`, {
					headers: {
						token: localStorage.getItem("token") || ""
					}
				});

				const data = response.data;

				fetchAlbums();
				fetchSongs();
				toast.success(data.message);
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					console.error(error);
					toast.error(error.response?.data?.message || "Error deleting album");
				} else {
					console.error(error);
					toast.error("Error deleting album");
				}
			} finally {
				setBtnLoading(false);
			}
		}
	};

	const deleteSong = async (id: string) => {
		if (confirm("Are you sure you want to delete this song?")) {
			setBtnLoading(true);
			try {
				const response = await axios.delete(`${server}/api/v1/song/${id}`, {
					headers: {
						token: localStorage.getItem("token") || ""
					}
				});

				const data = response.data;

				fetchSongs();
				toast.success(data.message);
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					console.error(error);
					toast.error(error.response?.data?.message || "Error deleting album");
				} else {
					console.error(error);
					toast.error("Error deleting album");
				}
			} finally {
				setBtnLoading(false);
			}
		}
	};

	useEffect(() => {
		if (user?.role !== 'admin') {
			navigate('/');
		}
	}, [user, navigate]);

	return (
		<div className="min-h-screen bg-[#212121] text-white p-8">
			<Link to="/" className="bg-green-500 text-white font-bold py-2 px-4 rounded-full">Go to Homepage</Link>
			<h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>
			<form className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col justify-center gap-4" onSubmit={addAlbum}>
				<input type="text" placeholder="Album Name" className="auth-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
				<input type="text" placeholder="Album Description" className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} required />
				<input type="file" className="auth-input" onChange={fileChangeHandler} accept="image/*" required />
				<button type="submit" className="auth-btn w-[100px]" disabled={btnLoading}>
					{btnLoading ? "Loading..." : "Add Album"}
				</button>
			</form>

			<h2 className="text-2xl font-bold mb-6 mt-6">Add Song</h2>
			<form className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col justify-center gap-4" onSubmit={addSong}>
				<input type="text" placeholder="Song Name" className="auth-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
				<input type="text" placeholder="Song Description" className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} required />
				<select name="" id="" className="auth-input" onChange={e => setAlbum(e.target.value)} required>
					<option value="">Select Album</option>
					{albums.map(album => (
						<option key={album.id} value={album.id}>{album.title}</option>
					))}
				</select>
				<input type="file" className="auth-input" onChange={fileChangeHandler} accept="audio/*" required />
				<button type="submit" className="auth-btn w-[100px]" disabled={btnLoading}>
					{btnLoading ? "Loading..." : "Add Song"}
				</button>
			</form>

			<div className="mt-8">
				<h3 className="text-xl font-semibold mb-4">Added Albums</h3>
				<div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
					{albums.map(album => (
						<div key={album.id} className="bg-[#181818] p-4 rounded-lg shadow-md">
							{album.thumbnail && <img src={album.thumbnail} alt={album.title} className="mr-1 w-52 h-52" />}
							<h4 className="text-lg font-bold">{album.title}</h4>
							<p className="text-sm">{album.description.slice(0, 30)}...</p>
							<button className="px-3 py-1 mt-2 bg-red-500 text-white rounded" disabled={btnLoading} onClick={() => deleteAlbum(album.id)}>
								<MdDelete />
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="mt-8">
				<h3 className="text-xl font-semibold mb-4">Added Songs</h3>
				<div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
					{songs.map(song => (
						<div key={song.id} className="bg-[#181818] p-4 rounded-lg shadow-md">
							{song.thumbnail && <img src={song.thumbnail} alt={song.title} className="mr-1 w-52 h-52" />}
							{!song.thumbnail && (
								<div className="flex flex-col justify-center items-start gap-2 w-[250px]">
									<input type="file" onChange={fileChangeHandler} className="" />
									<button className="auth-btn" style={{ width: '200px' }} disabled={btnLoading} onClick={() => uploadThumbnail(song.id)}>{btnLoading ? 'Uploading...' : 'Upload Thumbnail'}</button>
								</div>
							)}
							<h4 className="text-lg font-bold">{song.title}</h4>
							<p className="text-sm">{song.description.slice(0, 30)}...</p>
							<button className="px-3 py-1 mt-2 bg-red-500 text-white rounded" disabled={btnLoading} onClick={() => deleteSong(song.id)}>
								<MdDelete />
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;