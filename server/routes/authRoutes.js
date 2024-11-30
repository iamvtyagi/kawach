import express from 'express';
import {loginController, registerController, testControllerm} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

 //router object
const router = express.Router();

// Define the registration route
router.post("/register", registerController);

//login|| post
router.post('/login',loginController);

// test routes

router.get('/test',requireSignIn,isAdmin,testControllerm)

export default router;
