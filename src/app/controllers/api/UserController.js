import User from "../../models/User.js";
import connection from "../../../config/db/index.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';

class UserController {

    // GET /user
    async index(req, res) {
        try {
            const db = await connection.connect();
            const result = await User.findAll(db);
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message })
        } finally {
            await connection.close();
        }
    }
    
    // GET /user/:id
    async show(req, res) {
        try {
            const db = await connection.connect();
            const result = await User.findById(db, new ObjectId(req.params.id));
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json('error');
        } finally {
            await connection.close();
        }
    }

    // POST /user/create
    async createUser(req, res) {
        try {
            const db = await connection.connect();
            const { name, email, pass } = req.body;

            const hashedPassword = await bcrypt.hash(pass, 10); 

            const user = new User(undefined, name, email, hashedPassword); 
            const result = await user.save(db);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: result
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        } finally {
            await connection.close();
        }
    }
}   

export default new UserController();
