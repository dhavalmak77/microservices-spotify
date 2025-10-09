import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserContext';

const Navbar = () => {
	const navigate = useNavigate();

	const { isAuth } = useUserData();

	return (
		<>
			<div className='w-full flex justify-between items-center font-semibold'>
				<div className='flex items-center gap-2'>
					<img
						src='/left_arrow.png'
						alt=''
						className='w-8 bg-black p-2 rounded-2xl cursor-pointer'
						onClick={() => navigate(-1)}
					/>
					<img
						src='/right_arrow.png'
						alt=''
						className='w-8 bg-black p-2 rounded-2xl cursor-pointer'
						onClick={() => navigate(+1)}
					/>
				</div>

				<div className='flex item-center gap-4'>
					<p className='px-4 py-1 bg-white text-black text-[15px] rounded-full cursor-pointer hidden md:block'>Explore Premium</p>
					<p className='px-4 py-1 bg-white text-black text-[15px] rounded-full cursor-pointer hidden md:block'>Install App</p>
					{isAuth ? <p className='px-4 py-1 bg-white text-black text-[15px] rounded-full cursor-pointer'>Logout</p> : <p className='px-4 py-1 bg-white text-black text-[15px] rounded-full cursor-pointer' onClick={() => navigate('/login')}>Login</p>}
				</div>
			</div>

			<div className='flex items-center gap-2 mt-4'>
				<p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer'>All</p>
				<p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block'>Music</p>
				<p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block'>Podcast</p>
				<p
					className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer md:hidden'
					onClick={() => navigate('/playlist')}
				>
					Playlist
				</p>
			</div>
		</>
	);
};

export default Navbar;
