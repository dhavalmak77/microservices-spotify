import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";

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
				</Routes>
			</BrowserRouter>
		)
	);
}

export default App;