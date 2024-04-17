import express from "express"; // step 1
import postController from "../app/controllers/PostController.js";  // step 3

const router = express.Router(); // step 2

router.post('/store', postController.store); // localhost:3000/posts/store
router.post('/deletePost', postController.delete); // localhost:3000/posts/store
router.get('/create', postController.create); // localhost:3000/posts/create
router.get('/:id', postController.detail); // localhost:3000/posts/101
router.get('/', postController.index); // localhost:3000/posts/

export default router;