import { useEffect, useRef, useState } from "react";
import { useSongData } from "../context/SongContext"
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

const Player = () => {
	const { isPlaying, setIsPlaying, selectedSong, fetchSong, song, prevSong, nextSong } = useSongData();
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [volume, setVolume] = useState<number>(1);
	const [progress, setProgress] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);

	const handleLoadedMetaData = (audio: HTMLAudioElement) => {
		setDuration(audio.duration || 0);
	};

	const handleTimeUpdate = (audio: HTMLAudioElement) => {
		setProgress(audio.currentTime || 0);
	};

	const handlePlayPause = () => {
		if (!audioRef.current) {
			return;
		}

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(e.target.value) / 100;
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = (parseFloat(e.target.value) / 100) * duration;
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
		}
		setProgress(newTime);
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		audio.addEventListener("loadedmetadata", () => handleLoadedMetaData(audio));
		audio.addEventListener("timeupdate", () => handleTimeUpdate(audio));

		return () => {
			audio.removeEventListener("loadedmetadata", () => handleLoadedMetaData(audio));
			audio.removeEventListener("timeupdate", () => handleTimeUpdate(audio));
		}
	}, [song]);

	useEffect(() => {
		fetchSong();
	}, [selectedSong]);

	return (
		<div>
			{song && (
				<div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
					<div className='lg:flex items-center gap-4'>
						<img
							src={song.thumbnail ? song.thumbnail : '/download.jpeg'}
							alt=''
							className='w-12'
						/>
						<div className='hidden md:block'>
							<p>{song.title}</p>
							<p>{song.description?.slice(0, 30)}...</p>
						</div>
					</div>

					<div className='flex flex-col items-center gap-1 m-auto'>
						{song.audio && (
							<audio
								ref={audioRef}
								src={song.audio}
								autoPlay={isPlaying}
							/>
						)}
						<div className='w-full items-center flex font-thin text-green-400'>
							<input
								type='range'
								min={0}
								max={100}
								className='progess-bar w-[120px] md:w-[300px]'
								value={(progress / duration) * 100 || 0}
								onChange={durationChange}
							/>
						</div>
						<div className='flex justify-center items-center gap-4'>
							<span
								className='cursor-pointer'
								onClick={prevSong}
							>
								<GrChapterPrevious />
							</span>
							<button
								className='bg-white text-black rounded-full p-2'
								onClick={handlePlayPause}
							>
								{isPlaying ? <FaPause /> : <FaPlay />}
							</button>
							<span
								className='cursor-pointer'
								onClick={nextSong}
							>
								<GrChapterNext />
							</span>
						</div>
					</div>

					<div className='flex items-center'>
						<input
							type='range'
							min={0}
							max={100}
							step={0.01}
							value={volume * 100}
							className='w-16 md:w-32'
							onChange={volumeChange}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default Player;