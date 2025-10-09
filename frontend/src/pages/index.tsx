import AlbumCard from "../components/AlbumCard";
import Layout from "../components/Layout";
import SongCard from "../components/SongCard";
import { useSongData } from "../context/SongContext";

const Index = () => {
	const { albums, songs, loading } = useSongData();

	return (
		<div>
			<Layout>
				<div className="mb-4">
					<h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
					<div className="flex overflow-auto">
						{albums.map((el, index) => {
							return (
								<AlbumCard key={index} image={el.thumbnail} desc={el.description} id={el.id} name={el.title} />
							)
						})}
					</div>
				</div>
				<div className="mb-4">
					<h1 className="my-5 font-bold text-2xl">Today's Hit</h1>
					<div className="flex overflow-auto">
						{songs.map((el, index) => {
							return (
								<SongCard key={index} image={el.thumbnail} desc={el.description} id={el.id} name={el.title} />
							)
						})}
					</div>
				</div>
			</Layout>
		</div>
	)
}

export default Index;