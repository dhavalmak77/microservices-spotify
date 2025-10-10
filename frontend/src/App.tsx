import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Register from "./pages/register";
import Album from "./pages/album";
import Playlist from "./pages/playlist";
import Dashboard from "./pages/admin/dashboard";

function App() {
	const { isAuth, loading } = useUserData();

	return (
		loading ? (
			<Loading />
		) : (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/album/:id" element={isAuth ? <Album /> : <Login />} />
					<Route path="/playlist" element={isAuth ? <Playlist /> : <Login />} />
					<Route path="/login" element={isAuth ? <Index /> : <Login />} />
					<Route path="/register" element={isAuth ? <Index /> : <Register />} />
					<Route path="/admin/dashboard" element={isAuth ? <Dashboard /> : <Login />} />
				</Routes>
			</BrowserRouter>
		)
	);
}

export default App;