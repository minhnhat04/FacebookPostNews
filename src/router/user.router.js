import express from 'express';
import UserController from '../app/controllers/UseControllers.js';

const router = express.Router();

router.post('/store', UserController.store); 
router.post('/storelogin', UserController.sign); 
router.post('/deleteUser', UserController.delete); 
router.get('/myAcc', UserController.myAcc);
router.get('/sign', UserController.create); 
router.get('/logout', UserController.logout); 
router.get('/:id', UserController.show);
router.get('/', UserController.login);


export default router;
