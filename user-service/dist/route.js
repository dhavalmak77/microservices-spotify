import express from 'express';
import { addToPlaylist, loginUser, registerUser, userProfile } from './controller.js';
import { isUserAuthenticated } from './middleware.js';
const router = express.Router();
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/me', isUserAuthenticated, userProfile);
router.post('/song/:id', isUserAuthenticated, addToPlaylist);
export default router;
//# sourceMappingURL=route.js.map