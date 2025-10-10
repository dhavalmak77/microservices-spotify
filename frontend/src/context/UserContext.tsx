import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";

const server = "http://localhost:5000";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    playlist: string[];
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    fetchUser: () => Promise<void>;
    isAuth: boolean;
    loginUser: (email: string, password: string, navigate: (path: string) => void) => Promise<void>;
    registerUser: (name: string, email: string, password: string, navigate: (path: string) => void) => Promise<void>;
    btnLoading: boolean;
    logoutUser: () => void;
    addToPlaylist: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);

    const loginUser = async (email: string, password: string, navigate: (path: string) => void) => {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/user/login`, {
                email,
                password
            });

            toast.success(data.message);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate('/');
        } catch (error: any) {
            console.log('Error while login user', error);
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            setBtnLoading(false);
        }
    }

    const registerUser = async (name: string, email: string, password: string, navigate: (path: string) => void) => {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/user/register`, {
                name,
                email,
                password
            });

            toast.success(data.message);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate('/');
        } catch (error: any | Error) {
            console.log('Error while login user', error);
            toast.error(error.response?.data?.message || (error).message);
            setBtnLoading(false);
        }
    }

    const logoutUser = () => {
        setUser(null);
        setIsAuth(false);
        localStorage.removeItem("token");
        toast.success("Logout successfully");
    }

    const addToPlaylist = async (id: string) => {
        try {
            const { data } = await axios.post(`${server}/api/v1/song/${id}`, {}, {
                headers: {
                    token: localStorage.getItem("token") as string
                }
            });

            toast.success(data.message);
        } catch (error: any) {
            console.log("Error while add to playlist", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`${server}/api/v1/user/me`, {
                headers: {
                    token: localStorage.getItem("token") as string
                }
            });

            setUser(data);
            setIsAuth(true);
        } catch (error) {
            console.log("Error while fetch user", error);
        } finally {
            setLoading(() => false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading, fetchUser, isAuth, loginUser, registerUser, btnLoading, logoutUser, addToPlaylist }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
}

export const useUserData = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserData must be used within a UserProvider");
    }
    return context;
}