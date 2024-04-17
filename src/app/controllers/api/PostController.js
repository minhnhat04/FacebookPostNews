import Post from "../../models/Post.js";
import connection from "../../../config/db/index.js";
import { ObjectId } from "mongodb";

class PostController {

    // GET /posts
    async index(req, res) {
        try {
            const db = await connection.connect();
            const result = await Post.findAll(db);
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json('error');
        } finally {
            await connection.close();
        }
    }
    
    // GET /posts/:id
    async show(req, res) {
        try {
            const db = await connection.connect();
            const result = await Post.findById(db, new ObjectId(req.params.id));
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json('error');
        } finally {
            await connection.close();
        }
    }

    // POST /posts/create
    async createPost(req, res) {
        try {
            const db = await connection.connect();
            const { content, img, } = req.body;
            const post = new Post(undefined, content, img);
            const result = await post.save(db);
            res.status(201).json({
                success: true,
                message: 'Post created successfully',
                post: result
            });
        } catch (err) {
            console.error(err);
            res.status(500).json('error');
        } finally {
            await connection.close();
        }
    }
}    

export default new PostController();
