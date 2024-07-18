import User from "../models/User.js";
import connection from "../../config/db/index.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';
import Auth from "../helpers/Auth.js";
import jwt from 'jsonwebtoken'; // hoặc const jwt = require('jsonwebtoken');
import Post from '../models/Post.js'


class UserController {
    // GET/user
    login(req, res){
        res.render('user/user');
    }
    // GET/user/store/Login
    async sign(req, res) {
    const email = req.body.email;
    const password = req.body.pass;
    console.log(`Email: ${email} | Password: ${password}`);
    connection.connect().then(async (db) => {
        try {
            const users = await User.findByEmail(db, email);
            if (!users) {
                console.log('User not found');
                return res.status(400).send('<script>alert("Email chưa được tạo!"); window.location.href = "/";</script>');
            }
            
            bcrypt.compare(password, users.pass, (err, result) => {
                if (err) {
                    console.error(err);
                    console.log(`Email: ${email} | Password: ${password}`);
                    return res.status(500).json({ message: 'An error occurred' });
                }
                if (result) {
                    const token = Auth.createJWTToken(email, users._id, res);
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: false, // false if not using https | true if using https
                        sameSite: 'strict', // use 'strict', 'lax', or 'none'
                        maxAge: 3600000, // expired time, should set to match token expiry (1h)
                    });

                    return res.status(400).send(`<script>alert("Đăng nhập thành công"); window.location.href = "/";</script>`);
                } else {
                    console.log('Incorrect password');
                    return res.status(400).json({ message: 'Incorrect password' });
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'An error occurred' });
        }
    });
}


    // GET/user/create
    create(req, res){
        res.render('user/sign');
    }

    // USER /user/store/create
    async store(req, res) {
        console.log(req.body);
        connection.connect().then(async (db) => {
            try {
                const existingUser = await db.collection('users').findOne({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).send('<script>alert("Email đã tồn tại."); window.location.href = "/user/sign";</script>');
                }
                if (req.body.pass !== req.body.confirm_pass) {
                    return res.status(400).send('<script>alert("Mật khẩu không khớp."); window.location.href = "/user/sign";</script>');
                }
                if (req.body.pass.length < 6) {
                    return res.status(400).send('<script>alert("Mật khẩu phải có ít nhất 6 ký tự."); window.location.href = "/user/sign";</script>');
                }
                
                const hashedPassword = await bcrypt.hash(req.body.pass, 10);
                const user = new User(undefined, req.body.name, req.body.email, hashedPassword, req.body.identity);
                const result = await user.save(db);
    
                console.log(result);
    
                res.send('<script>alert("Đăng ký thành công."); window.location.href = "/user";</script>');
            } catch (err) {
                console.error(err);
                res.status(500).send('An error occurred');
            } finally {
                await connection.close();
            }
        });
    }
    
    async myAcc(req, res) {
        if (!req.cookies.token) {
            return res.redirect('/user');
        }
        
        Auth.verifyJWTToken(req, res, async () => {
            try {
                const db = await connection.connect();
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

                if (result_user.identity === 'user') {
                    const result_post = await Post.findAll(db);
                    res.render('user/myAcc', { posts: result_post, user: result_user });
                } else if (result_user.identity === 'admin') {
                    const result_post = await Post.findAll(db);
                    const result_user_all = await User.findAll(db);
                    res.render('user/myAdminAcc', { posts: result_post, user: result_user , users: result_user_all });  
                } else {
                    throw new Error(`Identity không hợp lệ: ${result_user.identity}`);
                }
            } catch (error) {
                console.error('Lỗi khi tìm người dùng:', error);
                res.status(500).send(`Đã xảy ra lỗi: ${error.message}`);
            } finally {
                // Đóng kết nối cơ sở dữ liệu
                await connection.close();
            }
        });
    }
    
    delete(req, res) {
        const userId = req.body.userId; // Lấy id của bài viết cần xóa từ req.body
        if (!userId) {
            return res.status(400).send("ID của user không được cung cấp");
        }
    
        connection.connect().then(async (db) => {
            try {
                const result = await User.delete(db, new ObjectId(userId)); // Sử dụng ObjectId để tạo ObjectId từ string postId
                console.log(result);
                // Trả về một mã JavaScript để hiển thị thông báo thành công và tải lại trang
                res.send('<script>alert("User đã được xóa thành công."); window.location.href = "/user/myAcc";</script>');
            } catch (err) {
                console.error(err);
                res.status(500).send("An error occurred");
            }
        });
    }

    async logout(req, res) {
        res.clearCookie('token');
        res.redirect('/user'); 
    }

    show(req, res){
        console.log(req.params.id);
        res.send('show');
    }

}

export default new UserController();