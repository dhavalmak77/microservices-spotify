import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Register from "./pages/register";

function App() {
	const { isAuth, loading } = useUserData();

	return (
		loading ? (
			<Loading />
		) : (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/login" element={isAuth ? <Index /> : <Login />} />
					<Route path="/register" element={isAuth ? <Index /> : <Register />} />
				</Routes>
			</BrowserRouter>
		)
	);
}

export default App;