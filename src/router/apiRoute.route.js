import express from "express"; // step 1
import PostController from "../app/controllers/api/PostController.js";  // step 2
import UserController from "../app/controllers/api/UserController.js";  // step 3

const router = express.Router();


router.get('/posts', PostController.index);
router.get('/posts/:id', PostController.show);
router.post('/posts/create', PostController.createPost);

// USER

router.get('/users', UserController.index);
router.get('/users/:id', UserController.show);
router.post('/users/create', UserController.createUser);


export default router;




