import express from 'express';
import {loginController, registerController, testController} from '../controllers/authController.js';
import {isAuthenticated } from '../middlewares/authMiddleware.js';

 //router object
const router = express.Router();

// Define the registration route
router.post("/register", registerController);

//login|| post
router.post('/login',loginController);

// test routes

router.get('/test',isAuthenticated,testController)

export default router;
