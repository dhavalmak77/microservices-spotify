import { useState } from 'react';
import { useUserData } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const navigate = useNavigate();
	const { registerUser, btnLoading } = useUserData();

	const submitHandler = async (e: any) => {
		e.preventDefault();
		await registerUser(name, email, password, navigate);
	};

	return (
		<div className='flex items-center justify-center h-screen max-h-screen'>
			<div className='bg-black text-white p-8 rounded-lg shadow-lg max-w-md w-full'>
				<h2 className='text-3xl font-bold text-center mb-8'>Register to Spotify</h2>

				<form
					className='mt-8'
					onSubmit={submitHandler}
				>
					<div className='mb-4'>
						<label className='block text-sm font-medium mb-1'>Name</label>
						<input
							type='text'
							placeholder='Enter name'
							className='auth-input'
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-sm font-medium mb-1'>Email</label>
						<input
							type='email'
							placeholder='Enter email'
							className='auth-input'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-sm font-medium mb-1'>Password</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='auth-input'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button
						className='auth-btn'
						disabled={btnLoading}
					>
						{btnLoading ? 'Registering...' : 'Register'}
					</button>
				</form>

				<div className='text-center mt-6 text-sm text-gray-400'>
					Already have an account?{' '}
					<Link
						to={'/login'}
						className='hover:text-gray-300'
					>
						Login now
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
