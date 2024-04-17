import Post from "../models/Post.js";
import User from "../models/User.js"; // Import model User
import connection from "../../config/db/index.js";
import jwt from 'jsonwebtoken';
import Auth from "../helpers/Auth.js";


class SiteController {

    async showhome(req, res) {
        if (!req.cookies.token) {
            return res.redirect('/user');
        }
        
        Auth.verifyJWTToken(req, res, async () => {
            try {
                const db = await connection.connect();
                const result_post = await Post.findAll(db);
                const token = req.cookies.token;
                const decodedToken = jwt.decode(token);
    
                if (!decodedToken || !decodedToken.id) {
                    throw new Error('Token không chứa trường userId');
                }
                
                const userId = decodedToken.id;
                const result_user = await User.findById(db, userId);
                
                if (!result_user) {
                    const errorMessage = `Không tìm thấy người dùng với ID: ${userId}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }
                
                res.render('home', { posts: result_post, user: result_user }); // Lưu ý là truyền 'user' chứ không phải 'users'
            } catch (error) {
                console.error('Lỗi khi tìm người dùng:', error);
                res.status(500).send(`Đã xảy ra lỗi: ${error.message}`);
            }
        });
    }
    
    search(req, res) {
        res.render('search');
    }
}

export default new SiteController();
