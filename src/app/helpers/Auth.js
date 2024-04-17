import jwt from "jsonwebtoken";
import "dotenv/config.js";
import express from 'express';
import cookieParser from 'cookie-parser'; 

// const app = express();
// app.use(cookieParser()); 

class Auth {
    static createJWTToken(email,id, res) {
        const payLoad =  {
            email: email,
            id: id
        };

        const options = {
            expiresIn: '1h',
            algorithm: 'HS256'
        };

        const token = jwt.sign(payLoad, process.env.SECRET_KEY, options);
        console.log(`Token: ${token}`);
        
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); 
        
        return token;
    }

    static verifyJWTToken = (req, res, next) => {
        // Lấy token từ header HTTP Authorization
        let token = null;
        const authHeader = req.headers['authorization'];
        if(authHeader != null) {
            token = authHeader && authHeader.split(' ')[1];
        } else {
            // Lấy token từ cookie HTTP
            token = req.cookies.token;
        }
        if(token == null) return res.status(401).json({ message: 'Unauthorized' });
    
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(403).json({ message: 'Invalid token' });
            } else {
                // Trích xuất thông tin người dùng từ token và lưu trữ trong req
                req.user = decoded;
                next();
            }
        });
    }
}    

export default Auth;


